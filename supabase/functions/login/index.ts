import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LoginRequest {
  username: string;
  pin: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { username, pin }: LoginRequest = await req.json();

    // Validation
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

    // Hash the provided PIN
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const provided_pin_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Find user by username
    const { data: profile, error } = await supabase
      .from('user_profiles_auth')
      .select('*')
      .eq('username', username.toLowerCase().trim())
      .single();

    if (error || !profile) {
      console.log('Login failed: User not found');
      return new Response(
        JSON.stringify({ error: 'Invalid username or PIN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify PIN
    if (profile.pin_hash !== provided_pin_hash) {
      console.log('Login failed: Invalid PIN');
      return new Response(
        JSON.stringify({ error: 'Invalid username or PIN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update last login time
    await supabase
      .from('user_profiles_auth')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', profile.id);

    console.log('Login successful:', { username, id: profile.id });

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