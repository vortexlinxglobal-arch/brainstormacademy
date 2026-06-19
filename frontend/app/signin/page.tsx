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
      const message = error?.message?.toString?.() || 'Unable to sign in. Please try again.'
      setMessage({
        type: 'error',
        text: message.includes('Failed to fetch')
          ? 'Unable to connect to the login service. Please check your network or try again later.'
          : message,
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#08110d] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1320px] items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-10">
          <aside className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1c14]/80 p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,176,79,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.16),_transparent_25%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div>
                <div className="mb-10 flex items-center gap-3">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#d4b04f]/15 text-[#d4b04f]">
                    <Image src="/assets/images/logo.png" alt="Brainstorm Skills" width={36} height={36} className="h-auto w-auto" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#d4b04f]">Brainstorm Skills</p>
                    <p className="text-sm text-slate-300">Industry-focused learning</p>
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-white sm:text-5xl">Welcome back</h1>
                <p className="mt-5 max-w-xl text-slate-300">
                  Sign in to access your training dashboard, course progress, and portal tools with a smoother, modern experience.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { title: 'Fast access', description: 'One secure login to connect learners, staff, and admins instantly.' },
                  { title: 'Smart experience', description: 'Minimal distractions with a clear path to what matters most.' },
                  { title: 'Trusted security', description: 'Session-safe authentication built for Brainstorm Skills users.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-[#0f241a]/90 p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="mb-8 flex flex-col gap-3 text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[#d4b04f]/15 text-[#d4b04f] shadow-sm shadow-[#d4b04f]/10">
                <Image src="/assets/images/logo.png" alt="Brainstorm Skills" width={32} height={32} className="h-auto w-auto" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d4b04f]">Sign in</p>
              <h2 className="text-3xl font-bold text-white">Access your portal with one secure login</h2>
              <p className="max-w-xl text-sm text-slate-400">
                Enter your email and password to continue your training, view your dashboard, or manage course access.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-3">
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
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none transition focus:border-[#d4b04f] focus:ring-2 focus:ring-[#d4b04f]/20"
                />
              </div>

              <div className="space-y-3">
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
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none transition focus:border-[#d4b04f] focus:ring-2 focus:ring-[#d4b04f]/20"
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-white/15 bg-slate-900 text-[#d4b04f] focus:ring-[#d4b04f]"
                  />
                  Remember this device
                </label>
                <Link href="/forgot-password" className="text-sm font-semibold text-[#d4b04f] transition hover:text-[#f1d87f]">
                  Forgot password?
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
                className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-[#c8ad4d] via-[#e0c56e] to-[#d19f38] px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-[0_18px_30px_rgba(210,176,79,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-slate-500">
              <span className="h-[1px] flex-1 bg-white/10" />
              <span>New to Brainstorm?</span>
              <span className="h-[1px] flex-1 bg-white/10" />
            </div>

            <p className="mt-6 text-center text-sm text-slate-300">
              <span>Start learning today.</span>{' '}
              <Link href="/signup" className="font-semibold text-[#d4b04f] hover:text-[#f1d87f]">
                Create an account
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
