'use client'

import { useEffect, useState } from 'react'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { apiClient } from '@/src/api'
import { BookOpen, Clock, Users, Star, Loader } from 'lucide-react'

interface Course {
  id: number
  code: string
  title: string
  description: string
  duration_months?: number
  tuition_fee?: number
}

export default function BrowseCoursesPage() {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    async function loadCourses() {
      setLoading(true)
      try {
        const result = await apiClient.getTrades()
        if (result?.trades) {
          setCourses(result.trades)
        }
      } catch (err) {
        console.error('Failed to load courses:', err)
        // Placeholder data
        setCourses([
          {
            id: 1,
            code: 'NURS-101',
            title: 'Advanced Nursing Science',
            description: 'Comprehensive nursing education covering patient care, anatomy, and medical procedures',
            duration_months: 6,
            tuition_fee: 2500,
          },
          {
            id: 2,
            code: 'IT-201',
            title: 'IT Fundamentals',
            description: 'Master computer systems, networking, and IT support basics',
            duration_months: 3,
            tuition_fee: 1500,
          },
          {
            id: 3,
            code: 'BUS-150',
            title: 'Business Management',
            description: 'Learn modern business practices, leadership, and organizational management',
            duration_months: 4,
            tuition_fee: 2000,
          },
          {
            id: 4,
            code: 'ELECT-101',
            title: 'Electrical Installation',
            description: 'Practical training in electrical systems and safety compliance',
            duration_months: 5,
            tuition_fee: 1800,
          },
          {
            id: 5,
            code: 'WELD-101',
            title: 'Welding & Fabrication',
            description: 'Master welding techniques and metal fabrication skills',
            duration_months: 4,
            tuition_fee: 1600,
          },
          {
            id: 6,
            code: 'HOSPIT-101',
            title: 'Hospitality Services',
            description: 'Training for hotel operations, catering, and customer service',
            duration_months: 3,
            tuition_fee: 1200,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading course catalog...</p>
        </div>
      </div>
    )
  }

  return (
    <PortalSectionShell
      title="Browse Courses"
      description="Explore our comprehensive training programs and skill development courses"
      allowedRoles={['Student']}
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-3xl border border-slate-200 p-8 hover:border-emerald-500 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{course.code}</p>
                      <h3 className="mt-2 font-bold text-lg text-slate-900">{course.title}</h3>
                    </div>
                    <BookOpen className="h-6 w-6 text-slate-400 flex-shrink-0" />
                  </div>

                  <p className="text-sm text-slate-600 mb-4">{course.description}</p>

                  <div className="flex gap-4 text-sm text-slate-600 mb-6">
                    {course.duration_months && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration_months} months
                      </div>
                    )}
                    {course.tuition_fee && (
                      <div className="font-semibold text-slate-900">
                        ₦{course.tuition_fee.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/courses/${course.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                    <Button className="flex-1">Enroll Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
