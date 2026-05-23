'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const programLinks = [
  { label: 'Technology', href: '/courses/technology' },
  { label: 'Creative Arts', href: '/courses/creative-arts' },
  { label: 'Business Skills', href: '/courses/business-skills' },
  { label: 'Trade Skills', href: '/courses/trade-skills' },
]

const resourceLinks = [
  { label: 'FAQs', href: '/faq' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Scholarship', href: '/about/scholarship' },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#061f12] text-slate-300">
      <div className="container-fluid grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0A6C3F] via-[#4d8b55] to-[#D4AF37] text-lg font-bold text-white shadow-lg shadow-[#0A6C3F]/20">
            BA
          </div>
          <p className="max-w-sm text-sm leading-7 text-slate-400">
            Brainstorm Skills Academy is an NBTE-approved skills training center empowering Nigerian youth with practical, industry-relevant skills for successful careers.
          </p>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#D4AF37]" />
              No. 22 Ni'ma Road, Hayin Danmani, Kaduna
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#D4AF37]" />
              info@brainstormskills.com.ng
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#D4AF37]" />
              +234 901 883 7909
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Company</h3>
          <div className="mt-6 space-y-3 text-sm text-slate-400">
            {companyLinks.map((item) => (
              <Link key={item.href} href={item.href} className="block transition hover:text-[#D4AF37]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Programs</h3>
          <div className="mt-6 space-y-3 text-sm text-slate-400">
            {programLinks.map((item) => (
              <Link key={item.href} href={item.href} className="block transition hover:text-[#D4AF37]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Resources</h3>
          <div className="mt-6 space-y-3 text-sm text-slate-400">
            {resourceLinks.map((item) => (
              <Link key={item.href} href={item.href} className="block transition hover:text-[#D4AF37]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#D4AF37]/15 bg-[#061f12]/90 py-5 text-sm text-slate-400">
        <div className="container-fluid flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Brainstorm Skills Academy. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <Link href="/terms" className="transition hover:text-[#D4AF37]">Terms</Link>
            <Link href="/privacy" className="transition hover:text-[#D4AF37]">Privacy</Link>
            <Link href="/contact" className="inline-flex items-center gap-1 transition hover:text-[#D4AF37]">
              Contact Sales <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
