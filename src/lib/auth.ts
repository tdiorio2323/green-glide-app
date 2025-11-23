import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  username: string;
  phone?: string;
  email?: string;
  instagram_handle?: string;
  created_at: string;
}

const AUTH_STORAGE_KEY = 'td_studios_user';

export const auth = {
  async signup(data: {
    username: string;
    pin: string;
    phone?: string;
    email?: string;
    instagram_handle?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data: result, error } = await supabase.functions.invoke('signup', {
        body: data,
      });

      if (error) throw error;

      if (result.success && result.user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(result.user));
        return { success: true, user: result.user };
      }

      return { success: false, error: result.error || 'Signup failed' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  },

  async login(username: string, pin: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data: result, error } = await supabase.functions.invoke('login', {
        body: { username, pin },
      });

      if (error) throw error;

      if (result.success && result.user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(result.user));
        return { success: true, user: result.user };
      }

      return { success: false, error: result.error || 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  },

  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  getUser(): User | null {
    const userStr = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getUser();
  }
};