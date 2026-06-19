'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

export interface HeroSectionProps {
  onBrowseClick?: () => void
  onEnrollClick?: () => void
}

const HERO_SLIDES = [
  {
    title: 'Build career-ready skills with guided pathways',
    description:
      'Explore programs designed for real-world jobs, with hands-on projects, expert mentorship, and certification-ready learning.',
    ctaLink: '/courses',
    mediaUrl: '/assets/hero_1.jpg',
  },
  {
    title: 'Accelerate your growth with practical certifications',
    description:
      'Access curated courses, industry-relevant content, and a modern learning experience built to help you launch faster.',
    ctaLink: '/signup',
    mediaUrl: '/assets/hero_2.JPG',
  },
  {
    title: 'Turn new knowledge into professional momentum',
    description:
      'Learn in-demand tools, validate your work with portfolio-ready projects, and move confidently into the next opportunity.',
    ctaLink: '/contact',
    mediaUrl: '/assets/hero_3.jpg',
  },
]

export function HeroSection({ onBrowseClick, onEnrollClick }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_SLIDES.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  const activeSlide = useMemo(() => HERO_SLIDES[activeIndex], [activeIndex])

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % HERO_SLIDES.length)
  }

  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  return (
    <section className="relative overflow-hidden bg-slate-50 text-slate-900">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative z-10 flex flex-col justify-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_35px_75px_-35px_rgba(15,23,42,0.2)] sm:p-10 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8"
              >
                <div className="space-y-5">
                  <p className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                    Featured pathway
                  </p>
                  <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                    {activeSlide.title}
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                    {activeSlide.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href={activeSlide.ctaLink}
                    onClick={onBrowseClick}
                    className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/40 transition hover:bg-sky-500"
                  >
                    View pathway
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/signup"
                    onClick={onEnrollClick}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                  >
                    Start your journey
                  </Link>
                </div>

                {/* <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-center shadow-sm shadow-slate-200/60">
                    <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Outcome</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">98%</p>
                    <p className="mt-2 text-sm text-slate-500">Job-ready placement</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-center shadow-sm shadow-slate-200/60">
                    <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Programs</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">24+</p>
                    <p className="mt-2 text-sm text-slate-500">Certified tracks</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-center shadow-sm shadow-slate-200/60">
                    <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Alumni</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">15K+</p>
                    <p className="mt-2 text-sm text-slate-500">Skilled graduates</p>
                  </div>
                </div> */}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10">
            <div className="hidden sm:block">
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_35px_75px_-35px_rgba(15,23,42,0.2)]">
                <div className="relative p-6 sm:p-8 lg:p-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-[1.75rem] bg-slate-100 p-5 shadow-lg shadow-slate-200/60"
                    >
                      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100">
                        <img
                          src={activeSlide.mediaUrl}
                          alt={activeSlide.title}
                          className="h-[420px] w-full object-cover object-center sm:h-[460px]"
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="absolute inset-x-0 bottom-6 flex items-center justify-between px-6 sm:px-8">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-sky-400/40 hover:bg-slate-50"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    {HERO_SLIDES.map((slide, index) => (
                      <button
                        key={slide.title}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`h-2.5 w-2.5 rounded-full transition ${
                          index === activeIndex ? 'bg-sky-600' : 'bg-slate-300'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-sky-400/40 hover:bg-slate-50"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 block sm:hidden">
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_35px_75px_-35px_rgba(15,23,42,0.2)]">
                <img
                  src={activeSlide.mediaUrl}
                  alt={activeSlide.title}
                  className="h-72 w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
