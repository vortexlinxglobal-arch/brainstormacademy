import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, auth, db } from '../api'

interface Profile {
  id: string
  email: string
  role: 'public' | 'student' | 'instructor' | 'staff' | 'admin'
  first_name?: string
  last_name?: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, userData?: any) => Promise<any>
  signOut: () => Promise<any>
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // During SSR/prerendering, return a loading state
    if (typeof window === 'undefined') {
      return {
        user: null,
        session: null,
        profile: null,
        loading: true,
        signIn: async () => {},
        signUp: async () => {},
        signOut: async () => {},
        refreshProfile: async () => {},
      }
    }
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null)
      return
    }

    try {
      const { data, error } = await db.getProfile(user.id)
      if (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error refreshing profile:', error)
      setProfile(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    const result = await auth.signIn(email, password)
    return result
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    const result = await auth.signUp(email, password, userData)
    return result
  }

  const signOut = async () => {
    const result = await auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
    return result
  }

  useEffect(() => {
    // Only run auth logic on client side
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await refreshProfile()
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await refreshProfile()
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}