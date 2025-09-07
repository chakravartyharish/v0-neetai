import { createClient } from '@supabase/supabase-js'
import { config } from '@neet/config'
import type { Database } from './types'

export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
)

export type SupabaseClient = typeof supabase
