'use client'

import Link from 'next/link'

export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-slate-900/95 p-8 shadow-2xl shadow-black/30">
        <h1 className="text-4xl font-semibold mb-4">Something went wrong</h1>
        <p className="text-slate-300 mb-6">An unexpected error occurred while loading the page.</p>
        <pre className="rounded-xl bg-slate-950/80 p-4 text-sm text-emerald-200 overflow-x-auto">{error.message}</pre>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            onClick={() => reset()}
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-slate-700 px-5 py-3 text-sm text-slate-100 transition hover:bg-slate-800"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
