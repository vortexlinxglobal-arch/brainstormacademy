'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar } from '@/components/ui/avatar'
import { Clock3, FileText, Heart, LayoutGrid, PlayCircle, Star } from 'lucide-react'

export interface CourseLesson {
  id: string
  title: string
  duration: string
  completed: boolean
}

export interface CourseModule {
  id: string
  title: string
  duration: string
  lessons: CourseLesson[]
}

export interface CourseDetailProps {
  title: string
  subtitle: string
  category: string
  instructor: {
    name: string
    title: string
    avatarUrl?: string
  }
  rating: number
  ratingCount: number
  studentsEnrolled: number
  duration: string
  level: string
  price: string
  progress?: number
  description: string
  modules: CourseModule[]
  reviewsSummary: {
    score: string
    count: number
    highlights: string[]
  }
  resourcesCount: number
  discussionsCount: number
  courseHighlights: string[]
  enrollmentDeadline: string
  certificateText: string
}

export function CourseDetail({
  title,
  subtitle,
  category,
  instructor,
  rating,
  ratingCount,
  studentsEnrolled,
  duration,
  level,
  price,
  progress,
  description,
  modules,
  reviewsSummary,
  resourcesCount,
  discussionsCount,
  courseHighlights,
  enrollmentDeadline,
  certificateText,
}: CourseDetailProps) {
  return (
    <div className="grid gap-8 xl:grid-cols-[1.6fr_0.95fr]">
      <section className="space-y-8">
        <Card className="overflow-hidden">
          <div className="relative bg-slate-950/95 p-6 text-white sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_30%)]" />
            <div className="relative grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
              <div className="space-y-5">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200">
                  {category}
                </Badge>
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
                <p className="max-w-2xl text-sm text-slate-200 sm:text-base">{subtitle}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/10 p-4 text-sm shadow-sm backdrop-blur-sm">
                    <p className="text-slate-300">Rating</p>
                    <p className="mt-2 text-xl font-semibold text-white">{rating.toFixed(1)} <span className="text-slate-300">({ratingCount})</span></p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4 text-sm shadow-sm backdrop-blur-sm">
                    <p className="text-slate-300">Learners</p>
                    <p className="mt-2 text-xl font-semibold text-white">{studentsEnrolled.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
                <div className="flex items-center gap-4">
                  <Avatar imageSrc={instructor.avatarUrl} name={instructor.name} size="lg" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Instructor</p>
                    <p className="mt-2 text-lg font-semibold text-white">{instructor.name}</p>
                    <p className="text-sm text-slate-300">{instructor.title}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    <span>{duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>{level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4" />
                    <span>{modules.length} modules</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <Card className="overflow-hidden">
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950">
              <div className="relative aspect-[16/9] bg-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.2),_transparent_38%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 shadow-xl backdrop-blur-xl">
                    <PlayCircle className="h-14 w-14 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
                  Preview lesson 1
                </div>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <Badge variant="secondary" className="bg-[#1a6b53]/10 text-[#1a6b53] dark:bg-[#1a6b53]/20 dark:text-emerald-200">NSQ Certified</Badge>
                <Badge variant="secondary" className="bg-[#D4AF37]/10 text-[#A67C00] dark:bg-[#D4AF37]/15 dark:text-[#E6C56D]">NBTE Approved</Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Certificate</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{certificateText}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Enroll before</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{enrollmentDeadline}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Enrollment</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{price}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Secure your seat in this practical course and unlock national certification preparation modules.</p>
                <Button variant="default" size="lg" className="mt-6 w-full">
                  Enroll now
                </Button>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Progress overview</p>
                <div className="mt-4 space-y-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400">Overall completion</div>
                  <Progress value={progress ?? 24} className="h-3 rounded-full" />
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>{progress ?? 24}% complete</span>
                    <span>{modules.length} modules</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Course overview</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Everything you need to know before starting the program.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {duration}
              </Badge>
              <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {level}
              </Badge>
              <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {studentsEnrolled.toLocaleString()} learners
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <Card className="rounded-[2rem] border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                  <CardTitle>About this course</CardTitle>
                  <CardDescription>{description}</CardDescription>
                  <ul className="mt-6 space-y-3">
                    {courseHighlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <span className="mt-1 inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="rounded-[2rem] border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                  <CardTitle>Quick stats</CardTitle>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Practical assessments</span>
                      <span>8 tasks</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Expert mentors</span>
                      <span>4 tutors</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Certification prep</span>
                      <span>Included</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="curriculum">
              <Accordion type="single" collapsible defaultValue={modules[0]?.id}>
                {modules.map((module) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger>
                      <div className="flex w-full flex-col gap-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{module.title}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">{module.duration}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{module.lessons.length} lessons</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 px-5 pb-5 pt-0">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#1a6b53]/10 text-[#1a6b53]">
                              <PlayCircle className="h-4 w-4" />
                            </span>
                            <span>{lesson.title}</span>
                          </div>
                          <span className="text-slate-500 dark:text-slate-400">{lesson.duration}</span>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <Card className="rounded-[2rem] border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                  <CardTitle>Reviews</CardTitle>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{reviewsSummary.score} | {reviewsSummary.count} reviews</p>
                  <div className="mt-6 space-y-3">
                    {reviewsSummary.highlights.map((highlight) => (
                      <div key={highlight} className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm text-slate-700 dark:text-slate-300">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="rounded-[2rem] border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                  <CardTitle>Review breakdown</CardTitle>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span>Excellent</span>
                      <span>64%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span>Very good</span>
                      <span>24%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span>Average</span>
                      <span>12%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="resources">
              <Card className="rounded-[2rem] border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                <CardTitle>Resources</CardTitle>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Downloadable files, templates, and study guides for every module.</p>
                <div className="mt-6 grid gap-4">
                  <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[#1a6b53]" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">Course workbook</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">12 pages</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Download</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[#1a6b53]" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">Certification guide</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">4 pages</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Open</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="discussions">
              <Card className="rounded-[2rem] border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                <CardTitle>Discussion topics</CardTitle>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Join peers and tutors in the course forum.</p>
                <div className="mt-6 space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">How to prepare for the practical assignment?</p>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">2 replies</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Share your approach to the business model canvas task.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Need help with module timing</p>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">5 replies</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Ask the instructor about session scheduling.</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </section>
    </div>
  )
}
