import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateCodeRequest {
  code: string;
  max_uses?: number | null;
  expires_at?: string | null;
  description?: string;
}

interface UpdateCodeRequest {
  id: string;
  is_active?: boolean;
  max_uses?: number | null;
  expires_at?: string | null;
  description?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'list';

    // ========================================
    // LIST ACCESS CODES
    // ========================================
    if (req.method === 'GET' && action === 'list') {
      const { data: codes, error } = await supabase
        .from('access_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch access codes' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, codes }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // GET STATS
    // ========================================
    if (req.method === 'GET' && action === 'stats') {
      const { data: stats, error } = await supabase
        .from('auth_security_stats')
        .select('*')
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch stats' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, stats }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // CREATE ACCESS CODE
    // ========================================
    if (req.method === 'POST' && action === 'create') {
      const { code, max_uses, expires_at, description }: CreateCodeRequest = await req.json();

      if (!code || code.length < 4) {
        return new Response(
          JSON.stringify({ error: 'Code must be at least 4 characters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: newCode, error } = await supabase
        .from('access_codes')
        .insert({
          code: code.toUpperCase().trim(),
          max_uses: max_uses || null,
          expires_at: expires_at || null,
          description: description || null,
          is_active: true,
          current_uses: 0,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return new Response(
            JSON.stringify({ error: 'Access code already exists' }),
            { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ error: 'Failed to create access code' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, code: newCode }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // UPDATE ACCESS CODE
    // ========================================
    if (req.method === 'POST' && action === 'update') {
      const { id, is_active, max_uses, expires_at, description }: UpdateCodeRequest = await req.json();

      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Access code ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const updateData: any = {};
      if (is_active !== undefined) updateData.is_active = is_active;
      if (max_uses !== undefined) updateData.max_uses = max_uses;
      if (expires_at !== undefined) updateData.expires_at = expires_at;
      if (description !== undefined) updateData.description = description;

      const { data: updatedCode, error } = await supabase
        .from('access_codes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to update access code' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, code: updatedCode }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // DELETE ACCESS CODE
    // ========================================
    if (req.method === 'POST' && action === 'delete') {
      const { id } = await req.json();

      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Access code ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error } = await supabase
        .from('access_codes')
        .delete()
        .eq('id', id);

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to delete access code' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Access code deleted' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Unknown action
    return new Response(
      JSON.stringify({ error: 'Invalid action. Use: list, stats, create, update, delete' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
