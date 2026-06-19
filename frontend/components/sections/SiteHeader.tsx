'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Search, Bell, User, ChevronDown, LayoutDashboard, LogOut, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { auth, db } from '@/src/api'

const mainLinks = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const portalMap: Record<string, string> = {
  super_admin: '/portal/admin',
  admin: '/portal/admin',
  staff: '/portal/admin',
  instructor: '/portal/instructor',
  student: '/portal/student',
  public: '/portal',
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brainstormacademy.ng'

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const isPortalPath = pathname?.startsWith('/portal') || pathname?.startsWith('/dashboard')
  const logoHref = isPortalPath ? appUrl : '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [profile, setProfile] = useState<{ role?: string; full_name?: string } | null>(null)

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      try {
        const sessionResult = await auth.getSession()
        const sessionUser = sessionResult.data.session?.user
        if (!mounted) return
        setUser(sessionUser ?? null)

        if (sessionUser) {
          const profileResult = await db.getProfile(sessionUser.id)
          if (!mounted) return
          if (profileResult?.data) {
            setProfile(profileResult.data)
          }
        }
      } catch (error) {
        console.error('Unable to load authenticated user:', error)
      } finally {
        if (mounted) {
          setLoadingAuth(false)
        }
      }
    }

    loadSession()
    return () => {
      mounted = false
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await auth.signOut()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
    router.push('/signin')
  }

  const portalHref = profile?.role ? portalMap[profile.role.toLowerCase()] ?? '/portal' : '/portal'
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Member'
  const initials = displayName?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-50 border-b border-[#D4AF37]/15 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="container-fluid flex flex-wrap items-center justify-between gap-4 py-2.5 sm:py-3 md:py-4 lg:py-5">
        <Link href={logoHref} className="flex items-center gap-2 sm:gap-3 flex-shrink-0 transition-transform hover:scale-105">
          <div className="h-8 w-auto sm:hidden">
            <Image
              src="/assets/images/logo.png"
              alt="Brainstorm Skills Logo"
              width={48}
              height={48}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
          <div className="hidden sm:block md:hidden h-10 w-auto">
            <Image
              src="/assets/images/logo.png"
              alt="Brainstorm Skills Logo"
              width={60}
              height={60}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
          <div className="hidden md:block h-12 w-auto">
            <Image
              src="/assets/images/logo.png"
              alt="Brainstorm Skills Logo"
              width={72}
              height={72}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-700">Brainstorm</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900">Skills Academy</p>
          </div>
        </Link>

        {!isPortalPath && (
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm font-semibold text-slate-700 transition hover:text-[#1a6b53]"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 rounded-full bg-[#1a6b53] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="/portal"
              className="group relative text-sm font-semibold text-slate-700 transition hover:text-[#1a6b53]"
            >
              Portal
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 rounded-full bg-[#1a6b53] transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>
        )}

        {isPortalPath && (
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={appUrl}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1a6b53] hover:text-[#1a6b53]"
            >
              <ArrowRight className="h-4 w-4" />
              Visit Website
            </Link>
          </div>
        )}

        <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
          <button
            type="button"
            className="inline-flex h-10 lg:h-11 w-10 lg:w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#f8faf5] text-slate-700 transition hover:border-[#1a6b53] hover:text-[#1a6b53]"
            aria-label="Search"
          >
            <Search className="h-4 lg:h-5 w-4 lg:w-5" />
          </button>
          <button
            type="button"
            className="relative inline-flex h-10 lg:h-11 w-10 lg:w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#f8faf5] text-slate-700 transition hover:border-[#1a6b53] hover:text-[#1a6b53]"
            aria-label="Notifications"
          >
            <Bell className="h-4 lg:h-5 w-4 lg:w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 lg:h-5 min-w-[1rem] lg:min-w-[1.25rem] items-center justify-center rounded-full bg-[#D4AF37] px-1 lg:px-1.5 text-[10px] lg:text-[11px] font-semibold text-slate-950">3</span>
          </button>

          {loadingAuth ? (
            <div className="inline-flex h-10 lg:h-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-700">Loading…</div>
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold uppercase text-white shadow-inner">
                  {initials}
                </span>
                <span>{displayName}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {userMenuOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
                  >
                    <div className="flex flex-col gap-1 px-3 py-3">
                      <Link
                        href={portalHref}
                        className="inline-flex items-center gap-2 rounded-3xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                        Workspace
                      </Link>
                      <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 rounded-3xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ArrowRight className="h-4 w-4 text-slate-700" />
                        Courses
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="inline-flex items-center gap-2 rounded-3xl px-3 py-3 text-sm text-rose-600 transition hover:bg-slate-100"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Button asChild variant="brand" className="rounded-full px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild variant="gold" className="rounded-full px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm">
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 transition hover:border-[#1a6b53] hover:text-[#1a6b53] md:hidden flex-shrink-0"
          aria-label="Toggle mobile menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-slate-200 bg-white/95"
          >
            <div className="container-fluid space-y-3 py-4 sm:py-5">
              {!isPortalPath && mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!isPortalPath && (
                <Link
                  href="/portal"
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Portal
                </Link>
              )}
              {isPortalPath && (
                <Link
                  href={appUrl}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Visit Website
                </Link>
              )}
              {loadingAuth ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-700">Loading auth state…</div>
              ) : user ? (
                <div className="space-y-2 px-4">
                  <Link
                    href={portalHref}
                    className="block rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    Portal Workspace
                  </Link>
                  <Link
                    href="/courses"
                    className="block rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    Courses
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-4">
                  <Button asChild variant="brand" className="w-full rounded-full px-4 py-3 text-sm">
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button asChild variant="gold" className="w-full rounded-full px-4 py-3 text-sm">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
