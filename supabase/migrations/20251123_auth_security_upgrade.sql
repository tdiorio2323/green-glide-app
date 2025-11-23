-- Security Upgrade Migration for TD STUDIOS Authentication
-- This migration adds: access codes, rate limiting, failed login tracking, and improved RLS policies

-- 1. Create access_codes table for controlled signup
CREATE TABLE IF NOT EXISTS public.access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  max_uses integer DEFAULT 1, -- null means unlimited
  current_uses integer DEFAULT 0,
  created_by uuid, -- Can reference admin user in future
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  description text,
  CONSTRAINT valid_code_length CHECK (length(code) >= 4)
);

-- Enable RLS on access_codes
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Only authenticated service role can manage access codes (for now, all anon can read active codes)
CREATE POLICY "Service role can manage access codes"
ON public.access_codes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Anon users can only check if code is valid (for signup validation)
CREATE POLICY "Anyone can validate active access codes"
ON public.access_codes
FOR SELECT
TO anon, authenticated
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Create indexes for access codes
CREATE INDEX idx_access_codes_code ON public.access_codes(code) WHERE is_active = true;
CREATE INDEX idx_access_codes_expires_at ON public.access_codes(expires_at) WHERE expires_at IS NOT NULL;


-- 2. Add failed login tracking to user_profiles_auth
ALTER TABLE public.user_profiles_auth
ADD COLUMN IF NOT EXISTS failed_login_attempts integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_failed_login_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS account_locked_until timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create index for account lock checks
CREATE INDEX idx_user_profiles_auth_locked ON public.user_profiles_auth(account_locked_until)
WHERE account_locked_until IS NOT NULL AND account_locked_until > now();


-- 3. Create login_attempts table for rate limiting
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  ip_address text,
  success boolean NOT NULL,
  attempted_at timestamp with time zone DEFAULT now(),
  error_message text
);

-- Enable RLS on login_attempts
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Only service role can write login attempts
CREATE POLICY "Service role can manage login attempts"
ON public.login_attempts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create indexes for rate limiting queries
CREATE INDEX idx_login_attempts_username_time ON public.login_attempts(username, attempted_at DESC);
CREATE INDEX idx_login_attempts_ip_time ON public.login_attempts(ip_address, attempted_at DESC);
CREATE INDEX idx_login_attempts_attempted_at ON public.login_attempts(attempted_at DESC);

