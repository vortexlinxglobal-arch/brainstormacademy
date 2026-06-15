'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { HeroSection } from '@/components/sections/HeroSection'
import { CertificationPathway } from '@/components/sections/CertificationPathway'
import { CourseCard } from '@/components/cards/CourseCard'
import { Star, ArrowRight, CheckCircle } from 'lucide-react'

const featuredCourses = [
  {
    id: '1',
    title: 'Catering & Hospitality Training',
    category: 'Healthcare',
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=300&fit=crop',
    instructor: {
      name: 'Dr. Chioma Okafor',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma',
      title: 'MD, FWACS',
    },
    rating: 4.8,
    ratingCount: 342,
    price: '₦45,000',
    duration: '12 weeks',
    level: 'Beginner' as const,
    href: '/courses/nursing-1',
  },
  {
    id: '2',
    title: 'Business Center Management Professional',
    category: 'Business',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    instructor: {
      name: 'Mr. Aminu Lagos',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aminu',
      title: 'Business Consultant',
    },
    rating: 4.9,
    ratingCount: 521,
    price: '₦52,000',
    duration: '14 weeks',
    level: 'Intermediate' as const,
    href: '/courses/bcm-pro',
  },
  {
    id: '3',
    title: 'ICT Fundamentals & Digital Literacy',
    category: 'Technology',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    instructor: {
      name: 'Eng. Adebayo Oluwafemi',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo',
      title: 'Software Engineer',
    },
    rating: 4.7,
    ratingCount: 428,
    price: '₦38,000',
    duration: '10 weeks',
    level: 'Beginner' as const,
    href: '/courses/ict-fundamentals',
  },
  {
    id: '4',
    title: 'Entrepreneurship & Business Startup',
    category: 'Entrepreneurship',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    instructor: {
      name: 'Mrs. Zainab Hassan',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zainab',
      title: 'Business Coach',
    },
    rating: 4.6,
    ratingCount: 289,
    price: '₦35,000',
    duration: '8 weeks',
    level: 'Beginner' as const,
    href: '/courses/entrepreneurship',
  },
]

const testimonials = [
  {
    name: 'Adekunle Adeyemi',
    role: 'Certified Nursing Professional',
    text: 'The practical approach to nursing sciences has equipped me with real-world skills. I got employed 3 months after completion!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adekunle',
    rating: 5,
  },
  {
    name: 'Folake Ogunleye',
    role: 'Computer Hardware and GSM Repair & Maintenance',
    text: 'Exceptional training with industry experts. The Business Center Management course transformed my career trajectory.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Folake',
    rating: 5,
  },
  {
    name: 'Chukwu Paul',
    role: 'ICT Professional',
    text: 'Great structure and hands-on learning. The instructors are supportive and the community is very helpful.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chukwu',
    rating: 5,
  },
]

const programCategories = [
  {
    title: 'Cosmetology & Beauty Therapy',
    description: 'Professional salon training & entrepreneurship',
    badge: 'Online + practical',
    emoji: '💄',
  },
  {
    title: 'Electrical Installation',
    description: 'Industry-ready practical electrical skills',
    badge: 'Blended learning',
    emoji: '💡',
  },
  {
    title: 'Networking & System Security Installation',
    description: 'Computer networking, hardware, and software support',
    badge: 'Online & hybrid',
    emoji: '💻',
  },
  {
    title: 'Fashion Design & Garment Making',
    description: 'Design, tailoring, and style business coaching',
    badge: 'In-person studio',
    emoji: '👗',
  },
  {
    title: 'Painting, Decoration & Interior Design',
    description: 'Creative decor, finishing and space styling',
    badge: 'Hands-on practical',
    emoji: '🎨',
  },
  {
    title: 'Catering & Hospitality Training',
    description: 'Hospitality service, catering and event skills',
    badge: 'Blended programs',
    emoji: '🍽️',
  },
]

