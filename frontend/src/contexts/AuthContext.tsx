import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { db } from '../api'

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
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const refreshTimer = useRef<number | null>(null)

  const scheduleRefresh = (expiresAt: number | null) => {
    // Clear previous timer
    if (refreshTimer.current) {
      window.clearTimeout(refreshTimer.current)
      refreshTimer.current = null
    }
    if (!expiresAt) return
    // expiresAt is seconds since epoch; schedule a refresh 60s before expiry
    const msUntilExpiry = expiresAt * 1000 - Date.now()
    const refreshIn = Math.max(msUntilExpiry - 60 * 1000, 5 * 1000)
    refreshTimer.current = window.setTimeout(() => {
      void refreshSession()
    }, refreshIn)
  }

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
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/v1/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signin failed')

      const sessionData = data.data?.session
      if (sessionData?.access_token) {
        setAccessToken(sessionData.access_token)
        setSession({} as Session)
        // schedule refresh based on expires_at
        scheduleRefresh(sessionData.expires_at)
      }

      // fetch profile/user
      try {
        const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/v1/auth/verify`, {
          headers: { Authorization: `Bearer ${sessionData.access_token}` },
        })
        const verifyData = await verifyRes.json()
        if (verifyRes.ok) {
          setUser({ id: verifyData.data.user.id } as User)
          setProfile(verifyData.data.student || null)
        }
      } catch (err) {
        console.error('Failed to verify after signin', err)
      }

      return data
    } catch (err) {
      return { error: err }
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, ...userData }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signup failed')
      return data
    } catch (err) {
      return { error: err }
    }
  }

  const signOut = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/v1/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Signout error', err)
    }
    // Clear client state
    setUser(null)
    setSession(null)
    setProfile(null)
    setAccessToken(null)
    if (refreshTimer.current) {
      window.clearTimeout(refreshTimer.current)
      refreshTimer.current = null
    }
    return { ok: true }
  }

  const refreshSession = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Refresh failed')
      const sessionData = data.data?.session
      if (sessionData?.access_token) {
        setAccessToken(sessionData.access_token)
        scheduleRefresh(sessionData.expires_at)
        // verify user
        try {
          const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}/v1/auth/verify`, {
            headers: { Authorization: `Bearer ${sessionData.access_token}` },
          })
          const verifyData = await verifyRes.json()
          if (verifyRes.ok) {
            setUser({ id: verifyData.data.user.id } as User)
            setProfile(verifyData.data.student || null)
          }
        } catch (err) {
          console.error('Verify failed after refresh', err)
        }
      }
      return data
    } catch (err) {
      console.error('refreshSession error', err)
      setUser(null)
      setProfile(null)
      setAccessToken(null)
      return null
    }
  }

  useEffect(() => {
    // Only run auth logic on client side
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }
    // Attempt to refresh session via backend cookie
    const init = async () => {
      setLoading(true)
      const refreshed = await refreshSession()
      if (refreshed && refreshed.data?.session) {
        setSession({} as Session)
        setLoading(false)
        if (user) await refreshProfile()
      } else {
        setLoading(false)
      }
    }

    init()

    // No subscription to supabase auth client here; backend controls cookie-based session
    return () => {
      if (refreshTimer.current) {
        window.clearTimeout(refreshTimer.current)
        refreshTimer.current = null
      }
    }
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