import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Subscribe to real-time updates for a specific table
 * @param table - Table name to subscribe to
 * @param callback - Function to call when data changes
 * @param filter - Optional filter for the subscription
 */
export function subscribeToTable(
  table: string,
  callback: (payload: any) => void,
  filter?: { column: string; value: any }
) {
  if (!supabase) {
    console.warn('Supabase client not initialized. Real-time updates disabled.');
    return null;
  }

  const channel = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
      },
      (payload) => {
        console.log('🔄 Real-time update received:', payload);
        callback(payload);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Unsubscribe from a channel
 */
export function unsubscribeFromChannel(channel: any) {
  if (channel && supabase) {
    supabase.removeChannel(channel);
  }
}