const platformHighlights = [
  {
    title: 'Learning workflows for every role',
    description:
      'Students, instructors and administrators each get a refined path that reduces friction and supports measurable progress.',
  },
  {
    title: 'Clear, modern course discovery',
    description:
      'A clean catalog experience helps learners find the right skills quickly with confidence and relevance.',
  },
  {
    title: 'Responsive experience across devices',
    description:
      'Optimized layouts and cards ensure fast access on mobile, tablet, and desktop without sacrificing clarity.',
  },
]

const workShowcase = [
  {
    id: '1',
    title: 'Electrical systems prototype',
    caption: 'A student-built wiring dashboard for real installations.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
  },
  {
    id: '2',
    title: 'Hospitality operations plan',
    caption: 'A live service blueprint used in training cohorts.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop',
  },
  {
    id: '3',
    title: 'Digital business case study',
    caption: 'A course capstone project aligned to employer needs.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&h=600&fit=crop',
  },
  {
    id: '4',
    title: 'Creative portfolio showcase',
    caption: 'Student work that demonstrates real creative skills.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
  },
]

const careerTargets = [
  'Cybersecurity Analyst',
  'Hospitality Manager',
  'Creative Designer',
  'Business Operations Lead',
]

const careerSkills: Record<string, string[]> = {
  'Cybersecurity Analyst': ['Network security', 'Threat analysis', 'System protection'],
  'Hospitality Manager': ['Service leadership', 'Event planning', 'Customer operations'],
  'Creative Designer': ['Visual design', 'Brand storytelling', 'Portfolio creation'],
  'Business Operations Lead': ['Workflow strategy', 'Resource planning', 'Performance metrics'],
}

const careerRecommendations: Record<string, { course: string; detail: string }> = {
  'Cybersecurity Analyst': {
    course: 'Networking & System Security Installation',
    detail:
      'This path helps you develop the technical skills employers want for entry-level cybersecurity and infrastructure roles.',
  },
  'Hospitality Manager': {
    course: 'Catering & Hospitality Training',
    detail:
      'Designed for learners who want to lead service teams, manage venues, and deliver excellent guest experiences.',
  },
  'Creative Designer': {
    course: 'Fashion Design & Garment Making',
    detail:
      'A practical pathway for learners who want to build creative portfolios and launch design services.',
  },
  'Business Operations Lead': {
    course: 'Business Center Management Professional',
    detail:
      'Learn the operations, planning, and leadership skills needed to run modern service or trade programs.',
  },
}

const credentialBadges = [
  {
    id: '1',
    title: 'NSQ Accredited',
    issuer: 'National Skills Council',
    description: 'Nationally recognized competency-based certification for skilled training pathways.',
  },
  {
    id: '2',
    title: 'Industry-Backed',
    issuer: 'Employer Partners',
    description: 'Designed with employer input so your credential maps to real job requirements.',
  },
  {
    id: '3',
    title: 'Practical Competency',
    issuer: 'Certification Board',
    description: 'Focuses on demonstrable skill mastery rather than time spent in class.',
  },
]

const outcomePrograms = [
  {
    id: '1',
    outcome: 'Become a certified hospitality leader',
    skills: ['Guest service', 'Event flow', 'Team leadership'],
  },
  {
    id: '2',
    outcome: 'Launch a modern business operations career',
    skills: ['Business systems', 'Process design', 'Performance tracking'],
  },
  {
    id: '3',
    outcome: 'Build strong digital and network skills',
    skills: ['Hardware support', 'Security basics', 'System setup'],
  },
]

const successTicker = [
  'Aisha just earned her Hospitality Certification.',
  'John secured a role as a Junior Network Technician.',
  'Folake completed a creative portfolio with industry feedback.',
  'Emeka launched a business-ready operations plan.',
]

