import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignupRequest {
  username: string;
  pin: string;
  phone?: string;
  email?: string;
  instagram_handle?: string;
  access_code?: string; // Optional for now, but recommended
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { username, pin, phone, email, instagram_handle, access_code }: SignupRequest = await req.json();

    // ========================================
    // 1. VALIDATION
    // ========================================
    if (!username || !pin) {
      return new Response(
        JSON.stringify({ error: 'Username and PIN are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Username validation (3-20 chars, alphanumeric + underscore)
    if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      return new Response(
        JSON.stringify({ error: 'Username must be 3-20 characters (letters, numbers, underscore only)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PIN validation (exactly 4 digits)
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return new Response(
        JSON.stringify({ error: 'PIN must be exactly 4 digits' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Contact method validation
    if (!phone && !email && !instagram_handle) {
      return new Response(
        JSON.stringify({ error: 'At least one contact method (phone, email, or Instagram) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email format validation (if provided)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Phone format validation (if provided) - basic check
    if (phone && !/^\+?[\d\s\-()]{10,}$/.test(phone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // 2. ACCESS CODE VALIDATION (Optional but recommended)
    // ========================================
    if (access_code) {
      const { data: codeData, error: codeError } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', access_code.toUpperCase().trim())
        .eq('is_active', true)
        .single();

      if (codeError || !codeData) {
        console.log('Invalid access code:', access_code);
        return new Response(
          JSON.stringify({ error: 'Invalid or expired access code' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if code has expired
      if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'Access code has expired' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if code has reached max uses
      if (codeData.max_uses !== null && codeData.current_uses >= codeData.max_uses) {
        return new Response(
          JSON.stringify({ error: 'Access code has reached maximum uses' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Increment code usage
      await supabase
        .from('access_codes')
        .update({ current_uses: codeData.current_uses + 1 })
        .eq('id', codeData.id);
    }
    // Note: If access_code is not provided, signup is still allowed
    // To make access codes mandatory, uncomment the block below:
    /*
    else {
      return new Response(
        JSON.stringify({ error: 'Access code is required for signup' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    */

    // ========================================
    // 3. HASH PIN WITH BCRYPT (Secure with salt)
    // ========================================
    const saltRounds = 12; // Higher is more secure but slower
    const pin_hash = await bcrypt.hash(pin, saltRounds);

    // ========================================
    // 4. CREATE USER ACCOUNT
    // ========================================
    const { data: profile, error } = await supabase
      .from('user_profiles_auth')
      .insert({
        username: username.toLowerCase().trim(),
        pin_hash,
        phone: phone?.trim() || null,
        email: email?.toLowerCase().trim() || null,
        instagram_handle: instagram_handle?.trim() || null,
        is_active: true,
        failed_login_attempts: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Signup error:', error);

      // Handle specific database errors
      if (error.code === '23505') { // Unique constraint violation
        // Try to identify which field caused the conflict
        const message = error.message || '';
        if (message.includes('username')) {
          return new Response(
            JSON.stringify({ error: 'Username already exists' }),
            { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else if (message.includes('phone')) {
          return new Response(
            JSON.stringify({ error: 'Phone number already registered' }),
            { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else if (message.includes('email')) {
          return new Response(
            JSON.stringify({ error: 'Email already registered' }),
            { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ error: 'Username, phone, or email already exists' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to create account. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Signup successful:', { username, id: profile.id, access_code: !!access_code });

    // ========================================
    // 5. RETURN SUCCESS RESPONSE
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
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
