'use client'

import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brainstormacademy.ng'
const supabase = createClient(supabaseUrl, supabaseKey)

function ConfirmEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = (searchParams?.get('email') || 'your email')
  const [countdown, setCountdown] = useState(30)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [resending, setResending] = useState(false)

  const handleResend = async () => {
    if (!email || email === 'your email') {
      setStatus({ type: 'error', text: 'Unable to resend confirmation email without an email address.' })
      return
    }

    const currentOrigin =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'https://brainstormacademy.ng'

    setResending(true)
    setStatus(null)
    const { error } = await supabase.auth.resend({
      email,
      type: 'signup',
      options: {
        emailRedirectTo: `${currentOrigin}/auth/callback`,
      },
    })

    if (error) {
      const normalized = error.message?.toLowerCase() || ''
      setStatus({
        type: 'error',
        text:
          normalized.includes('rate limit') ||
          normalized.includes('confirmation email recently')
            ? 'A confirmation email was sent recently. Please wait a few minutes before trying again.'
            : 'Unable to resend confirmation email. Please try again later.',
      })
    } else {
      setStatus({
        type: 'success',
        text: 'Confirmation email resent. Check your inbox and spam folder.',
      })
    }

    setResending(false)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => c - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full rounded-[2rem] border border-[#334d3a] bg-white/5 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-12">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-emerald-500/10 p-4">
            <svg
              className="h-8 w-8 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Check your email
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          We've sent a confirmation link to:
        </p>
        <p className="mt-1 font-semibold text-[#d4b04f]">{email}</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-[#4c6d54] bg-[#0f2a1f]/80 p-6">
          <h2 className="mb-3 font-semibold text-white">What happens next?</h2>
          <ol className="space-y-3 text-sm text-slate-300">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#d4b04f]/20 text-xs font-semibold text-[#d4b04f]">
                1
              </span>
              <span>Check your email inbox for our confirmation message</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#d4b04f]/20 text-xs font-semibold text-[#d4b04f]">
                2
              </span>
              <span>Click the confirmation link in the email</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#d4b04f]/20 text-xs font-semibold text-[#d4b04f]">
                3
              </span>
              <span>You'll be redirected back to the academy to access your courses</span>
            </li>
          </ol>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs text-amber-200">
            <strong>Tip:</strong> If you don't see the email, check your spam or junk folder. Add us to your contacts to ensure future emails arrive safely.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => router.push('/signin')}
            className="flex-1 rounded-3xl bg-gradient-to-r from-[#c8ad4d] via-[#e0c56e] to-[#d19f38] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-[0_18px_30px_rgba(210,176,79,0.22)] transition hover:brightness-110"
          >
            Go to Sign In
          </button>
          <button
            onClick={() => router.push('/courses')}
            className="flex-1 rounded-3xl border border-[#4c6d54] bg-slate-950/50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-900"
          >
            Browse Courses
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleResend}
            disabled={resending}
            className="flex-1 rounded-3xl border border-[#d4b04f] bg-[#111f14] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#d4b04f] transition hover:bg-[#162b1b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resending ? 'Resending…' : 'Resend confirmation email'}
          </button>
        </div>

        {status ? (
          <div
            className={`mt-4 rounded-3xl border px-4 py-3 text-sm ${
              status.type === 'error'
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
            }`}
          >
            {status.text}
          </div>
        ) : null}

        <p className="text-center text-xs text-slate-500">
          After confirming your email, you can sign in with your credentials to access all courses and features.
        </p>
      </div>
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,176,79,0.14),_transparent_35%),#06170f] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="w-full rounded-[2rem] border border-[#334d3a] bg-white/5 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl text-center">
              <div className="inline-flex rounded-full bg-[#d4b04f]/10 p-4 mb-4">
                <svg className="animate-spin h-8 w-8 text-[#d4b04f]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <p className="text-slate-400">Loading…</p>
            </div>
          }
        >
          <ConfirmEmailContent />
        </Suspense>
      </div>
    </main>
  )
}
