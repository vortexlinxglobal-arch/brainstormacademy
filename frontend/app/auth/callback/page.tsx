'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // The session is automatically handled by Supabase
    // After confirming email, redirect to courses
    const timer = setTimeout(() => {
      router.push('/courses')
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,176,79,0.14),_transparent_35%),#06170f] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex rounded-full bg-[#d4b04f]/10 p-4 mb-4">
          <svg className="animate-spin h-8 w-8 text-[#d4b04f]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-white">Confirming your email…</h1>
        <p className="mt-2 text-slate-400">Redirecting to courses in a moment.</p>
      </div>
    </main>
  )
}
