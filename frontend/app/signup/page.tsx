'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { apiClient, auth } from '@/src/api'

const fallbackTrades = [
  { id: 1, code: 'WEB', name: 'Web Development' },
  { id: 2, code: 'DS', name: 'Data Science' },
  { id: 3, code: 'ELEC', name: 'Electrical Installation' },
  { id: 4, code: 'PLUMB', name: 'Plumbing' },
  { id: 5, code: 'BM', name: 'Business Management' },
  { id: 6, code: 'GD', name: 'Graphic Design' },
  { id: 7, code: 'CATER', name: 'Catering & Hospitality' },
]

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [tradeCode, setTradeCode] = useState('')
  const [trades, setTrades] = useState<{ id: number; code: string; name: string }[]>([])
  const [loadingTrades, setLoadingTrades] = useState(true)
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const loadTrades = async () => {
      try {
        const result = await apiClient.getTrades()
        setTrades(result.data?.length ? result.data : fallbackTrades)
      } catch (error: any) {
        console.error('Failed to load trade programs', error)
        setTrades(fallbackTrades)
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

      const requiresEmailConfirmation = result.data.requires_email_confirmation !== false

      setMessage({
        type: 'success',
        text: requiresEmailConfirmation
          ? 'Account created. Check your email to confirm.'
          : 'Account created. You can sign in now.',
      })

      setTimeout(() => {
        if (requiresEmailConfirmation) {
          router.push(`/signup/confirm-email?email=${encodeURIComponent(email)}`)
        } else {
          router.push('/signin')
        }
      }, 1200)
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
          : normalized.includes('not configured')
          ? 'Account creation is not connected yet. Add the Supabase environment values or connect the backend auth service.'
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
    <main className="min-h-screen bg-[#f7f8f4] text-slate-950">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_500px] lg:px-8">
        <section className="flex flex-col justify-center">
          <Link href="/" className="mb-12 inline-flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center border border-slate-200 bg-white">
              <img src="/assets/images/logo.png" alt="Brainstorm Skills" className="h-8 w-auto" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1a6b53]">Brainstorm</p>
              <p className="text-sm font-bold text-slate-900">Skills Academy</p>
            </div>
          </Link>

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a67c42]">Student Enrollment</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Turn visitors into skilled learners with a focused onboarding path.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-650">
              Brainstorm connects public course discovery with a working portal for admissions, training operations, staff, students, billing, and reporting.
            </p>
          </div>

          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              ['Apply', 'Choose a program'],
              ['Learn', 'Track progress'],
              ['Operate', 'Manage the center'],
            ].map(([title, text]) => (
              <div key={title} className="border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1a6b53]">Create Account</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Start learning</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Student signup is open. Staff and admin accounts are managed inside the portal.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
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
                  className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#1a6b53] focus:ring-2 focus:ring-[#1a6b53]/15"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
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
                  className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#1a6b53] focus:ring-2 focus:ring-[#1a6b53]/15"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
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
                    className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#1a6b53] focus:ring-2 focus:ring-[#1a6b53]/15"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
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
                    className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#1a6b53] focus:ring-2 focus:ring-[#1a6b53]/15"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700">
                  Date of birth
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#1a6b53] focus:ring-2 focus:ring-[#1a6b53]/15"
                />
              </div>

              <div>
                <label htmlFor="tradeCode" className="block text-sm font-medium text-slate-700">
                  Trade program
                </label>
                <select
                  id="tradeCode"
                  name="tradeCode"
                  required
                  value={tradeCode}
                  onChange={(e) => setTradeCode(e.target.value)}
                  className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#1a6b53] focus:ring-2 focus:ring-[#1a6b53]/15"
                >
                  <option value="">Select a program...</option>
                  {loadingTrades ? (
                    <option value="" disabled>Loading programs...</option>
                  ) : (
                    trades.map((trade) => (
                      <option key={trade.id} value={trade.code}>
                        {trade.name} ({trade.code})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {message ? (
                <div
                  className={`rounded-3xl border px-4 py-3 text-sm ${
                    message.type === 'error'
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {message.text}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center bg-[#1a6b53] px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#0d4a3a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account…' : 'Sign up'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/signin" className="font-semibold text-[#1a6b53] hover:text-[#0d4a3a]">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
