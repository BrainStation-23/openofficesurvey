
import { createClient } from '@supabase/supabase-js';
import { UserCreateData, BatchUserResult } from './db-types';
import { corsHeaders } from './cors';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class AuthService {
  static async createUser(userData: UserCreateData): Promise<BatchUserResult> {
    try {
      const { data: user, error: createError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          first_name: userData.first_name,
          last_name: userData.last_name,
        },
      });

      if (createError) {
        throw createError;
      }

      return {
        success: true,
        user: {
          id: user.user.id,
          email: user.user.email!,
        },
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
  }
}
