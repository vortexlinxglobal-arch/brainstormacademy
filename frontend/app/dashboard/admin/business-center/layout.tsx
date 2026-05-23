'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface BusinessCenterLayoutProps {
  children: ReactNode
}

const items = [
  { href: '/dashboard/admin/business-center', label: 'Overview' },
  { href: '/dashboard/admin/business-center/branches', label: 'Branches' },
  { href: '/dashboard/admin/business-center/services', label: 'Services' },
  { href: '/dashboard/admin/business-center/finance', label: 'Finance' },
]

export default function BusinessCenterLayout({ children }: BusinessCenterLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Business Center</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Enterprise Operations</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Navigate between branch management, service offerings, and financial performance for the admin business center.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-600 shadow-sm">
            <span>Focused admin controls</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>

        <nav className="mt-6 flex flex-wrap gap-2">
          {items.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${active ? 'border-[#0A6C3F] bg-[#F2F9F3] text-[#0A6C3F]' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div>{children}</div>
    </div>
  )
}
