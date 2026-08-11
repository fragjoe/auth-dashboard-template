import { supabase } from './supabase'
import type { User, Session, Provider } from '@supabase/supabase-js'
import type { ApiResponse } from '@/types/property'

export interface AuthResponse {
  user?: User | null
  session?: Session | null
  error?: string
}

// Get current session
export async function getSession(): Promise<ApiResponse<Session | null>> {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw new Error(error.message)
    return { data: data.session, status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Get current user
export async function getUser(): Promise<ApiResponse<User | null>> {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw new Error(error.message)
    return { data: data.user, status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw new Error(error.message)
    return { user: data.user, session: data.session }
  } catch (error) {
    return { error: (error as Error).message }
  }
}

// Sign up with email and password
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    if (error) throw new Error(error.message)
    return { user: data.user, session: data.session }
  } catch (error) {
    return { error: (error as Error).message }
  }
}

// Sign in with Google OAuth
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google' as Provider,
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) throw new Error(error.message)
    return {}
  } catch (error) {
    return { error: (error as Error).message }
  }
}

// Sign out
export async function signOut(): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
    return { status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Reset password
export async function resetPassword(email: string): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw new Error(error.message)
    return { status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Update password
export async function updatePassword(newPassword: string): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw new Error(error.message)
    return { status: 200 }
  } catch (error) {
    return { error: (error as Error).message, status: 500 }
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback)
}
