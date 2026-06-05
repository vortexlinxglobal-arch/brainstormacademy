'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/components/cards/CourseCard'
import { Search, Filter, X } from 'lucide-react'
import { courseCatalog, categories, levels } from '@/lib/courses'

const allCourses = courseCatalog

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([])
  const [statusLoading, setStatusLoading] = useState(true)

  const filteredCourses = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return allCourses.filter((course) => {
      const matchesSearch =
        normalizedQuery === '' ||
        course.title.toLowerCase().includes(normalizedQuery) ||
        course.category.toLowerCase().includes(normalizedQuery) ||
        course.instructor.name.toLowerCase().includes(normalizedQuery)

      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel

      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [searchQuery, selectedCategory, selectedLevel])

  useEffect(() => {
    let mounted = true

    async function loadStatus() {
      try {
        const response = await fetch('/api/course-status', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Unable to load saved course status')
        }

        const data = await response.json()
        if (!mounted) return

        setEnrolledCourseIds(Array.isArray(data.enrolled) ? data.enrolled : [])
      } catch (error) {
        console.error(error)
      } finally {
        if (mounted) {
          setStatusLoading(false)
        }
      }
    }

    loadStatus()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="overflow-visible bg-[#fbf5eb] dark:bg-slate-950">
      <header className="z-40 border-b border-[#d4a873]/30 bg-[#f6efe1]/95 backdrop-blur-xl md:sticky md:top-0">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#2f553f] hover:text-[#193223]">
              ← Back to home
            </Link>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                All Courses
              </h1>
              <p className="max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
                Choose a course to empower your future with practical skills and industry-recognized certifications.
              </p>
            </div>
          </div>

          <div className="grid gap-2 xs:grid-cols-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-[#d4a873]/40 bg-[#f5ede0] p-4 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5a4d32]">NSQ Courses</p>
              <p className="mt-2 text-3xl font-bold text-[#163920]">17+</p>
            </div>
            <div className="rounded-3xl border border-[#d4a873]/40 bg-[#f5ede0] p-4 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5a4d32]">NBTE Certified</p>
              <p className="mt-2 text-3xl font-bold text-[#163920]">100%</p>
            </div>
            <div className="rounded-3xl border border-[#d4a873]/40 bg-[#f5ede0] p-4 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5a4d32]">Avg Duration</p>
              <p className="mt-2 text-3xl font-bold text-[#163920]">4–6 mo</p>
            </div>
            <div className="rounded-3xl border border-[#d4a873]/40 bg-[#f5ede0] p-4 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5a4d32]">Program Areas</p>
              <p className="mt-2 text-3xl font-bold text-[#163920]">9</p>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-slate-50 dark:bg-slate-950/80 py-6 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl sm:rounded-[2rem] border border-[#d4a873]/20 bg-white/95 p-4 shadow-sm sm:p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1a6b53]">Our NSQ Courses</p>
                <h2 className="text-2xl font-semibold text-[#113821] sm:text-3xl">
                  Browse 17+ practical programs built for job-ready success.
                </h2>
                <p className="max-w-2xl text-[#4e4a40]">
                  Learning paths across technology, trade, arts, service and business with practical training, NBTE approval, and career support.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-[#1a6b53] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f5b3d]">
                  Ask a question
                </Link>
                <Link href="/about" className="inline-flex items-center justify-center rounded-full border border-[#d4a873]/40 bg-[#fff9ec] px-5 py-3 text-sm font-semibold text-[#3b4327] transition hover:border-[#d4a873] hover:bg-[#f7efe0]">
                  Learn more about us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
            <motion.aside
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              className={`md:block ${showFilters ? 'block' : 'hidden'} space-y-6 sm:space-y-8`}
            >
              <div className="rounded-3xl border border-[#d4a873]/30 bg-[#f9f3e8] p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#163920]">Search courses</h3>
                    <p className="text-sm text-[#5d563f]">Find the right training fast.</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7dfc9] text-[#4b4728] transition hover:bg-[#ddd3b0] lg:hidden"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#4d4228]">Search</label>
                  <div className="mt-3 relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7c6f4f]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by course, instructor, or skill"
                      className="w-full rounded-3xl border border-[#d4a873]/40 bg-white py-3 pl-12 pr-4 text-sm text-[#1d3825] outline-none transition focus:border-[#1a6b53] focus:ring-2 focus:ring-[#1a6b53]/20"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#d4a873]/30 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#163920]">Filter by category</h3>
                <div className="mt-5 space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                        selectedCategory === category
                          ? 'bg-[#1a6b53] text-white shadow-sm'
                          : 'bg-[#f3ede3] text-[#4a462f] hover:bg-[#e7dec4]'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[#d4a873]/30 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#163920]">Filter by level</h3>
                <div className="mt-5 space-y-2">
                  {levels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedLevel(level)}
                      className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                        selectedLevel === level
                          ? 'bg-[#1a6b53] text-white shadow-sm'
                          : 'bg-[#f3ede3] text-[#4a462f] hover:bg-[#e7dec4]'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All') && (
                <Button
                  variant="outline"
                  className="w-full rounded-full border-slate-300 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                    setSelectedLevel('All')
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </motion.aside>

            <div className="space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    Showing {filteredCourses.length} of {allCourses.length} courses
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                    Explore every training path.
                  </h2>
                  {statusLoading ? (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Loading saved course status…</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    {selectedCategory === 'All' ? 'All categories' : selectedCategory}
                  </span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    {selectedLevel === 'All' ? 'All levels' : selectedLevel}
                  </span>
                </div>
              </div>

              <div className="lg:hidden">
                <Button
                  variant="outline"
                  className="w-full rounded-full py-3 text-sm font-semibold"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {showFilters ? 'Hide filters' : 'Show filters'}
                </Button>
              </div>

              {filteredCourses.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {filteredCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                    >
                      <CourseCard
                        {...course}
                        enrolled={enrolledCourseIds.includes(course.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No courses found</h3>
                  <p className="mt-3 text-slate-600 dark:text-slate-400">Try a different search term or reset your filters.</p>
                  <Button
                    variant="outline"
                    className="mt-6 w-full max-w-xs rounded-full py-3 text-sm font-semibold"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('All')
                      setSelectedLevel('All')
                    }}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
