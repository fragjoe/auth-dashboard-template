import { useState, useEffect, type ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { getSession, onAuthStateChange } from '@/api/auth'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check initial session
    const initAuth = async () => {
      const response = await getSession()
      if (response.data) {
        setSession(response.data)
        setUser(response.data.user)
      }
      setIsLoading(false)
    }

    initAuth()

    // Listen to auth changes
    const {
      data: { subscription },
    } = onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, isLoading }}>{children}</AuthContext.Provider>
  )
}
