'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Search } from 'lucide-react'

export interface HeroSectionProps {
  onBrowseClick?: () => void
  onEnrollClick?: () => void
  onDemoClick?: () => void
}

const trendingSkills = ['Web Development', 'UI/UX Design', 'Cybersecurity', 'Data Analytics', 'Cloud Computing']

export function HeroSection({ onBrowseClick, onEnrollClick }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <img
          src="/assets/hero-bg.jpg"
          alt="Student learning in a modern training environment"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/85" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col justify-center rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8 lg:p-10">
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-[#D4AF37]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#F6E2B3]">
              Discover skills & certifications
            </span>

            <div className="mt-6 space-y-5">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Find the next skill that fast-tracks your career.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Search the most in-demand programs, explore certified pathways, and follow a practical route to certification-ready success.
              </p>
            </div>

            <div className="mt-10 grid gap-5">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-4 shadow-lg shadow-black/20 sm:p-5">
                <label htmlFor="skill-search" className="sr-only">
                  Search for a skill or certification
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="skill-search"
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search for a skill or certification (e.g., Web Development)"
                    className="w-full rounded-full border border-transparent bg-slate-950/90 py-4 pl-12 pr-4 text-base text-white placeholder:text-slate-500 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Trending skills
                  </p>
                  <p className="text-sm text-slate-300">Start with the most popular skill paths.</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {trendingSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => setSearchQuery(skill)}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-[#D4AF37] hover:bg-white/10"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[2rem] bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Success</p>
                <p className="mt-3 text-3xl font-bold text-white">98%</p>
                <p className="mt-2 text-sm text-slate-400">Job placement rate</p>
              </div>
              <div className="rounded-[2rem] bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Programs</p>
                <p className="mt-3 text-3xl font-bold text-white">24+</p>
                <p className="mt-2 text-sm text-slate-400">Certified pathways</p>
              </div>
              <div className="rounded-[2rem] bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Alumni</p>
                <p className="mt-3 text-3xl font-bold text-white">15K+</p>
                <p className="mt-2 text-sm text-slate-400">Skilled graduates</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/courses"
                onClick={onBrowseClick}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-[#D4AF37]/20 transition hover:bg-[#b99223] sm:w-auto"
              >
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signup"
                onClick={onEnrollClick}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 sm:w-auto"
              >
                Start your journey
              </Link>
            </div>
          </div>

          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/25"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.12),_transparent_26%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.9),_transparent_40%)]" />
            <div className="relative min-h-[420px] p-6 sm:p-8 lg:p-12">
              <div className="flex h-full flex-col justify-between rounded-[1.75rem] bg-white/5 p-6 shadow-inner shadow-black/10">
                <div className="space-y-4 sm:space-y-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#D4AF37]">Skill discovery</p>
                  <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    Discover programs tailored to today’s fastest-growing fields.
                  </h2>
                  <p className="text-base leading-7 text-slate-300">
                    Pick a skill, explore certification-ready courses, and see the best learning path for modern careers.
                  </p>
                </div>

                <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Featured skill</p>
                      <p className="mt-2 text-lg font-semibold text-white">Web Development</p>
                    </div>
                    <span className="rounded-full bg-[#D4AF37]/15 px-3 py-1 text-sm font-semibold text-[#D4AF37]">Trending</span>
                  </div>
                  <p className="text-sm leading-6 text-slate-400">
                    Start with full-stack programs that teach coding, UX, and deployment skills for high-demand tech roles.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
