
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    const processCallback = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

      if (!supabaseUrl || !supabaseKey) {
        setStatus({
          type: 'error',
          text: 'Authentication configuration is missing. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set. Contact support if the issue persists.',
        })
        setLoading(false)
        return
      }

      if (!supabase) {
        supabase = createClient(supabaseUrl, supabaseKey)
      }

      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Supabase getSession error:', error)
          setStatus({
            type: 'error',
            text: 'Unable to retrieve session. Please try signing in again.',
          })
          setLoading(false)
          return
        }

        const session = data.session
        if (session?.user) {
          setSignedIn(true)
          setStatus({
            type: 'success',
            text: 'Email confirmed! You are signed in and will be redirected to your portal.',
          })
          window.setTimeout(() => {
            router.replace('/portal')
          }, 2200)
          return
        }

        setStatus({
          type: 'success',
          text: 'Your email has been confirmed. Please sign in to continue.',
        })
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setStatus({
          type: 'error',
          text: error?.message || 'Unable to process the authentication callback.',
        })
      } finally {
        setLoading(false)
      }
    }

    processCallback()
  }, [router])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,176,79,0.14),_transparent_35%),#06170f] flex items-center justify-center px-4 py-10 text-slate-100">
      <div className="w-full max-w-xl rounded-[2rem] border border-[#334d3a] bg-slate-950/90 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Email confirmation complete</h1>
          <p className="mt-3 text-sm text-slate-400">
            {loading ? 'Finishing your sign-in flow…' : status?.text}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {!loading && (
            <>
              <button
                type="button"
                onClick={() => router.push('/signin')}
                className="rounded-3xl bg-gradient-to-r from-[#c8ad4d] via-[#e0c56e] to-[#d19f38] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-[0_18px_30px_rgba(210,176,79,0.22)] transition hover:brightness-110"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => router.push('/courses')}
                className="rounded-3xl border border-[#4c6d54] bg-slate-950/50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-900"
              >
                Browse Courses
              </button>
            </>
          )}
        </div>

        {!loading && signedIn && (
          <div className="mt-6 text-center text-sm text-slate-400">
            If you are not redirected automatically, <Link href="/portal" className="font-semibold text-[#d4b04f] hover:text-[#f1d87f]">go to your portal</Link>.
          </div>
        )}
      </div>
    </main>
  )
}
