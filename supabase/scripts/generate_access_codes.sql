-- Script to Generate Access Codes for TD STUDIOS
-- Run this in Supabase SQL Editor to create access codes

-- ==============================================
-- PRODUCTION ACCESS CODES
-- ==============================================

-- Single-use VIP codes (for special customers)
INSERT INTO public.access_codes (code, max_uses, description)
VALUES
  ('VIP2024', 1, 'VIP customer - single use'),
  ('FOUNDER01', 1, 'Founder access code #1'),
  ('FOUNDER02', 1, 'Founder access code #2'),
  ('FOUNDER03', 1, 'Founder access code #3')
ON CONFLICT (code) DO NOTHING;

-- Multi-use promotional codes
INSERT INTO public.access_codes (code, max_uses, expires_at, description)
VALUES
  -- Christmas 2024 promotion (50 uses, expires Dec 31)
  ('XMAS2024', 50, '2024-12-31 23:59:59', 'Christmas 2024 promotion'),

  -- New Year 2025 promotion (100 uses, expires Jan 15)
  ('NEWYEAR2025', 100, '2025-01-15 23:59:59', 'New Year 2025 promotion'),

  -- Limited beta access (25 uses)
  ('BETAACCESS', 25, NULL, 'Beta tester access'),

  -- Friend referral codes (10 uses each)
  ('FRIENDREF10', 10, NULL, 'Friend referral code'),
  ('WELCOMETD', 20, NULL, 'Welcome to TD Studios')
ON CONFLICT (code) DO NOTHING;

-- Unlimited access (for testing or open signup periods)
INSERT INTO public.access_codes (code, max_uses, description)
VALUES
  ('OPENHOUSE', NULL, 'Unlimited access - open house period')
ON CONFLICT (code) DO NOTHING;

-- Temporary codes with short expiration (1 week)
INSERT INTO public.access_codes (code, max_uses, expires_at, description)
VALUES
  ('WEEKLY' || to_char(now(), 'YYYYMMDD'), 50, now() + interval '7 days', 'Weekly promotional code')
ON CONFLICT (code) DO NOTHING;


-- ==============================================
-- UTILITY: Generate Random Codes
-- ==============================================

-- Function to generate random alphanumeric access codes
CREATE OR REPLACE FUNCTION generate_random_access_code(length integer DEFAULT 8)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Excluding similar chars (0,O,I,1)
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Generate 10 random single-use codes
DO $$
DECLARE
  i integer;
  random_code text;
BEGIN
  FOR i IN 1..10 LOOP
    random_code := generate_random_access_code(8);
    INSERT INTO public.access_codes (code, max_uses, description)
    VALUES (random_code, 1, 'Auto-generated single-use code')
    ON CONFLICT (code) DO NOTHING;
  END LOOP;
END $$;


-- ==============================================
-- VIEW CURRENT ACCESS CODES
-- ==============================================

-- Show all active access codes with usage stats
SELECT
  code,
  current_uses || CASE
    WHEN max_uses IS NULL THEN ' / ∞'
    ELSE ' / ' || max_uses::text
  END as usage,
  CASE
    WHEN max_uses IS NULL THEN 100.0
    WHEN max_uses = 0 THEN 0.0
    ELSE (current_uses::float / max_uses::float * 100)::numeric(5,1)
  END as "percent_used",
  CASE
    WHEN NOT is_active THEN 'INACTIVE'
    WHEN expires_at IS NOT NULL AND expires_at < now() THEN 'EXPIRED'
    WHEN max_uses IS NOT NULL AND current_uses >= max_uses THEN 'EXHAUSTED'
    ELSE 'ACTIVE'
  END as status,
  to_char(expires_at, 'YYYY-MM-DD HH24:MI') as expires,
  description,
  to_char(created_at, 'YYYY-MM-DD') as created
FROM public.access_codes
ORDER BY
  CASE
    WHEN is_active AND (expires_at IS NULL OR expires_at > now()) AND (max_uses IS NULL OR current_uses < max_uses) THEN 1
    ELSE 2
  END,
  created_at DESC;


-- ==============================================
-- MAINTENANCE QUERIES
-- ==============================================

-- Deactivate expired codes
UPDATE public.access_codes
SET is_active = false
WHERE expires_at IS NOT NULL
  AND expires_at < now()
  AND is_active = true;

-- Deactivate exhausted codes
UPDATE public.access_codes
SET is_active = false
WHERE max_uses IS NOT NULL
  AND current_uses >= max_uses
  AND is_active = true;

-- Show codes needing attention
SELECT
  code,
  description,
  CASE
    WHEN expires_at IS NOT NULL AND expires_at < now() THEN 'Expired - should deactivate'
    WHEN max_uses IS NOT NULL AND current_uses >= max_uses THEN 'Exhausted - should deactivate'
    WHEN max_uses IS NOT NULL AND current_uses::float / max_uses::float > 0.9 THEN 'Almost exhausted - ' || (max_uses - current_uses)::text || ' uses left'
    WHEN expires_at IS NOT NULL AND expires_at < now() + interval '7 days' THEN 'Expiring soon - ' || (expires_at - now())::text
    ELSE 'OK'
  END as status_message
FROM public.access_codes
WHERE is_active = true
  AND (
    (expires_at IS NOT NULL AND expires_at < now() + interval '7 days')
    OR (max_uses IS NOT NULL AND current_uses::float / max_uses::float > 0.8)
  )
ORDER BY
  CASE
    WHEN expires_at IS NOT NULL AND expires_at < now() THEN 1
    WHEN max_uses IS NOT NULL AND current_uses >= max_uses THEN 2
    ELSE 3
  END;
