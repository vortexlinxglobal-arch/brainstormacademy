'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

export interface HeroSectionProps {
  onBrowseClick?: () => void
  onEnrollClick?: () => void
  onDemoClick?: () => void
}

const slides = [
  {
    title: 'Skills for jobs, built for today.',
    subtitle: 'Practical training with online support, wherever you are.',
    description: 'Access industry-leading courses designed for immediate employment and practical mastery. Learn from expert instructors with real-world experience.',
    image: '/assets/hero_1.jpg',
  },
  {
    title: 'Start learning in 30 seconds.',
    subtitle: 'Affordable intro programs with job placement guidance.',
    description: 'Get started with flexible payment plans and comprehensive support. Our career counselors guide you every step of the way.',
    image: '/assets/hero_2.JPG',
  },
  {
    title: 'Build your future with us.',
    subtitle: 'Apply what you learn from day one with blended practical courses.',
    description: 'Combine online learning with hands-on practice. Graduate with portfolio-ready projects and industry certifications.',
    image: '/assets/hero_3.jpg',
  },
]

export function HeroSection({ onBrowseClick, onEnrollClick }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [autoPlay])

  const goToPrevious = () => {
    setAutoPlay(false)
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setAutoPlay(false)
    setActiveIndex((current) => (current + 1) % slides.length)
  }

  const currentSlide = slides[activeIndex]

  return (
    <section className="relative overflow-hidden bg-slate-950 py-12 sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.18),_transparent_24%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(26,107,83,0.14),_transparent_22%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div
          className="flex flex-col justify-center rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10 lg:p-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-[#D4AF37]/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#F6E2B3]">
            NBTE Approved • NSQ Certified
          </span>

          <div className="mt-8 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Skills for jobs, built for today.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Practical training with online support, wherever you are. Start fast with blended NSQ pathways designed for rapid employment and entrepreneurial success.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Hands-on workshops', value: 'Practical trade skills' },
              { label: 'Career-ready', value: 'Placement support' },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                <p className="mt-2 font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/courses"
              onClick={onBrowseClick}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-[#D4AF37]/20 transition hover:bg-[#b99223]"
            >
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              onClick={onEnrollClick}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Start your journey
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Success</p>
              <p className="mt-2 text-2xl font-bold text-white">98%</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Programs</p>
              <p className="mt-2 text-2xl font-bold text-white">24+</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Alumni</p>
              <p className="mt-2 text-2xl font-bold text-white">15K+</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/25"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/30 to-slate-950/95" />
          <div className="relative aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[10/12]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentSlide.image})` }}
            />
          </div>

          <div className="relative z-10 p-6 sm:p-8">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-900/80 p-5 text-slate-200 shadow-xl shadow-slate-950/20">
                <p className="text-sm uppercase tracking-[0.2em] text-[#D4AF37]">{currentSlide.subtitle}</p>
                <p className="mt-3 text-lg font-semibold text-white">{currentSlide.title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{currentSlide.description}</p>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-3xl bg-white/5 p-4 text-sm text-slate-200">
                <span className="font-semibold text-white">Featured story</span>
                <span className="rounded-full bg-[#D4AF37]/20 px-3 py-1 text-[#D4AF37]">Updated daily</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goToPrevious}
                onMouseEnter={() => setAutoPlay(false)}
                onTouchStart={() => setAutoPlay(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                onMouseEnter={() => setAutoPlay(false)}
                onTouchStart={() => setAutoPlay(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setAutoPlay(false)
                    setActiveIndex(index)
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex ? 'w-10 bg-[#D4AF37]' : 'w-2 bg-white/30 hover:w-6 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
