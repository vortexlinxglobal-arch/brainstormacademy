'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Users,
  Star,
  Share2,
  Bookmark,
  Play,
  Lock,
  Download,
  MessageCircle,
} from 'lucide-react'

export interface CourseDetailModule {
  id: string
  title: string
  duration: string
  lessons: {
    id: string
    title: string
    duration: string
    type: 'video' | 'resource' | 'quiz'
    completed?: boolean
    locked?: boolean
  }[]
}

export interface CourseDetailInstructor {
  id: string
  name: string
  title: string
  bio: string
  avatar: string
  students: number
}

export interface CourseDetailPageProps {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl?: string
  instructor: CourseDetailInstructor
  price: string
  rating: number
  ratingCount: number
  studentCount: number
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  tags: string[]
  modules: CourseDetailModule[]
  enrolled?: boolean
  progress?: number
}

export function CourseDetailPage({
  id,
  title,
  description,
  thumbnail,
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  instructor,
  price,
  rating,
  ratingCount,
  studentCount,
  duration,
  level,
  category,
  tags,
  modules = [],
  enrolled = false,
  progress = 0,
}: CourseDetailPageProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(enrolled)
  const [isStatusLoading, setIsStatusLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadCourseStatus() {
      try {
        const response = await fetch(`/api/course-status?courseId=${encodeURIComponent(id)}`, {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Unable to load course status')
        }

        const data = await response.json()
        if (!mounted) return

        setIsEnrolled(Array.isArray(data.enrolled) && data.enrolled.includes(id))
        setIsBookmarked(Array.isArray(data.bookmarked) && data.bookmarked.includes(id))
      } catch (error) {
        console.error(error)
      } finally {
        if (mounted) {
          setIsStatusLoading(false)
        }
      }
    }

    loadCourseStatus()

    return () => {
      mounted = false
    }
  }, [id])

  const handleToggleStatus = async (action: 'toggle-enroll' | 'toggle-bookmark') => {
    setIsStatusLoading(true)

    try {
      const response = await fetch('/api/course-status', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: id, action }),
      })

      if (!response.ok) {
        throw new Error('Unable to update course status')
      }

      const data = await response.json()
      setIsEnrolled(Array.isArray(data.enrolled) && data.enrolled.includes(id))
      setIsBookmarked(Array.isArray(data.bookmarked) && data.bookmarked.includes(id))
    } catch (error) {
      console.error(error)
    } finally {
      setIsStatusLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0)
  const totalDuration = modules.length * 2

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(10,108,63,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.14),transparent_45%)] bg-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a6b53]/20 to-transparent" />
        <div className="relative px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-8 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]"
            >
              {/* Main Content */}
              <div className="space-y-6 lg:col-span-2">
                {/* Breadcrumb */}
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Link href="/courses" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
                    Courses
                  </Link>
                  <span className="text-slate-400">/</span>
                  <Link href={`/courses?category=${category}`} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
                    {category}
                  </Link>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-900 dark:text-slate-100">{title}</span>
                </div>

                {/* Title and Badges */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    {title}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300">
                    {description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="rounded-full bg-[#1a6b53] px-4 py-2 text-white">
                      {level}
                    </Badge>
                    <Badge className="rounded-full border-[#D4AF37]/50 bg-[#FEF7E7] text-[#7C5F15] dark:border-[#D4AF37]/30 dark:bg-slate-900 dark:text-[#F5E3A4]">
                      {category}
                    </Badge>
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="rounded-full border-[#D4AF37]/40 text-[#8E6F18] hover:bg-[#FEF7E7] dark:border-[#D4AF37]/30 dark:text-[#E6C56D]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Rating</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {rating} ({ratingCount})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Students</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {studentCount.toLocaleString()}+
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Duration</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Lessons</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {totalLessons}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                  <Avatar imageSrc={instructor.avatar} name={instructor.name} size="lg" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Instructor</p>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {instructor.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {instructor.students.toLocaleString()}+ students
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar CTA */}
              <motion.div
                variants={itemVariants}
                className="space-y-4 lg:sticky lg:top-6 lg:h-fit lg:self-start"
              >
                <Card className="rounded-2xl border-slate-200 shadow-lg dark:border-slate-800">
                  <CardContent className="space-y-6 p-6">
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900 sm:aspect-[16/9]">
                      <Image
                        src={thumbnail}
                        alt={title}
                        width={800}
                        height={450}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/40">
                        <Play className="h-12 w-12 fill-white text-white" />
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Price</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                          {price}
                        </p>
                      </div>

                      {isEnrolled ? (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                Progress
                              </span>
                              <span className="text-slate-600 dark:text-slate-400">
                                {progress}%
                              </span>
                            </div>
                            <Progress value={progress} className="h-2 rounded-full" />
                          </div>
                          <Button
                            variant="brand"
                            size="lg"
                            className="w-full rounded-xl text-base font-semibold"
                            disabled={isStatusLoading}
                          >
                            Continue Learning
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="brand"
                          size="lg"
                          className="w-full rounded-xl text-base font-semibold"
                          onClick={() => handleToggleStatus('toggle-enroll')}
                          disabled={isStatusLoading}
                        >
                          {isStatusLoading ? 'Loading…' : 'Enroll Now'}
                        </Button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 border-t border-slate-200 pt-6 dark:border-slate-800">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full gap-2 rounded-xl"
                        onClick={() => handleToggleStatus('toggle-bookmark')}
                        disabled={isStatusLoading}
                      >
                        <Bookmark
                          className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`}
                        />
                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      </Button>
                      <Button variant="outline" size="lg" className="w-full gap-2 rounded-xl">
                        <Share2 className="h-5 w-5" />
                        Share
                      </Button>
                    </div>

                    {/* What You'll Learn */}
                    <div className="space-y-3 border-t border-slate-200 pt-6 dark:border-slate-800">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        What you'll learn
                      </p>
                      <ul className="space-y-2">
                        {[
                          'Master practical skills for real-world application',
                          'Earn NSQ and NBTE certification',
                          'Get mentoring from industry professionals',
                          'Join a supportive learning community',
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                            <span className="text-slate-700 dark:text-slate-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="relative flex w-full snap-x snap-mandatory items-center gap-3 overflow-x-auto rounded-full bg-slate-100 px-2 py-2 text-left shadow-sm shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none lg:w-auto">
              <TabsTrigger
                value="overview"
                className="min-w-[9rem] rounded-full border border-transparent bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white dark:bg-slate-900/95 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-950 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 data-[state=active]:dark:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="curriculum"
                className="min-w-[9rem] rounded-full border border-transparent bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white dark:bg-slate-900/95 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-950 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 data-[state=active]:dark:text-white"
              >
                Curriculum
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="min-w-[9rem] rounded-full border border-transparent bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white dark:bg-slate-900/95 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-950 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 data-[state=active]:dark:text-white"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="min-w-[9rem] rounded-full border border-transparent bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white dark:bg-slate-900/95 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-950 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 data-[state=active]:dark:text-white"
              >
                Resources
              </TabsTrigger>
              <TabsTrigger
                value="discussions"
                className="min-w-[9rem] rounded-full border border-transparent bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white dark:bg-slate-900/95 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-950 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 data-[state=active]:dark:text-white"
              >
                Discussions
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Video Player */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={activeTab === 'overview' ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4 }}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/95"
              >
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={videoUrl}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </motion.div>

              {/* Course Description */}
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="space-y-6 lg:col-span-2">
                  <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/95">
                    <CardHeader>
                      <CardTitle>About this course</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 divide-y divide-slate-200 dark:divide-slate-800">
                      <p className="text-slate-700 dark:text-slate-300">{description}</p>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            Course Objectives
                          </h4>
                          <ul className="mt-3 space-y-2">
                            {[
                              'Develop practical expertise in the field',
                              'Prepare for NSQ and NBTE certification exams',
                              'Build professional networks with peers',
                              'Gain real-world work experience',
                            ].map((obj, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                                {obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Instructor Details Sidebar */}
                <div className="space-y-6">
                  <Card className="rounded-2xl border-slate-200 dark:border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-lg">Instructor</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Avatar imageSrc={instructor.avatar} name={instructor.name} size="lg" />
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {instructor.name}
                        </h4>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          {instructor.title}
                        </p>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {instructor.bio}
                      </p>
                      <Button variant="outline" size="sm" className="w-full rounded-xl">
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="space-y-6">
              <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/95">
                <CardHeader>
                  <CardTitle>Curriculum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 divide-y divide-slate-200 dark:divide-slate-800">
                  <Accordion type="single" collapsible className="space-y-3">
                    {modules.map((module, idx) => (
                      <AccordionItem
                        key={module.id}
                        value={module.id}
                        className="rounded-3xl border border-slate-200 px-6 dark:border-slate-800"
                      >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a6b53]/10 text-sm font-semibold text-[#1a6b53]">
                          {idx + 1}
                        </span>
                        <div className="text-left">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {module.title}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {module.lessons.length} lessons • {module.duration}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-4">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <div className="flex-1 flex items-center gap-3">
                            {lesson.type === 'video' && <Play className="h-5 w-5 text-[#1a6b53]" />}
                            {lesson.type === 'resource' && (
                              <Download className="h-5 w-5 text-blue-500" />
                            )}
                            {lesson.type === 'quiz' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {lesson.duration}
                              </p>
                            </div>
                          </div>
                          {lesson.locked && <Lock className="h-5 w-5 text-slate-400" />}
                          {lesson.completed && (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          )}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card className="rounded-2xl border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400">
                    Reviews section coming soon. Current average rating: {rating}/5.0 from {ratingCount} reviews
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <Card className="rounded-2xl border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Course Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      'Course Syllabus (PDF)',
                      'Student Handbook',
                      'Project Templates',
                      'Additional Reading Materials',
                    ].map((resource, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                      >
                        <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Download className="h-5 w-5" />
                          {resource}
                        </span>
                        <Button variant="gold" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Discussions Tab */}
            <TabsContent value="discussions" className="space-y-6">
              <Card className="rounded-2xl border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Community Discussions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400">
                    Discussions section coming soon. Connect with fellow students and instructors here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:hidden" aria-hidden="true">
          <div className="h-24" />
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-xl shadow-slate-200/20 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {isEnrolled ? 'Keep going with this course' : 'Ready to start learning?'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEnrolled ? 'Continue where you left off.' : 'Secure your spot in the next session.'}
            </p>
          </div>
          <Button
            variant="brand"
            size="lg"
            className="min-w-[10rem] rounded-2xl"
            onClick={() => handleToggleStatus('toggle-enroll')}
            disabled={isStatusLoading}
          >
            {isStatusLoading ? 'Loading…' : isEnrolled ? 'Continue' : 'Enroll Now'}
          </Button>
        </div>
      </div>
    </div>
  )
}
