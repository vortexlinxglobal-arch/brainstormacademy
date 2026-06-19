'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, BookOpen, Sparkles, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const steps = [
  {
    title: 'Beginner',
    description: 'Start with core foundations and skills orientation to build confidence.',
    icon: Sparkles,
    detail:
      'Build your base knowledge with orientation, beginner-friendly lessons, and practical introductions to your chosen skill track.',
    threshold: 20,
  },
  {
    title: 'Learning Phase',
    description: 'Advance through guided lessons, hands-on practice, and mentor support.',
    icon: BookOpen,
    detail:
      'Continue through structured modules with real projects, instructor feedback, and hands-on practice designed to strengthen your skills.',
    threshold: 45,
  },
  {
    title: 'Assessment',
    description: 'Complete practical evaluations and certification-ready projects.',
    icon: ShieldCheck,
    detail:
      'Demonstrate competence with assessments, portfolio work, and real-world tasks that prepare you for formal certification.',
    threshold: 75,
  },
  {
    title: 'Certified Professional',
    description: 'Earn your certificate and unlock career pathways with confidence.',
    icon: Award,
    detail:
      'Finish strong with certification validation, graduation recognition, and a clear launch into career or entrepreneurship opportunities.',
    threshold: 100,
    isFinal: true,
  },
]

const sampleProgress = 68

const liveCourseSchedule = [
  {
    id: '1',
    name: 'Network System & Security Installation',
    nextStart: 'July 8, 2026',
    duration: '12 weeks',
  },
  {
    id: '2',
    name: 'Computer Hardware Repair & Maintenance',
    nextStart: 'July 15, 2026',
    duration: '14 weeks',
  },
  {
    id: '3',
    name: 'Web Applications Development (Frontend, Backend, Full-Stack)',
    nextStart: 'July 22, 2026',
    duration: '10 weeks',
  },
  {
    id: '4',
    name: 'Catering & Hospitality Training',
    nextStart: 'August 1, 2026',
    duration: '8 weeks',
  },
]

const expertInstructors = [
  {
    id: '1',
    name: "Sa'adatu Muhammad",
    specialty: 'Beauty Therapist Facilitator',
    avatar: 'https://api.dicebear.com/7.x/female/svg?seed=saadatu',
  },
  {
    id: '2',
    name: "Ashir Rufa'i",
    specialty: 'Computer Hardware Facilitator',
    avatar: 'https://api.dicebear.com/7.x/female/svg?seed=ashir',
  },
  {
    id: '3',
    name: 'Fatima Suleiman',
    specialty: 'Hospitality & Catering Facilitator',
    avatar: 'https://api.dicebear.com/7.x/male/svg?seed=fatima',
  },
  {
    id: '4',
    name: 'Lukman Ibrahim',
    specialty: 'Lead Networking & Systems Security',
    avatar: 'https://api.dicebear.com/7.x/female/svg?seed=lukman',
  },
]

export function CertificationPathway() {
  const currentStepFromProgress = useMemo(() => {
    if (sampleProgress >= 85) return 3
    if (sampleProgress >= 60) return 2
    if (sampleProgress >= 25) return 1
    return 0
  }, [])

  const [activeStep, setActiveStep] = useState(currentStepFromProgress)

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Certification Pathway</p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Your journey from beginner to certified professional.
          </h2>
          <p className="mx-auto text-base leading-8 text-slate-600 sm:text-lg">
            Follow a clear, responsive timeline that guides learners through every milestone toward industry-recognized certification.
          </p>
        </div>

        <Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="grid gap-8">
              <div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = index === activeStep
                    const isComplete = sampleProgress >= step.threshold
                    return (
                      <motion.button
                        key={step.title}
                        type="button"
                        onClick={() => setActiveStep(index)}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.1 }}
                        className={`group relative flex flex-col rounded-[1.75rem] border p-5 text-left transition ${
                          isActive
                            ? 'border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-500/10'
                            : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                              isComplete ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-white'
                            } shadow-lg shadow-slate-950/10`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                              Step {index + 1}
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-600">{step.description}</p>
                        <div className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                          <span className={`inline-flex h-2.5 w-2.5 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span>{isComplete ? 'Complete' : index === currentStepFromProgress ? 'In progress' : 'Pending'}</span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="mt-14 bg-slate-50">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8 space-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Expert Instructors</p>
              <h3 className="text-3xl font-semibold text-slate-900">Learn from our top instructors</h3>
              <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-600">
                Meet the experienced professionals who lead our courses with practical guidance and career-focused mentorship.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {expertInstructors.map((instructor) => (
                <div key={instructor.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
                  <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-slate-100">
                    <img src={instructor.avatar} alt={`${instructor.name} profile`} className="h-full w-full object-cover" />
                  </div>
                  <h4 className="mt-5 text-lg font-semibold text-slate-900">{instructor.name}</h4>
                  <p className="mt-2 text-sm text-slate-600">{instructor.specialty}</p>
                  <button className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                    View Bio
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="space-y-2 border-b border-slate-200 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Live Course Schedule</p>
              <h3 className="text-2xl font-semibold text-slate-900">Upcoming cohorts with open registration</h3>
              <p className="text-sm leading-6 text-slate-600">
                Browse the next start dates and durations, then register for the course that fits your goals.
              </p>
            </div>

            <div className="hidden sm:block">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-slate-50 text-left text-sm font-semibold text-slate-500">
                    <th className="px-6 py-4">Course Name</th>
                    <th className="px-6 py-4">Next Start Date</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4 text-right">Register</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {liveCourseSchedule.map((course) => (
                    <tr key={course.id} className="bg-white transition hover:bg-slate-50">
                      <td className="px-6 py-5 text-sm font-medium text-slate-900">{course.name}</td>
                      <td className="px-6 py-5 text-sm text-slate-600">{course.nextStart}</td>
                      <td className="px-6 py-5 text-sm text-slate-600">{course.duration}</td>
                      <td className="px-6 py-5 text-right">
                        <button className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                          Register
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 sm:hidden">
              {liveCourseSchedule.map((course) => (
                <div key={course.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base font-semibold text-slate-900">{course.name}</h4>
                      <p className="mt-2 text-sm text-slate-600">Next Start: {course.nextStart}</p>
                      <p className="mt-1 text-sm text-slate-600">Duration: {course.duration}</p>
                    </div>
                    <button className="inline-flex h-11 items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
