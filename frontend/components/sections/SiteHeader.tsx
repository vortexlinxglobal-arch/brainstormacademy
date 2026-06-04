'use client'

import Link from 'next/link'
import Image from 'next/image'
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
      <div className="container-fluid flex items-center justify-between gap-4 py-2.5 sm:py-3 md:py-4 lg:py-5">
        {/* Logo with responsive sizing */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 transition-transform hover:scale-105">
          {/* Mobile logo - 32px height on small screens */}
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

          {/* Tablet/small screens - 40px height */}
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

          {/* Desktop - 48px height and above */}
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

          {/* Text branding - hidden on very small screens, visible sm and up */}
          <div className="hidden sm:block">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-500">Brainstorm</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900">Skills Academy</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm font-semibold text-slate-700 transition hover:text-[#1a6b53]"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 rounded-full bg-[#1a6b53] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
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
          <Button asChild variant="brand" className="rounded-full px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild variant="gold" className="rounded-full px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 transition hover:border-[#1a6b53] hover:text-[#1a6b53] md:hidden flex-shrink-0"
          aria-label="Toggle mobile menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-slate-200 bg-white/95"
          >
            <div className="container-fluid space-y-3 py-4 sm:py-5">
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

              <div className="flex flex-col gap-2.5 pt-3 sm:pt-4">
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
