'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0A6C3F]">Join Brainstorm Skills</p>
          <h1 className="text-4xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-600">Start learning with our vocational training programs and career coaching.</p>
        </div>

        <form className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Full name</label>
          <input type="text" placeholder="Jane Doe" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-[#0A6C3F] focus:ring-2 focus:ring-[#0A6C3F]/20" />

          <label className="block text-sm font-medium text-slate-700">Email address</label>
          <input type="email" placeholder="jane@example.com" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-[#0A6C3F] focus:ring-2 focus:ring-[#0A6C3F]/20" />

          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input type="password" placeholder="Create a password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-[#0A6C3F] focus:ring-2 focus:ring-[#0A6C3F]/20" />

          <Button type="submit" variant="brand" size="lg" className="w-full rounded-full">
            Sign up
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/signin" className="font-semibold text-[#0A6C3F] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
