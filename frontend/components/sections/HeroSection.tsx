'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface HeroSectionProps {
  onBrowseClick?: () => void
  onEnrollClick?: () => void
  onDemoClick?: () => void
}

const slides = [
  {
    title: 'Skills for jobs, built for today.',
    subtitle: 'Practical training with online support, wherever you are.',
    image: '/assets/hero_1.jpg',
  },
  {
    title: 'Start learning in 30 seconds.',
    subtitle: 'Affordable intro programs with job placement guidance.',
    image: '/assets/hero_2.JPG',
  },
  {
    title: 'Build your future with us.',
    subtitle: 'Apply what you learn from day one with blended practical courses.',
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
    <section className="relative h-screen overflow-hidden bg-slate-900">
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${currentSlide.image})` }}
        />
        <div className="absolute inset-0 bg-black/65" />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <motion.div
            key={`title-${activeIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {currentSlide.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-100 leading-relaxed max-w-3xl mx-auto">
              {currentSlide.subtitle}
            </p>
          </motion.div>

          <motion.div
            key={`cta-${activeIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
              onClick={onBrowseClick}
            >
              Explore Courses
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/20"
              onClick={onEnrollClick}
            >
              Ask a question
            </Link>
          </motion.div>
        </div>
      </div>

      <button
        onClick={goToPrevious}
        onMouseEnter={() => setAutoPlay(false)}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/40 sm:left-6"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        onMouseEnter={() => setAutoPlay(false)}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/40 sm:right-6"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setAutoPlay(false)
              setActiveIndex(index)
            }}
            className={`transition-all ${
              index === activeIndex
                ? 'h-3 w-8 rounded-full bg-white'
                : 'h-3 w-3 rounded-full bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
