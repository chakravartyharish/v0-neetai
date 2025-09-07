'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@neet/database'

export interface AuthState {
  user: User | null
  loading: boolean
  error: Error | null
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setState({ user: null, loading: false, error })
          return
        }

        setState({ user: session?.user ?? null, loading: false, error: null })
      } catch (error) {
        setState({ user: null, loading: false, error: error as Error })
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState({ user: session?.user ?? null, loading: false, error: null })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return state
}