// Fallback data in case API fails
const FALLBACK_PROGRAMS = [
  {
    id: '1',
    title: 'Woodwork & Craftsmanship',
    category: 'Creative Trade',
    image_url: '/images/gallery/painting-1.jpg',
  },
  {
    id: '2',
    title: 'Digital Media Production',
    category: 'Creative Tech',
    image_url: '/images/gallery/hospitality-1.jpg',
  },
  {
    id: '3',
    title: 'Hospitality & Event Styling',
    category: 'Service Skills',
    image_url: '/images/gallery/hospitality-4.jpg',
  },
  {
    id: '4',
    title: 'Electrical & Solar Installation',
    category: 'Energy Trade',
    image_url: '/images/gallery/painting-5.jpg',
  },
  {
    id: '5',
    title: 'Fashion Design Labs',
    category: 'Creative Enterprise',
    image_url: '/images/gallery/painting-3.jpg',
  },
  {
    id: '6',
    title: 'ICT & Network Cabling',
    category: 'Digital Skills',
    image_url: '/images/gallery/hospitality-6.jpg',
  },
]

const quizQuestions = [
  {
    id: 'interest',
    question: 'What type of work interests you most?',
    options: [
      { label: 'Building digital systems', value: 'tech' },
      { label: 'Launching a business', value: 'business' },
      { label: 'Creative design work', value: 'creative' },
      { label: 'Service and hospitality', value: 'service' },
    ],
  },
  {
    id: 'learningStyle',
    question: 'How do you prefer to learn?',
    options: [
      { label: 'Hands-on practice', value: 'handsOn' },
      { label: 'Strategy and planning', value: 'business' },
      { label: 'Creative project work', value: 'creative' },
      { label: 'Technical systems', value: 'tech' },
    ],
  },
  {
    id: 'goal',
    question: 'What is your main goal?',
    options: [
      { label: 'Start a business', value: 'business' },
      { label: 'Join a tech team', value: 'tech' },
      { label: 'Create a portfolio', value: 'creative' },
      { label: 'Lead hospitality operations', value: 'service' },
    ],
  },
]

const quizRecommendations: Record<string, { title: string; description: string; course: string }> = {
  tech: {
    title: 'ICT Fundamentals & Digital Literacy',
    description: 'A course built for learners who want to build technical confidence and enter digital roles.',
    course: 'ICT Fundamentals',
  },
  business: {
    title: 'Business Center Management Professional',
    description: 'Perfect for future business leaders and operations managers ready to lead teams.',
    course: 'Business Center Management',
  },
  creative: {
    title: 'Fashion Design & Garment Making',
    description: 'Designed for creative learners who want to build a powerful portfolio and hands-on skills.',
    course: 'Fashion Design',
  },
  service: {
    title: 'Catering & Hospitality Training',
    description: 'Ideal for service-focused learners aiming for practical hospitality and operations roles.',
    course: 'Hospitality Training',
  },
}

