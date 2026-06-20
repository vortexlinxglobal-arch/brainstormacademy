'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
  Warehouse,
} from 'lucide-react'
import { auth, db } from '@/src/api'

const navItems = [
  { href: '/portal/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'manager', 'staff'] },
  { href: '/portal/admin/students', label: 'Students', icon: Users, roles: ['super_admin', 'admin', 'manager'] },
  { href: '/portal/admin/staff', label: 'Staff', icon: ShieldCheck, roles: ['super_admin', 'admin', 'manager'] },
  { href: '/portal/admin/programs', label: 'Programs', icon: TrendingUp, roles: ['super_admin', 'admin', 'manager'] },
  { href: '/portal/admin/inventory', label: 'Inventory', icon: Warehouse, roles: ['super_admin', 'admin', 'manager', 'staff'] },
  { href: '/portal/admin/meetings', label: 'Meetings', icon: CalendarDays, roles: ['super_admin', 'admin', 'manager', 'staff'] },
  { href: '/portal/admin/billing', label: 'Billing', icon: CreditCard, roles: ['super_admin', 'admin', 'manager', 'staff'] },
  { href: '/portal/admin/performance', label: 'Performance', icon: BarChart3, roles: ['super_admin', 'admin', 'manager', 'staff'] },
  { href: '/portal/instructor', label: 'Instructor', icon: GraduationCap, roles: ['super_admin', 'instructor'] },
  { href: '/portal/student/dashboard', label: 'Learning', icon: BookOpen, roles: ['super_admin', 'student'] },
  { href: '/portal/student/courses', label: 'My Courses', icon: UserRound, roles: ['super_admin', 'student'] },
  { href: '/portal/student/progress', label: 'Progress', icon: MapPin, roles: ['super_admin', 'student'] },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [profile, setProfile] = useState<{ role?: string; full_name?: string; email?: string } | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        const sessionResult = await auth.getSession()
        const user = sessionResult.data.session?.user
        if (!user) return

        const profileResult = await db.getProfile(user.id)
        if (mounted && profileResult.data) {
          setProfile(profileResult.data)
        }
      } catch (error) {
        console.warn('Unable to load portal layout profile:', error)
      }
    }

    loadProfile()
    return () => {
      mounted = false
    }
  }, [])

  const role = profile?.role?.toLowerCase() || ''
  const visibleNavItems = useMemo(() => {
    if (!role) return navItems
    if (role === 'super_admin') return navItems
    return navItems.filter((item) => item.roles.includes(role))
  }, [role])

  return (
    <div className="min-h-screen bg-[#f7f8f4] text-slate-950">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1a6b53]">Brainstorm Portal</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Operations workspace</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Manage enrollment, learning delivery, staff operations, and student progress from one place.
            </p>
          </div>
          <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">{profile?.full_name || profile?.email || 'Portal member'}</p>
            <p className="mt-1 capitalize">{profile?.role?.replace('_', ' ') || 'Checking access'}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-6">
        <aside className="border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
          <div className="mb-5 flex items-center gap-3 border border-emerald-100 bg-emerald-50 px-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center bg-[#1a6b53] text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#1a6b53]">Workspace</p>
              <p className="text-sm font-semibold text-slate-950">Role navigation</p>
            </div>
          </div>

          <nav className="space-y-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#1a6b53] text-white'
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-slate-950'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#1a6b53]'}`} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-950">Platform goal</p>
            <p className="mt-2 leading-6">Public pages convert visitors. Portal pages run the training center.</p>
          </div>
        </aside>

        <section className="space-y-6">{children}</section>
      </div>
    </div>
  )
}
