'use client'

import Link from 'next/link'
import { BookOpen, CalendarDays, CreditCard, MapPin, ShieldCheck, TrendingUp, Users, Warehouse } from 'lucide-react'

const navItems = [
  { href: '/portal/admin/dashboard', label: 'Dashboard', icon: BookOpen },
  { href: '/portal/admin/students', label: 'Students', icon: Users },
  { href: '/portal/admin/staff', label: 'Staff', icon: ShieldCheck },
  { href: '/portal/admin/programs', label: 'Programs', icon: TrendingUp },
  { href: '/portal/admin/inventory', label: 'Inventory', icon: Warehouse },
  { href: '/portal/admin/meetings', label: 'Meetings', icon: CalendarDays },
  { href: '/portal/admin/billing', label: 'Billing', icon: CreditCard },
  { href: '/portal/admin/performance', label: 'Performance', icon: MapPin },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-emerald-950 text-white shadow-lg">
        <div className="mx-auto flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-emerald-300">Brainstorm Academy Portal</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Portal workspace</h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-200">
              Unified admin, staff and student control center.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/portal/admin/dashboard" className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow shadow-emerald-900 transition hover:bg-amber-300">
              Enter portal
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-6 flex items-center gap-3 rounded-3xl bg-emerald-50 px-4 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-inner">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-700">Portal navigation</p>
              <p className="font-semibold text-slate-900">Workspace sections</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-slate-900"
                >
                  <Icon className="h-4 w-4 text-emerald-600" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 rounded-3xl bg-emerald-900 p-5 text-sm text-emerald-100 shadow-inner">
            <p className="font-semibold">Theme palette</p>
            <p className="mt-2 text-sm leading-6 text-emerald-200">Emerald and metallic gold deliver a premium training center experience for staff and administrators.</p>
          </div>
        </aside>

        <section className="space-y-6">{children}</section>
      </div>
    </div>
  )
}
