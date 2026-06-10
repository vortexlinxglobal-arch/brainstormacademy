'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/src/api'

interface Profile {
  id: string
  role: string
  first_name?: string
  last_name?: string
  email?: string
}

interface PortalSectionShellProps {
  title: string
  description: string
  allowedRoles: string[]
  children: React.ReactNode
}

export function PortalSectionShell({ title, description, allowedRoles, children }: PortalSectionShellProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [status, setStatus] = useState<'unauthenticated' | 'forbidden' | 'ready' | 'error'>('unauthenticated')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      try {
        const sessionResult = await auth.getSession()
        const user = sessionResult.data.session?.user

        if (!user) {
          setStatus('unauthenticated')
          return
        }

        const profileResult = await db.getProfile(user.id)
        if (profileResult.error || !profileResult.data) {
          setMessage(profileResult.error?.message || 'Unable to load profile data.')
          setStatus('error')
          return
        }

        const profileData = profileResult.data as Profile
        setProfile(profileData)

        const normalizedRole = profileData.role?.toLowerCase?.() || ''
        const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase())
        if (!normalizedAllowedRoles.includes(normalizedRole)) {
          setStatus('forbidden')
          return
        }

        setStatus('ready')
      } catch (error) {
        console.error('Portal section load failed:', error)
        setMessage('Unable to verify your account. Please sign in again.')
        setStatus('error')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [allowedRoles])

  const handleSignOut = async () => {
    await auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-sm shadow-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">Portal access required</h1>
          <p className="mt-4 text-base leading-7 text-slate-700">
            You need to sign in to view this portal section. If you do not have a staff account, ask your administrator to provision one with your email and phone number.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (status === 'forbidden') {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-sm shadow-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">Access denied</h1>
          <p className="mt-4 text-base leading-7 text-slate-700">
            Your account role does not have permission to access this section.
          </p>
          <p className="mt-2 text-sm text-slate-700">
            Current role: <span className="font-semibold text-slate-900">{profile?.role || 'Unknown'}</span>
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/portal"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Return to portal home
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-sm shadow-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">Unable to load portal</h1>
          <p className="mt-4 text-base leading-7 text-slate-700">{message || 'There was a problem loading your profile.'}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Sign In Again
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-white p-10 shadow-sm shadow-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-700">{title}</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">{description}</h1>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                Welcome back, {profile?.first_name ?? profile?.email ?? 'member'}. Use the workspace below to manage your portal tasks.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              <p className="text-slate-700">Portal role</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.role}</p>
            </div>
          </div>
        </section>

        {children}
      </div>
    </main>
  )
}
