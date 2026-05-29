'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HeroSection } from '@/components/sections/HeroSection'
import { CourseCard } from '@/components/cards/CourseCard'
import { Star, ArrowRight, CheckCircle } from 'lucide-react'

const featuredCourses = [
  {
    id: '1',
    title: 'Nursing Sciences Level 1',
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
    role: 'Business Center Manager',
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
    title: 'Beauty & Wellness',
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
    title: 'ICT & Networking',
    description: 'Computer networking, hardware, and software support',
    badge: 'Online & hybrid',
    emoji: '💻',
  },
  {
    title: 'Fashion Design',
    description: 'Design, tailoring, and style business coaching',
    badge: 'In-person studio',
    emoji: '👗',
  },
  {
    title: 'Painting & Interior Design',
    description: 'Creative decor, finishing and space styling',
    badge: 'Hands-on practical',
    emoji: '🎨',
  },
  {
    title: 'Catering & Hospitality',
    description: 'Hospitality service, catering and event skills',
    badge: 'Blended programs',
    emoji: '🍽️',
  },
]

const recentPrograms = [
  {
    id: '1',
    title: 'Woodwork & Craftsmanship',
    category: 'Creative Trade',
    image: '/images/gallery/painting-1.jpg',
  },
  {
    id: '2',
    title: 'Digital Media Production',
    category: 'Creative Tech',
    image: '/images/gallery/hospitality-1.jpg',
  },
  {
    id: '3',
    title: 'Hospitality & Event Styling',
    category: 'Service Skills',
    image: '/images/gallery/hospitality-4.jpg',
  },
  {
    id: '4',
    title: 'Electrical & Solar Installation',
    category: 'Energy Trade',
    image: '/images/gallery/painting-5.jpg',
  },
  {
    id: '5',
    title: 'Fashion Design Labs',
    category: 'Creative Enterprise',
    image: '/images/gallery/painting-3.jpg',
  },
  {
    id: '6',
    title: 'ICT & Network Cabling',
    category: 'Digital Skills',
    image: '/images/gallery/hospitality-6.jpg',
  },
]

export function Homepage() {
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
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-600">{stat.label}</p>
                <p className="mt-3 text-5xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-2 text-slate-600">{stat.description}</p>
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
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
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
                        <p className="text-sm leading-6 text-slate-600">{program.description}</p>
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
                        src={program.image}
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
                              src={program.image}
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
                              src={program.image}
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
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
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
              <p className="text-lg text-slate-600 leading-relaxed">
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
                    <CheckCircle className="h-5 w-5 text-[#0A6C3F] flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="rounded-2xl border-slate-200 shadow-lg">
                <CardContent className="p-8 space-y-6 bg-gradient-to-br from-[#0A6C3F]/5 to-slate-100">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wider text-[#0A6C3F]">Success Metrics</p>
                    <h3 className="text-3xl font-bold text-slate-900">Career Transformation Guaranteed</h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Employment Rate', value: '98%', detail: 'Within 6 months of completion' },
                      { label: 'Average Salary Growth', value: '+45%', detail: 'Compared to pre-training income' },
                      { label: 'Employer Satisfaction', value: '96%', detail: 'Rate our graduates highly' },
                    ].map((metric, idx) => (
                      <div key={idx} className="border-t pt-4">
                        <p className="text-xs uppercase tracking-wider text-slate-600">{metric.label}</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
                        <p className="mt-1 text-sm text-slate-600">{metric.detail}</p>
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
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
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
                        <img src={testimonial.avatar} alt={testimonial.name} className="h-12 w-12 rounded-full" />
                        <div>
                          <p className="font-semibold text-slate-900">{testimonial.name}</p>
                          <p className="text-sm text-slate-600">{testimonial.role}</p>
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

      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-[#0A6C3F] to-[#0A6C3F]/80 text-white">
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
