'use client'

import Link from 'next/link'
import Image from 'next/image'
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
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 sm:py-12 md:py-16 lg:py-0 lg:h-screen">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/70 to-transparent pointer-events-none" />

      {/* Main container */}
      <div className="relative z-10 h-full w-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto gap-6 sm:gap-8 md:gap-12">
        
        {/* Left side - Text content */}
        <motion.div
          className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 sm:space-y-8 py-8 sm:py-12 md:py-16 lg:py-0"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            key={`badge-${activeIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-200 border border-blue-500/30"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Learn & Earn Skills
          </motion.div>

          {/* Main headline */}
          <motion.div
            key={`title-${activeIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3 sm:space-y-4"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {currentSlide.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 leading-relaxed">
              {currentSlide.subtitle}
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            key={`desc-${activeIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md"
          >
            {currentSlide.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            key={`cta-${activeIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col xs:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6"
          >
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-semibold text-slate-900 transition hover:bg-slate-50 active:scale-95"
              onClick={onBrowseClick}
            >
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 backdrop-blur-sm px-6 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition hover:bg-white/20 active:scale-95"
              onClick={onEnrollClick}
            >
              Get Started Free
            </Link>
          </motion.div>

          {/* Stats row - hidden on mobile, shown on tablet+ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden sm:flex gap-6 md:gap-8 pt-6 sm:pt-8 border-t border-white/10"
          >
            <div>
              <div className="text-lg sm:text-xl font-bold text-white">98%</div>
              <div className="text-xs sm:text-sm text-slate-400">Job Placement</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-white">24+</div>
              <div className="text-xs sm:text-sm text-slate-400">Programs</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-white">15K+</div>
              <div className="text-xs sm:text-sm text-slate-400">Alumni</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side - Carousel */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center relative py-8 sm:py-12 md:py-16 lg:py-0"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-full aspect-square sm:aspect-video lg:aspect-square max-w-sm md:max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-2xl">
            {/* Carousel slides */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${currentSlide.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>

            {/* Previous button */}
            <button
              onClick={goToPrevious}
              onMouseEnter={() => setAutoPlay(false)}
              onTouchStart={() => setAutoPlay(false)}
              className="absolute left-2 sm:left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm p-2 sm:p-3 text-white transition hover:bg-white/40 active:scale-90"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Next button */}
            <button
              onClick={goToNext}
              onMouseEnter={() => setAutoPlay(false)}
              onTouchStart={() => setAutoPlay(false)}
              className="absolute right-2 sm:right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm p-2 sm:p-3 text-white transition hover:bg-white/40 active:scale-90"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Dot indicators - bottom position */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAutoPlay(false)
                    setActiveIndex(index)
                  }}
                  className={`transition-all ${
                    index === activeIndex
                      ? 'h-2 sm:h-3 w-6 sm:w-8 rounded-full bg-white'
                      : 'h-2 sm:h-3 w-2 sm:w-3 rounded-full bg-white/50 hover:bg-white/70'
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
