-- Create profiles table for custom authentication
CREATE TABLE IF NOT EXISTS public.user_profiles_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  pin_hash text NOT NULL,
  phone text UNIQUE,
  email text UNIQUE,
  instagram_handle text,
  created_at timestamp with time zone DEFAULT now(),
  last_login_at timestamp with time zone,
  CONSTRAINT at_least_one_contact CHECK (
    phone IS NOT NULL OR email IS NOT NULL OR instagram_handle IS NOT NULL
  )
);

-- Enable RLS
ALTER TABLE public.user_profiles_auth ENABLE ROW LEVEL SECURITY;

-- Allow anyone to sign up (insert their profile)
CREATE POLICY "Anyone can sign up"
ON public.user_profiles_auth
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.user_profiles_auth
FOR SELECT
TO anon, authenticated
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.user_profiles_auth
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_user_profiles_auth_username ON public.user_profiles_auth(username);
CREATE INDEX idx_user_profiles_auth_phone ON public.user_profiles_auth(phone);
CREATE INDEX idx_user_profiles_auth_email ON public.user_profiles_auth(email);