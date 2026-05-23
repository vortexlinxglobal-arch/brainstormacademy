'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Search, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#D4AF37]/15 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="container-fluid flex items-center justify-between gap-4 py-4 md:py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0A6C3F] via-[#4d8b55] to-[#D4AF37] text-lg font-bold text-white shadow-lg shadow-[#0A6C3F]/15">
            BS
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Brainstorm</p>
            <p className="text-sm font-bold text-slate-900">Skills Academy</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm font-semibold text-slate-700 transition hover:text-[#0A6C3F]"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 rounded-full bg-[#0A6C3F] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#f8faf5] text-slate-700 transition hover:border-[#0A6C3F] hover:text-[#0A6C3F]"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#f8faf5] text-slate-700 transition hover:border-[#0A6C3F] hover:text-[#0A6C3F]"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#D4AF37] px-1.5 text-[11px] font-semibold text-slate-950">3</span>
          </button>
          <Button asChild variant="brand" className="rounded-full px-4 py-3 text-sm">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild variant="gold" className="rounded-full px-4 py-3 text-sm">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 transition hover:border-[#0A6C3F] hover:text-[#0A6C3F] md:hidden"
          aria-label="Toggle mobile menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-slate-200 bg-white/95"
          >
            <div className="container-fluid space-y-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col gap-3 pt-2">
                <Button asChild variant="brand" className="w-full rounded-full px-4 py-3 text-sm">
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild variant="gold" className="w-full rounded-full px-4 py-3 text-sm">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
