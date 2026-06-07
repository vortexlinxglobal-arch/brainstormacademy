'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage({ type: 'error', text: error.message || 'Sign in failed' })
        return
      }

      setMessage({
        type: 'success',
        text: 'Signed in successfully — redirecting…',
      })

      // Store tokens and user info
      if (data?.session?.access_token) {
        localStorage.setItem('auth_token', data.session.access_token)
        localStorage.setItem('refresh_token', data.session.refresh_token || '')
        localStorage.setItem('user_id', data.user.id)
      }

      setTimeout(() => {
        router.push('/courses')
      }, 600)
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Unable to sign in. Please try again.',
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,176,79,0.12),_transparent_35%),#06170f] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <section className="rounded-[2rem] border border-[#334d3a] bg-white/5 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="mb-10">
              <span className="inline-flex rounded-full bg-[#d4b04f]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[#d4b04f]">
                Transform Your Future
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Access quality training with a refined green and gold experience.
              </h1>
              <p className="mt-5 max-w-xl text-slate-300">
                Secure your account and continue learning with career-ready trade pathways, modern classroom support, and 24/7 reliability.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-[#4c6d54] bg-[#0f2a1f]/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4b04f]">Secure Access</p>
                <p className="mt-3 text-slate-200">Protected sign-in, encrypted sessions, and fast credential validation for your learning account.</p>
              </div>
              <div className="rounded-3xl border border-[#4c6d54] bg-[#0f2a1f]/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4b04f]">24/7 Support</p>
                <p className="mt-3 text-slate-200">Get help anytime from across the academy with priority support for learners and staff.</p>
              </div>
              <div className="rounded-3xl border border-[#4c6d54] bg-[#0f2a1f]/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4b04f]">Fast & Reliable</p>
                <p className="mt-3 text-slate-200">Experience a polished login journey that stays true to the Brainstorm Skills brand.</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#4b6b4d] bg-slate-950/95 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="mb-8 space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d4b04f]">Welcome Back</p>
              <h2 className="text-3xl font-bold text-white">Enter your credentials to access your account</h2>
              <p className="text-slate-400">Sign in and continue your vocational learning journey with Brainstorm Skills.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-[#3f5f47] bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-[#d4b04f] focus:ring-2 focus:ring-[#d4b04f]/20"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-[#3f5f47] bg-slate-900 text-[#d4b04f] focus:ring-[#d4b04f]"
                  />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-sm font-semibold text-[#d4b04f] transition hover:text-[#f1d87f]">
                  Forgot Password?
                </Link>
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
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-[#d4b04f] hover:text-[#f1d87f]">
                Sign Up
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
