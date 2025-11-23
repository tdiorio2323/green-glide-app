import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LoginRequest {
  username: string;
  pin: string;
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MINUTES = 15;
const MAX_FAILED_ATTEMPTS = 5;
const ACCOUNT_LOCKOUT_MINUTES = 30;

// Helper function to get client IP address
function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
         req.headers.get('x-real-ip') ||
         'unknown';
}

// Helper function to log login attempt
async function logLoginAttempt(
  supabase: any,
  username: string,
  ipAddress: string,
  success: boolean,
  errorMessage?: string
) {
  await supabase
    .from('login_attempts')
    .insert({
      username: username.toLowerCase().trim(),
      ip_address: ipAddress,
      success,
      error_message: errorMessage || null,
    });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { username, pin }: LoginRequest = await req.json();

    // ========================================
    // 1. BASIC VALIDATION
    // ========================================
    if (!username || !pin) {
      return new Response(
        JSON.stringify({ error: 'Username and PIN are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return new Response(
        JSON.stringify({ error: 'Invalid PIN format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedUsername = username.toLowerCase().trim();

    // ========================================
    // 2. CHECK RATE LIMITING
    // ========================================
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        p_username: normalizedUsername,
        p_ip_address: clientIP,
        p_time_window_minutes: RATE_LIMIT_WINDOW_MINUTES,
        p_max_attempts: MAX_FAILED_ATTEMPTS,
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    } else if (rateLimitData && rateLimitData.length > 0) {
      const limitInfo = rateLimitData[0];

      if (limitInfo.is_limited) {
        console.log('Rate limit exceeded:', { username: normalizedUsername, ip: clientIP });

        return new Response(
          JSON.stringify({
            error: 'Too many failed login attempts. Please try again later.',
            retry_after_seconds: limitInfo.retry_after_seconds,
          }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Retry-After': String(limitInfo.retry_after_seconds),
            }
          }
        );
      }
    }

    // ========================================
    // 3. FIND USER AND CHECK IF ACCOUNT IS LOCKED
    // ========================================
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles_auth')
      .select('*')
      .eq('username', normalizedUsername)
      .single();

    if (profileError || !profile) {
      console.log('Login failed: User not found:', normalizedUsername);

      // Log failed attempt (but don't reveal that user doesn't exist)
      await logLoginAttempt(supabase, normalizedUsername, clientIP, false, 'User not found');

      return new Response(
        JSON.stringify({ error: 'Invalid username or PIN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if account is inactive
    if (!profile.is_active) {
      console.log('Login failed: Account inactive:', normalizedUsername);

      await logLoginAttempt(supabase, normalizedUsername, clientIP, false, 'Account inactive');

      return new Response(
        JSON.stringify({ error: 'Account is inactive. Please contact support.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if account is locked
    if (profile.account_locked_until) {
      const lockExpiry = new Date(profile.account_locked_until);
      if (lockExpiry > new Date()) {
        const secondsRemaining = Math.ceil((lockExpiry.getTime() - Date.now()) / 1000);
        console.log('Login failed: Account locked:', normalizedUsername);

        await logLoginAttempt(supabase, normalizedUsername, clientIP, false, 'Account locked');

        return new Response(
          JSON.stringify({
            error: 'Account is temporarily locked due to too many failed attempts.',
            retry_after_seconds: secondsRemaining,
          }),
          {
            status: 423,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Retry-After': String(secondsRemaining),
            }
          }
        );
      }
    }

    // ========================================
    // 4. VERIFY PIN WITH BCRYPT
    // ========================================
    let isPinValid = false;

    try {
      // First check if this is an old SHA-256 hash (64 hex characters)
      // This provides backward compatibility with existing accounts
      if (profile.pin_hash.length === 64 && /^[0-9a-f]{64}$/i.test(profile.pin_hash)) {
        // Old SHA-256 hash - verify with SHA-256
        const encoder = new TextEncoder();
        const data = encoder.encode(pin);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const provided_pin_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        isPinValid = profile.pin_hash === provided_pin_hash;

        // If valid, upgrade to bcrypt hash
        if (isPinValid) {
          console.log('Upgrading user to bcrypt hash:', normalizedUsername);
          const newHash = await bcrypt.hash(pin, 12);
          await supabase
            .from('user_profiles_auth')
            .update({ pin_hash: newHash })
            .eq('id', profile.id);
        }
      } else {
        // New bcrypt hash - use bcrypt.compare
        isPinValid = await bcrypt.compare(pin, profile.pin_hash);
      }
    } catch (error) {
      console.error('PIN verification error:', error);
      isPinValid = false;
    }

    // ========================================
    // 5. HANDLE FAILED LOGIN
    // ========================================
    if (!isPinValid) {
      console.log('Login failed: Invalid PIN:', normalizedUsername);

      // Log failed attempt
      await logLoginAttempt(supabase, normalizedUsername, clientIP, false, 'Invalid PIN');

      // Increment failed login counter and potentially lock account
      const { data: lockData } = await supabase
        .rpc('increment_failed_login', {
          p_user_id: profile.id,
          p_max_attempts: MAX_FAILED_ATTEMPTS,
          p_lockout_minutes: ACCOUNT_LOCKOUT_MINUTES,
        });

      if (lockData && lockData.length > 0) {
        const lockInfo = lockData[0];

        if (lockInfo.is_locked) {
          const lockExpiry = new Date(lockInfo.locked_until);
          const secondsRemaining = Math.ceil((lockExpiry.getTime() - Date.now()) / 1000);

          return new Response(
            JSON.stringify({
              error: `Too many failed attempts. Account locked for ${ACCOUNT_LOCKOUT_MINUTES} minutes.`,
              retry_after_seconds: secondsRemaining,
            }),
            {
              status: 423,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
                'Retry-After': String(secondsRemaining),
              }
            }
          );
        } else {
          const attemptsRemaining = MAX_FAILED_ATTEMPTS - lockInfo.new_attempt_count;
          return new Response(
            JSON.stringify({
              error: 'Invalid username or PIN',
              attempts_remaining: attemptsRemaining > 0 ? attemptsRemaining : undefined,
            }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      return new Response(
        JSON.stringify({ error: 'Invalid username or PIN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // 6. SUCCESSFUL LOGIN
    // ========================================
    console.log('Login successful:', { username: normalizedUsername, id: profile.id });

    // Log successful attempt
    await logLoginAttempt(supabase, normalizedUsername, clientIP, true);

    // Update user profile: reset failed attempts and update last login
    await supabase
      .from('user_profiles_auth')
      .update({
        last_login_at: new Date().toISOString(),
        failed_login_attempts: 0,
        last_failed_login_at: null,
        account_locked_until: null,
      })
      .eq('id', profile.id);

    // ========================================
    // 7. RETURN SUCCESS RESPONSE
    // ========================================
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: profile.id,
          username: profile.username,
          phone: profile.phone,
          email: profile.email,
          instagram_handle: profile.instagram_handle,
          created_at: profile.created_at,
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
