'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/src/api'
import { BookOpen, Clock, Users, Loader, Filter } from 'lucide-react'

interface Course {
  id: number
  title: string
  description: string
  duration_months?: number
  enrolled_students?: number
  instructor_id?: number
  progress?: number
}

export default function StudentCoursesPage() {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCourses() {
      setLoading(true)
      try {
        const result = await apiClient.getStudentCourses()
        if (result?.courses) {
          setCourses(result.courses)
        }
      } catch (err) {
        console.error('Failed to load courses:', err)
        setError('Unable to load courses')
        // Placeholder data
        setCourses([
          {
            id: 1,
            title: 'Advanced Nursing Science',
            description: 'Learn advanced nursing techniques and patient care',
            duration_months: 6,
            enrolled_students: 24,
            progress: 75,
          },
          {
            id: 2,
            title: 'IT Fundamentals',
            description: 'Master the basics of information technology',
            duration_months: 3,
            enrolled_students: 18,
            progress: 60,
          },
          {
            id: 3,
            title: 'Business Management',
            description: 'Essential skills for modern business leadership',
            duration_months: 4,
            enrolled_students: 12,
            progress: 45,
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
          <p className="text-slate-700">Loading your courses...</p>
        </div>
      </div>
    )
  }

  return (
    <PortalSectionShell
      title="My Courses"
      description="View and manage your enrolled courses"
      allowedRoles={['Student']}
    >
      <div className="grid gap-6">
        {error && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 flex gap-3">
            <p className="text-sm text-amber-800">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Courses ({courses.length})</CardTitle>
              <Link href="/portal/student/browse">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Browse More
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              {courses.map((course) => (
                <Link key={course.id} href={`/portal/student/courses/${course.id}`}>
                  <div className="rounded-3xl border border-slate-200 p-8 hover:border-emerald-500 hover:shadow-lg transition cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900">{course.title}</h3>
                        <p className="mt-2 text-sm text-slate-700">{course.description}</p>
                      </div>
                      <BookOpen className="h-6 w-6 text-emerald-600 flex-shrink-0 ml-4" />
                    </div>

                    <div className="flex gap-4 text-sm text-slate-700 mb-4">
                      {course.duration_months && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration_months} months
                        </div>
                      )}
                      {course.enrolled_students && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.enrolled_students} students
                        </div>
                      )}
                    </div>

                    {course.progress !== undefined && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-700">Progress</span>
                          <span className="text-xs font-bold text-emerald-600">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-700 mb-4">You haven't enrolled in any courses yet</p>
                <Link href="/portal/student/browse">
                  <Button>Browse Available Courses</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
