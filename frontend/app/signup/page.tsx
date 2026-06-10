'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { apiClient, auth } from '@/src/api'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [tradeCode, setTradeCode] = useState('')
  const [trades, setTrades] = useState<{ id: number; code: string; name: string }[]>([])
  const [loadingTrades, setLoadingTrades] = useState(true)
  const [tradeLoadError, setTradeLoadError] = useState<string | null>(null)
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const loadTrades = async () => {
      try {
        const result = await apiClient.getTrades()
        setTrades(result.data || [])
      } catch (error: any) {
        console.error('Failed to load trade programs', error)
        setTradeLoadError(error?.message || 'Unable to load trade programs')
      } finally {
        setLoadingTrades(false)
      }
    }

    loadTrades()
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    if (!tradeCode) {
      setMessage({ type: 'error', text: 'Please select a trade program.' })
      return
    }

    setLoading(true)
    try {
      const appUrl =
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL || 'https://brainstormacademy.ng'

      const result = await auth.signUp(email, password, {
        full_name: fullName,
        date_of_birth: dateOfBirth,
        trade_code: tradeCode,
        email_redirect_to: `${appUrl}/auth/callback`,
      })

      if (!result || !result.data) {
        throw new Error('Signup failed')
      }

      setMessage({
        type: 'success',
        text: 'Account created! Check your email to confirm.',
      })

      setTimeout(() => {
        router.push(`/signup/confirm-email?email=${encodeURIComponent(email)}`)
      }, 1500)
    } catch (error: any) {
      const errorText = String(error?.message || '')
      const normalized = errorText.toLowerCase()

      const message =
        normalized.includes('rate limit') ||
        normalized.includes('confirmation email recently') ||
        normalized.includes('already sent a confirmation email')
          ? 'A confirmation email was already sent. Please check your inbox or spam folder before trying again.'
          : normalized.includes('already registered') ||
            normalized.includes('duplicate') ||
            normalized.includes('user already registered')
          ? 'This email is already registered. Please sign in or check your email for the verification link.'
          : normalized.includes('failed to fetch')
          ? 'Unable to connect to the signup service. Please check your network or try again later.'
          : errorText || 'Unable to create account. Please try again.'

      setMessage({
        type: 'error',
        text: message,
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,176,79,0.14),_transparent_35%),#06170f] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <section className="rounded-[2rem] border border-[#334d3a] bg-slate-950/60 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="mb-10">
              <span className="inline-flex rounded-full bg-[#d4b04f]/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[#e0c56e]">
                Join the Academy
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Start your Brainstorm Skills journey with a premium green and gold experience.
              </h1>
              <p className="mt-5 max-w-xl text-slate-300">
                Create an account today to access career-ready courses, mentorship, and real-world skills training designed for fast-moving learners.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-[#4c6d54] bg-[#0f2a1f]/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4b04f]">Career-Focused Learning</p>
                <p className="mt-3 text-slate-200">Join training programs built for technical and vocational success.</p>
              </div>
              <div className="rounded-3xl border border-[#4c6d54] bg-[#0f2a1f]/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4b04f]">Account Protection</p>
                <p className="mt-3 text-slate-200">Strong signup security and instant account creation with Supabase-backed auth.</p>
              </div>
              <div className="rounded-3xl border border-[#4c6d54] bg-[#0f2a1f]/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4b04f]">Fast Onboarding</p>
                <p className="mt-3 text-slate-200">Get into your first course quickly with a trusted login flow.</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#4b6b4d] bg-slate-950/95 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="mb-8 space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d4b04f]">Create Account</p>
              <h2 className="text-3xl font-bold text-white">Sign up and start learning today</h2>
              <p className="text-slate-400">Build your profile, join classes, and access the Brainstorm Academy experience.</p>
              <p className="text-sm text-slate-400 mt-2">Student accounts can register here. Staff accounts must be created by an administrator and use email + phone number credentials.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-300">
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-[#3f5f47] bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-[#d4b04f] focus:ring-2 focus:ring-[#d4b04f]/20"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-[#3f5f47] bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-[#d4b04f] focus:ring-2 focus:ring-[#d4b04f]/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-[#3f5f47] bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-[#d4b04f] focus:ring-2 focus:ring-[#d4b04f]/20"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-[#3f5f47] bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-[#d4b04f] focus:ring-2 focus:ring-[#d4b04f]/20"
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-300">
                  Date of birth
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-[#3f5f47] bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-[#d4b04f] focus:ring-2 focus:ring-[#d4b04f]/20"
                />
              </div>

              <div>
                <label htmlFor="tradeCode" className="block text-sm font-medium text-slate-300">
                  Trade program
                </label>
                <select
                  id="tradeCode"
                  name="tradeCode"
                  required
                  value={tradeCode}
                  onChange={(e) => setTradeCode(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-[#3f5f47] bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-[#d4b04f] focus:ring-2 focus:ring-[#d4b04f]/20"
                >
                  <option value="">Select a program...</option>
                  {loadingTrades ? (
                    <option value="" disabled>Loading programs...</option>
                  ) : trades.length > 0 ? (
                    trades.map((trade) => (
                      <option key={trade.id} value={trade.code}>
                        {trade.name} ({trade.code})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="" disabled>No programs available</option>
                      <option value="TRADE001">Electrical Installation (TRADE001)</option>
                      <option value="TRADE002">Plumbing & Gas Fitting (TRADE002)</option>
                      <option value="TRADE003">Carpentry & Joinery (TRADE003)</option>
                      <option value="TRADE004">Welding & Fabrication (TRADE004)</option>
                      <option value="TRADE005">Automotive Technology (TRADE005)</option>
                    </>
                  )}
                </select>
                {tradeLoadError ? (
                  <p className="mt-2 text-sm text-amber-300">
                    Unable to load trade programs: {tradeLoadError}. Please try again later or contact support.
                  </p>
                ) : null}
              </div>

              {message ? (
                <div
                  className={`rounded-3xl border px-4 py-3 text-sm ${
                    message.type === 'error'
                      ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                      : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                  }`}
                >
                  {message.text}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-[#c8ad4d] via-[#e0c56e] to-[#d19f38] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-[0_18px_30px_rgba(210,176,79,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account…' : 'Sign up'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/signin" className="font-semibold text-[#d4b04f] hover:text-[#f1d87f]">
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
