export * from './hooks'
export * from './types'

// Client-side exports
export { createClientSupabase, supabaseClient } from './utils/client-supabase'

// Server-side exports  
export { createServerSupabase, createServiceSupabase, supabaseAdmin, authConfig, handleAuthError, authEvents } from './utils/supabase'
export type { Database } from './utils/supabase'