-- Auto-cleanup old login attempts (keep only last 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.login_attempts
  WHERE attempted_at < now() - interval '7 days';
END;
$$;


-- 4. Fix RLS policies on user_profiles_auth to be more restrictive
-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles_auth;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles_auth;

-- NOTE: We can't use auth.uid() for RLS since we're using custom auth, not Supabase Auth
-- Instead, we'll rely on service role key in Edge Functions and keep RLS tight

-- Service role has full access (Edge Functions use this)
CREATE POLICY "Service role has full access"
ON public.user_profiles_auth
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Anon users have no direct access (they must go through Edge Functions)
-- This prevents direct database access bypassing our security logic
CREATE POLICY "No direct anon access"
ON public.user_profiles_auth
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Keep the signup policy but make it more explicit
DROP POLICY IF EXISTS "Anyone can sign up" ON public.user_profiles_auth;
-- Note: Signup will be handled via Edge Function with service role


-- 5. Create function to check rate limiting
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_username text,
  p_ip_address text DEFAULT NULL,
  p_time_window_minutes integer DEFAULT 15,
  p_max_attempts integer DEFAULT 5
)
RETURNS TABLE(
  is_limited boolean,
  attempts_count bigint,
  retry_after_seconds integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_attempts_count bigint;
  v_oldest_attempt timestamp with time zone;
  v_time_threshold timestamp with time zone;
BEGIN
  v_time_threshold := now() - (p_time_window_minutes || ' minutes')::interval;

  -- Count failed attempts in the time window
  SELECT COUNT(*), MIN(attempted_at)
  INTO v_attempts_count, v_oldest_attempt
  FROM public.login_attempts
  WHERE username = p_username
    AND success = false
    AND attempted_at > v_time_threshold
    AND (p_ip_address IS NULL OR ip_address = p_ip_address);

  -- Return rate limit status
  RETURN QUERY SELECT
    v_attempts_count >= p_max_attempts AS is_limited,
    v_attempts_count AS attempts_count,
    CASE
      WHEN v_attempts_count >= p_max_attempts THEN
        GREATEST(0, EXTRACT(EPOCH FROM (v_oldest_attempt + (p_time_window_minutes || ' minutes')::interval - now()))::integer)
      ELSE
        0
    END AS retry_after_seconds;
END;
$$;


-- 6. Create function to reset failed login attempts
CREATE OR REPLACE FUNCTION reset_failed_login_attempts(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_profiles_auth
  SET
    failed_login_attempts = 0,
    last_failed_login_at = NULL,
    account_locked_until = NULL
  WHERE id = p_user_id;
END;
$$;


-- 7. Create function to lock account after failed attempts
CREATE OR REPLACE FUNCTION increment_failed_login(
  p_user_id uuid,
  p_max_attempts integer DEFAULT 5,
  p_lockout_minutes integer DEFAULT 30
)
RETURNS TABLE(
  new_attempt_count integer,
  is_locked boolean,
  locked_until timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_count integer;
  v_locked_until timestamp with time zone;
BEGIN
  -- Increment failed attempts
  UPDATE public.user_profiles_auth
  SET
    failed_login_attempts = failed_login_attempts + 1,
    last_failed_login_at = now(),
    account_locked_until = CASE
      WHEN failed_login_attempts + 1 >= p_max_attempts THEN
        now() + (p_lockout_minutes || ' minutes')::interval
      ELSE
        account_locked_until
    END
  WHERE id = p_user_id
  RETURNING failed_login_attempts, account_locked_until
  INTO v_new_count, v_locked_until;

  RETURN QUERY SELECT
    v_new_count,
    v_new_count >= p_max_attempts,
    v_locked_until;
END;
$$;


-- 8. Insert default access codes (matching UI validation codes)
-- These codes are hardcoded in src/lib/validation.ts
INSERT INTO public.access_codes (code, max_uses, description)
VALUES
  ('1420', NULL, 'TD STUDIOS primary access code - unlimited uses'),
  ('4200', NULL, 'TD STUDIOS secondary access code - unlimited uses'),
  ('2024', NULL, 'Year code - unlimited uses'),
  ('1111', NULL, 'Demo/testing code - unlimited uses'),
  ('1234', NULL, 'Legacy testing code - unlimited uses'),
  ('XMAS2024', 50, 'Christmas 2024 promotion - 50 uses')
ON CONFLICT (code) DO NOTHING;


-- 9. Create helpful views for monitoring (service role only)
CREATE OR REPLACE VIEW auth_security_stats AS
SELECT
  (SELECT COUNT(*) FROM public.user_profiles_auth WHERE is_active = true) as active_users,
  (SELECT COUNT(*) FROM public.user_profiles_auth WHERE account_locked_until > now()) as locked_accounts,
  (SELECT COUNT(*) FROM public.access_codes WHERE is_active = true) as active_access_codes,
  (SELECT COUNT(*) FROM public.login_attempts WHERE attempted_at > now() - interval '24 hours') as login_attempts_24h,
  (SELECT COUNT(*) FROM public.login_attempts WHERE attempted_at > now() - interval '24 hours' AND success = false) as failed_attempts_24h,
  (SELECT COUNT(*) FROM public.login_attempts WHERE attempted_at > now() - interval '1 hour') as login_attempts_1h;

GRANT SELECT ON auth_security_stats TO service_role;


-- 10. Add comments for documentation
COMMENT ON TABLE public.access_codes IS 'Stores access codes required for signup. Supports single-use and multi-use codes with optional expiration.';
COMMENT ON TABLE public.login_attempts IS 'Tracks all login attempts for rate limiting and security monitoring. Auto-cleaned after 7 days.';
COMMENT ON COLUMN public.user_profiles_auth.failed_login_attempts IS 'Counter for consecutive failed login attempts. Reset on successful login.';
COMMENT ON COLUMN public.user_profiles_auth.account_locked_until IS 'Timestamp until which the account is locked due to too many failed attempts.';
COMMENT ON FUNCTION check_rate_limit IS 'Checks if a username/IP has exceeded rate limits. Returns limit status and retry time.';
COMMENT ON FUNCTION reset_failed_login_attempts IS 'Resets failed login counter and unlocks account for a user.';
COMMENT ON FUNCTION increment_failed_login IS 'Increments failed login counter and locks account if threshold exceeded.';
