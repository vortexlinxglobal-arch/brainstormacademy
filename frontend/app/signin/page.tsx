'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { auth } from '@/src/api'

export default function SigninPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      await auth.signIn(email, password)

      setMessage({
        type: 'success',
        text: 'Signed in successfully — redirecting to your portal…',
      })

      setTimeout(() => {
        router.push('/portal')
      }, 600)
    } catch (error: any) {
      const errorText = error?.message?.toString?.() || 'Unable to sign in. Please try again.'
      const normalized = errorText.toLowerCase()
      setMessage({
        type: 'error',
        text: normalized.includes('not configured')
          ? 'Login is not connected yet. Add the Supabase environment values or connect the backend auth service.'
          : errorText.includes('Failed to fetch')
          ? 'Unable to connect to the login service. Please check your network or try again later.'
          : errorText,
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-slate-950">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8">
        <section className="flex flex-col justify-center">
          <Link href="/" className="mb-12 inline-flex items-center gap-3">
            <Image src="/assets/images/logo.png" alt="Brainstorm Skills" width={44} height={44} className="h-11 w-auto" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1a6b53]">Brainstorm</p>
              <p className="text-sm font-bold text-slate-900">Skills Academy</p>
            </div>
          </Link>

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a67c42]">Portal Access</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              One account for learning, operations, and growth.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-650">
              Students continue courses, staff manage training activity, and administrators keep the center running from a unified Brainstorm workspace.
            </p>
          </div>

          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {['Student learning', 'Training operations', 'Partner readiness'].map((item) => (
              <div key={item} className="border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1a6b53]">Sign In</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Use your Brainstorm email and password to continue.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-3">
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
                  className="w-full border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#1a6b53] focus:ring-2 focus:ring-[#1a6b53]/15"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#1a6b53] focus:ring-2 focus:ring-[#1a6b53]/15"
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 border-slate-300 text-[#1a6b53] focus:ring-[#1a6b53]"
                  />
                  Remember this device
                </label>
                <Link href="/forgot-password" className="text-sm font-semibold text-[#1a6b53] transition hover:text-[#0d4a3a]">
                  Forgot password?
                </Link>
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
                className="inline-flex w-full items-center justify-center bg-[#1a6b53] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#0d4a3a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              New learner?{' '}
              <Link href="/signup" className="font-semibold text-[#1a6b53] hover:text-[#0d4a3a]">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
