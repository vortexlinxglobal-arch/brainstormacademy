import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-6">
      <div className="max-w-lg text-center">
        <h1 className="text-6xl font-black tracking-tight mb-4">404</h1>
        <p className="text-xl text-slate-700 mb-6">We couldn’t find that page.</p>
        <Link href="/" className="inline-flex rounded-full bg-[#1a6b53] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0e7c4b]">
          Back to home
        </Link>
      </div>
    </main>
  )
}
