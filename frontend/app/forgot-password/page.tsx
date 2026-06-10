'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { auth } from '@/src/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setLoading(true)

    try {
      const { data, error } = await auth.resetPassword(email, `${window.location.origin}/signin`)

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({
          type: 'success',
          text: 'If this email is registered, a password reset link has been sent. Check your inbox.',
        })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Unable to send reset email. Please try again.' })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,176,79,0.14),_transparent_35%),#06170f] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[#4b6b4d] bg-slate-950/95 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-8 space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d4b04f]">Forgot password</p>
            <h1 className="text-3xl font-bold text-white">Reset your access</h1>
            <p className="text-slate-300">Enter your email and we&apos;ll send a secure reset link so you can sign back in.</p>
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
              {loading ? 'Sending reset link…' : 'Send reset link'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            Back to{' '}
            <Link href="/signin" className="font-semibold text-[#d4b04f] hover:text-[#f1d87f]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
