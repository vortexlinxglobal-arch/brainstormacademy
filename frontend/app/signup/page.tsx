'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { auth } from '@/src/api'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await auth.signUp(email, password, { full_name: fullName })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else if (data?.session) {
        setMessage({ type: 'success', text: 'Account created successfully. Redirecting…' })
        setTimeout(() => {
          router.push('/courses')
        }, 800)
      } else {
        setMessage({
          type: 'success',
          text: 'Account created. Please check your email to confirm your account before signing in.',
        })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Unable to create account. Please try again.' })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,176,79,0.14),_transparent_35%),#06170f] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <section className="rounded-[2rem] border border-[#334d3a] bg-white/5 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="mb-10">
              <span className="inline-flex rounded-full bg-[#d4b04f]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[#d4b04f]">
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
