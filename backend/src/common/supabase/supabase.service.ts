import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  public client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url) {
      throw new Error('Supabase URL is not configured. Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
    }
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
    }

    this.client = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async getUserFromAccessToken(accessToken?: string) {
    if (!accessToken) return null;
    const { data, error } = await this.client.auth.getUser(accessToken);
    if (error) return null;
    return data?.user ?? null;
  }

  async getProfile(userId: string) {
    const { data, error } = await this.client
      .from('profiles')
      .select('user_id, full_name, role')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
}
