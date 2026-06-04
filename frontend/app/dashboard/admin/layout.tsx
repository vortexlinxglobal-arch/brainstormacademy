'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const adminNav = [
  { href: '/dashboard/admin', label: 'Overview' },
  { href: '/dashboard/admin/business-center', label: 'Business Center' },
  { href: '/dashboard/admin/users', label: 'Users' },
  { href: '/dashboard/admin/reports', label: 'Reports' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Administrator Workspace</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Access centralized controls for business operations, users, and reporting.
            </p>
          </div>
        </div>

        <nav className="mt-6 flex flex-wrap gap-2">
          {adminNav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'border-[#1a6b53] bg-[#F2F9F3] text-[#1a6b53]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
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
