import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { username, pin, phone, email, instagram_handle }: SignupRequest = await req.json();

    // Validation
    if (!username || !pin) {
      return new Response(
        JSON.stringify({ error: 'Username and PIN are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return new Response(
        JSON.stringify({ error: 'PIN must be exactly 4 digits' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!phone && !email && !instagram_handle) {
      return new Response(
        JSON.stringify({ error: 'At least one contact method (phone, email, or Instagram) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash the PIN using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const pin_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Insert user profile
    const { data: profile, error } = await supabase
      .from('user_profiles_auth')
      .insert({
        username: username.toLowerCase().trim(),
        pin_hash,
        phone: phone?.trim() || null,
        email: email?.toLowerCase().trim() || null,
        instagram_handle: instagram_handle?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Signup error:', error);
      
      if (error.code === '23505') { // Unique constraint violation
        return new Response(
          JSON.stringify({ error: 'Username, phone, or email already exists' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to create account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Signup successful:', { username, id: profile.id });

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: profile.id,
          username: profile.username,
          phone: profile.phone,
          email: profile.email,
          instagram_handle: profile.instagram_handle,
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