export function Homepage() {
  const [recentPrograms, setRecentPrograms] = useState(FALLBACK_PROGRAMS)
  const [isLoading, setIsLoading] = useState(true)
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [selectedCareer, setSelectedCareer] = useState(careerTargets[0])
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState(credentialBadges[0])

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch('/api/programs')
        if (!response.ok) throw new Error('Failed to fetch programs')
        const data = await response.json()
        // Map API response to use image_url instead of image
        const mappedData = data.map((prog: any) => ({
          ...prog,
          image_url: prog.image_url || '/images/gallery/painting-1.jpg',
        }))
        setRecentPrograms(mappedData.length > 0 ? mappedData : FALLBACK_PROGRAMS)
      } catch (error) {
        console.error('Error fetching programs:', error)
        setRecentPrograms(FALLBACK_PROGRAMS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrograms()
  }, [])
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

  return (
    <div className="min-h-screen bg-white">
      <HeroSection
        onBrowseClick={() => console.log('Browse courses')}
        onEnrollClick={() => console.log('Enroll now')}
      />

      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Competency Evidence Gallery</p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">See student work that proves our outcomes.</h2>
                <p className="text-base leading-8 text-slate-600">
                  Real course projects and practical work examples showing the skills learners build in our programs.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {workShowcase.map((item) => (
                  <div key={item.id} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950/5 shadow-sm transition hover:shadow-md">
                    <div className="relative h-40 overflow-hidden bg-slate-100">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Dream Job Mapper</p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Match a career to the skills and courses you need.</h2>
                <p className="text-base leading-8 text-slate-600">
                  Select a target career to see the job-critical skills and the Brainstorm courses that support them.
                </p>
              </div>

              <div className="mt-8 space-y-6">
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                  <label htmlFor="career-select" className="text-sm font-semibold text-slate-700">
                    Target career
                  </label>
                  <select
                    id="career-select"
                    value={selectedCareer}
                    onChange={(event) => setSelectedCareer(event.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    {careerTargets.map((career) => (
                      <option key={career} value={career}>{career}</option>
                    ))}
                  </select>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Required skills</p>
                  <ul className="mt-4 space-y-3">
                    {careerSkills[selectedCareer].map((skill) => (
                      <li key={skill} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Recommended course</p>
                  <div className="mt-4 rounded-3xl bg-white p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{careerRecommendations[selectedCareer].course}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{careerRecommendations[selectedCareer].detail}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Credential Showcase</p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Verified badges that prove your training.</h2>
                <p className="text-base leading-8 text-slate-600">
                  Showcasing the credentials and quality signals that build trust with learners and employers.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {credentialBadges.map((badge) => (
                  <div key={badge.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 text-center shadow-sm">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 mx-auto text-xl font-bold">
                      ✓
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-slate-900">{badge.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{badge.issuer}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBadge(badge)
                        setIsBadgeModalOpen(true)
                      }}
                      className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Verify
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">Live Success Ticker</p>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Recent learner outcomes</h2>
                <p className="text-base leading-8 text-slate-300">
                  Real learner milestones that reinforce trust and show the specific outcomes our programs deliver.
                </p>
              </div>

              <div className="mt-8 space-y-4 overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5">
                {successTicker.map((item, index) => (
                  <div key={index} className="rounded-3xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Outcome-Based Pathways</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Programs designed around what you will achieve.</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {outcomePrograms.map((program) => (
              <div key={program.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">{program.outcome}</h3>
                <div className="mt-5 space-y-3">
                  {program.skills.map((skill) => (
                    <span key={skill} className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Modal
        open={isBadgeModalOpen}
        title={selectedBadge.title}
        description={selectedBadge.issuer}
        onClose={() => setIsBadgeModalOpen(false)}
      >
        <p className="text-sm text-slate-700">{selectedBadge.description}</p>
      </Modal>

      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl space-y-4 text-center mx-auto">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Skill Assessment</p>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Find the course best suited to your goals.</h2>
            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              Answer three quick questions and get a tailored recommendation in seconds.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <motion.div
                key={activeQuestion}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Question {Math.min(activeQuestion + 1, quizQuestions.length)} of {quizQuestions.length}</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-900">{quizQuestions[activeQuestion]?.question}</h3>
                <div className="mt-6 space-y-4">
                  {quizQuestions[activeQuestion]?.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setQuizAnswers((prev) => ({ ...prev, [quizQuestions[activeQuestion].id]: option.value }))}
                      className={`w-full rounded-3xl border p-4 text-left text-sm font-medium transition ${
                        quizAnswers[quizQuestions[activeQuestion].id] === option.value
                          ? 'border-emerald-600 bg-emerald-50 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    disabled={activeQuestion === 0}
                    onClick={() => {
                      setShowQuizResult(false)
                      setActiveQuestion((current) => Math.max(0, current - 1))
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeQuestion < quizQuestions.length - 1) {
                        setActiveQuestion((current) => current + 1)
                      } else {
                        setShowQuizResult(true)
                      }
                    }}
                    disabled={!quizAnswers[quizQuestions[activeQuestion].id]}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {activeQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Recommendation'}
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {showQuizResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-600">Recommended for you</p>
                  <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-2xl font-semibold text-slate-900">{(() => {
                      const chosen = Object.values(quizAnswers).reduce<Record<string, number>>((acc, value) => {
                        acc[value] = (acc[value] || 0) + 1
                        return acc
                      }, {})
                      const highest = Object.entries(chosen).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'business'
                      return quizRecommendations[highest]?.title || quizRecommendations.business.title
                    })()}</h3>
                    <p className="mt-4 text-slate-600">
                      {(() => {
                        const chosen = Object.values(quizAnswers).reduce<Record<string, number>>((acc, value) => {
                          acc[value] = (acc[value] || 0) + 1
                          return acc
                        }, {})
                        const highest = Object.entries(chosen).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'business'
                        return quizRecommendations[highest]?.description || quizRecommendations.business.description
                      })()}
                    </p>
                    <div className="mt-6 rounded-3xl bg-emerald-600 p-5 text-white">
                      <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">Best match</p>
                      <p className="mt-2 text-xl font-semibold">{(() => {
                        const chosen = Object.values(quizAnswers).reduce<Record<string, number>>((acc, value) => {
                          acc[value] = (acc[value] || 0) + 1
                          return acc
                        }, {})
                        const highest = Object.entries(chosen).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'business'
                        return quizRecommendations[highest]?.course || quizRecommendations.business.course
                      })()}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveQuestion(0)
                      setQuizAnswers({})
                      setShowQuizResult(false)
                    }}
                    className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Retake Quiz
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-6 text-slate-700">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Insight</p>
                  <h3 className="text-2xl font-semibold text-slate-900">Personalized course guidance</h3>
                  <p className="text-sm leading-6 text-slate-600">
                    Use this quick quiz to discover the course path that best matches your interests, learning style, and career goals.
                  </p>
                  <div className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-900">Why this matters</p>
                    <ul className="space-y-3 text-sm leading-6 text-slate-600">
                      <li>• Align your next course with your goals.</li>
                      <li>• Match your preferred learning style.</li>
                      <li>• Get a recommendation instantly.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CertificationPathway />

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-3"
          >
            {[
              { label: 'Success Rate', value: '98%', description: 'Job placement within 6 months' },
              { label: 'Certified Programs', value: '24+', description: 'NSQ & NBTE pathways' },
              { label: 'Alumni Network', value: '15K+', description: 'Active across Nigeria' },
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants} className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-700">{stat.label}</p>
                <p className="mt-3 text-5xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-2 text-slate-700">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="space-y-4 text-center">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Courses built for employment, entrepreneurship and practical mastery.</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-700">
                Browse our flagship trade categories that combine digital skill and hands-on practice.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {programCategories.map((program) => (
                <motion.div key={program.title} variants={itemVariants}>
                  <Card className="h-full rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                    <CardContent className="space-y-5 p-6">
                      <div className="text-4xl">{program.emoji}</div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-slate-900">{program.title}</h3>
                        <p className="text-sm leading-6 text-slate-700">{program.description}</p>
                      </div>
                      <Badge variant="secondary">{program.badge}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="space-y-4 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Platform intelligence</p>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Research-aligned learning and operations.</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-700">
                We build a modern learning portal inspired by the latest training management experiences in blended, hybrid, and cohort-based learning.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="grid gap-6 md:grid-cols-3">
              {platformHighlights.map((item) => (
                <motion.div key={item.title} variants={itemVariants}>
                  <Card className="h-full rounded-3xl border border-slate-200 bg-slate-950/5 shadow-sm transition hover:shadow-md">
                    <CardContent className="space-y-4 p-6">
                      <div className="inline-flex rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Insight
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
                        <p className="text-sm leading-6 text-slate-700">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-10"
          >
            <motion.div variants={itemVariants} className="space-y-4 text-center mx-auto max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
                Recent Programs
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Discover the latest programs in motion.
              </h2>
              <p className="text-base leading-7 text-slate-300 sm:text-lg">
                A living gallery of recent program launches, designed with smooth flow and responsive polish for every screen.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <div className="grid gap-4 lg:hidden">
                {recentPrograms.map((program) => (
                  <div key={program.id} className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900 shadow-xl shadow-slate-950/30">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={program.image_url}
                        alt={program.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-2 p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">{program.category}</p>
                      <h3 className="text-xl font-semibold text-white">{program.title}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden lg:space-y-6">
                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-slate-950/30">
                  <div className="relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950 to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-950 to-transparent" />
                    <div className="flex items-stretch gap-6 py-2" style={{ animation: 'marquee 30s linear infinite' }}>
                      {[...recentPrograms, ...recentPrograms].map((program, index) => (
                        <div key={`${program.id}-top-${index}`} className="min-w-[280px] flex-shrink-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900 shadow-xl shadow-slate-950/30">
                          <div className="relative h-64 overflow-hidden">
                            <Image
                              src={program.image_url}
                              alt={program.title}
                              fill
                              className="object-cover transition duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                          </div>
                          <div className="p-5">
                            <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">{program.category}</p>
                            <h3 className="mt-3 text-lg font-semibold text-white">{program.title}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-slate-950/30">
                  <div className="relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950 to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-950 to-transparent" />
                    <div className="flex items-stretch gap-6 py-2" style={{ animation: 'marqueeReverse 32s linear infinite' }}>
                      {[...recentPrograms.slice().reverse(), ...recentPrograms.slice().reverse()].map((program, index) => (
                        <div key={`${program.id}-bottom-${index}`} className="min-w-[280px] flex-shrink-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900 shadow-xl shadow-slate-950/30">
                          <div className="relative h-64 overflow-hidden">
                            <Image
                              src={program.image_url}
                              alt={program.title}
                              fill
                              className="object-cover transition duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                          </div>
                          <div className="p-5">
                            <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">{program.category}</p>
                            <h3 className="mt-3 text-lg font-semibold text-white">{program.title}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="space-y-4 text-center">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Featured Programs</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-700">
                Industry-standard courses designed for immediate job placement.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
              {featuredCourses.map((course) => (
                <motion.div key={course.id} variants={itemVariants}>
                  <CourseCard {...course} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center">
              <Button size="lg" variant="default" className="gap-2 px-8 py-6 text-lg font-semibold rounded-full" asChild>
                <Link href="/courses">
                  View All Courses
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-12 lg:grid-cols-2 lg:items-center"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Why Choose Brainstorm Skills?
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                We combine expert instruction, practical experience, and career support to deliver real results for ambitious professionals.
              </p>

              <ul className="space-y-4">
                {[
                  'Industry experts and certified instructors',
                  'Hands-on practical training and real projects',
                  'Job placement assistance and networking',
                  'Flexible, blended learning options',
                  'NSQ & NBTE certified credentials',
                  'Lifetime alumni community support',
                ].map((item, idx) => (
                  <motion.li key={idx} variants={itemVariants} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#1a6b53] flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="rounded-2xl border-slate-200 shadow-lg">
                <CardContent className="p-8 space-y-6 bg-gradient-to-br from-[#1a6b53]/5 to-slate-100">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wider text-[#1a6b53]">Success Metrics</p>
                    <h3 className="text-3xl font-bold text-slate-900">Career Transformation Guaranteed</h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Employment Rate', value: '98%', detail: 'Within 6 months of completion' },
                      { label: 'Average Salary Growth', value: '+45%', detail: 'Compared to pre-training income' },
                      { label: 'Employer Satisfaction', value: '96%', detail: 'Rate our graduates highly' },
                    ].map((metric, idx) => (
                      <div key={idx} className="border-t pt-4">
                        <p className="text-xs uppercase tracking-wider text-slate-700">{metric.label}</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
                        <p className="mt-1 text-sm text-slate-700">{metric.detail}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="space-y-4 text-center">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Real stories from skills graduates.</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-700">
                Students who trained with us and launched income-generating careers.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full rounded-xl border-slate-200 shadow-sm hover:shadow-md transition">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-700 italic">"{testimonial.text}"</p>
                      <div className="flex items-center gap-3 pt-4 border-t">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{testimonial.name}</p>
                          <p className="text-sm text-slate-700">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-[#1a6b53] to-[#1a6b53]/80 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold sm:text-5xl">Ready to change your career?</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join Brainstorm Academy and start a practical skills program this term.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="default" className="px-8 py-6 text-lg font-semibold rounded-full" asChild>
                <Link href="/signup">Start Enrollment</Link>
              </Button>
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg font-semibold rounded-full">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
