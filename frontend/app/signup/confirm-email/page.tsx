'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => c - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,176,79,0.14),_transparent_35%),#06170f] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
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

            <p className="text-center text-xs text-slate-500">
              After confirming your email, you can sign in with your credentials to access all courses and features.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
