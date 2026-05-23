'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Star, Clock3 } from 'lucide-react'

export interface InstructorInfo {
  name: string
  avatarUrl?: string
  title?: string
}

export interface CourseCardProps {
  id: string
  title: string
  category: string
  thumbnail: string
  instructor: InstructorInfo
  rating: number
  ratingCount: number
  price: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  progress?: number
  enrolled?: boolean
  href: string
}

export function CourseCard({
  id,
  title,
  category,
  thumbnail,
  instructor,
  rating,
  ratingCount,
  price,
  duration,
  level,
  progress,
  enrolled = false,
  href,
}: CourseCardProps) {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1)
  const progressValue = progress ?? 0

  return (
    <motion.article
        layout
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        aria-labelledby={`course-card-title-${id}`}
      >
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A6C3F]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950">
        <div className="relative h-52 overflow-hidden bg-slate-100">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute left-4 top-4 rounded-full bg-[#0A6C3F]/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-slate-950/20">
            {category}
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {level}
          </span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{price}</span>
        </div>

        <div className="space-y-3">
          <h3 id={`course-card-title-${id}`} className="text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors group-hover:text-[#0A6C3F]">
            {title}
          </h3>
          <div className="flex items-center gap-3">
            <Avatar imageSrc={instructor.avatarUrl} name={instructor.name} size="sm" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{instructor.name}</p>
              {instructor.title ? <p className="text-xs text-slate-500 dark:text-slate-400">{instructor.title}</p> : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1">
            {stars.map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
              />
            ))}
          </div>
          <span>{rating.toFixed(1)} ({ratingCount})</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-900">
            <Clock3 className="h-3.5 w-3.5" />
            {duration}
          </span>
          <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            {enrolled ? 'Enrolled' : 'Open'}
          </Badge>
        </div>

        {progress !== undefined ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
              <span>Progress</span>
              <span>{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-3 rounded-full" />
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href={href} className="w-full sm:w-auto">
            <Button variant={enrolled ? 'secondary' : 'brand'} size="lg" className="w-full">
              {enrolled ? 'Continue' : 'View course'}
            </Button>
          </Link>
          <span className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Course</span>
        </div>
      </div>
    </motion.article>
  )
}
