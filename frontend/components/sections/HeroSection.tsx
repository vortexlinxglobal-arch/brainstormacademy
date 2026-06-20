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
    title: 'Brainstorm Skills Academy',
    description:
      'Career-ready training in ICT, business, hospitality, and hands-on trades, built around real projects, mentorship, and certification pathways.',
    ctaLink: '/courses',
    mediaUrl: '/assets/hero_1.jpg',
    eyebrow: 'Admissions open for practical skills cohorts',
  },
  {
    title: 'Learn With Tools, Projects, And Mentors',
    description:
      'Move from lessons into supervised practice with instructors who understand the local job market and the standards employers expect.',
    ctaLink: '/signup',
    mediaUrl: '/assets/hero_2.JPG',
    eyebrow: 'Blended training for ambitious learners',
  },
  {
    title: 'Build Work You Can Show',
    description:
      'Graduate with practical evidence of what you can do, from technical installations and digital products to service and creative portfolios.',
    ctaLink: '/contact',
    mediaUrl: '/assets/hero_3.jpg',
    eyebrow: 'Portfolio-ready outcomes',
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
    <section className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden bg-slate-950 text-white">
      <AnimatePresence mode="wait">
        <motion.img
          key={activeSlide.mediaUrl}
          src={activeSlide.mediaUrl}
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-slate-950/30" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.78),rgba(15,23,42,0.42),rgba(15,23,42,0.08))]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl space-y-8"
          >
            <div className="space-y-5">
              <p className="max-w-max border-l-4 border-[#d4a873] bg-white/15 px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#f7d894] backdrop-blur">
                {activeSlide.eyebrow}
              </p>
              <h1 className="text-4xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
                {activeSlide.title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-50 sm:text-xl lg:text-2xl lg:leading-9">
                {activeSlide.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={activeSlide.ctaLink}
                onClick={onBrowseClick}
                className="inline-flex items-center justify-center rounded-md bg-[#d4a873] px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-[#e5c4a0]"
              >
                Explore programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/signup"
                onClick={onEnrollClick}
                className="inline-flex items-center justify-center rounded-md border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Start enrollment
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[
            ['24+', 'Certified programs'],
            ['98%', 'Career support rate'],
            ['15K+', 'Learner community'],
          ].map(([value, label]) => (
            <div key={label} className="border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-3xl font-semibold text-white">{value}</p>
              <p className="mt-1 text-sm text-slate-200">{label}</p>
            </div>
          ))}
        </div>

        <div className="absolute bottom-6 right-4 flex items-center gap-3 sm:right-6 lg:right-8">
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
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
                className={`h-2.5 rounded-full transition ${
                  index === activeIndex ? 'w-8 bg-[#d4a873]' : 'w-2.5 bg-white/45'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
