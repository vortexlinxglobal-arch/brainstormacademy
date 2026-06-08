'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PortalSectionShell } from '@/components/portal/PortalSectionShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { apiClient } from '@/src/api'
import {
  BookOpen,
  Clock,
  Users,
  CheckCircle,
  Play,
  FileText,
  Video,
  Download,
  Loader,
  ArrowLeft,
} from 'lucide-react'

interface Lesson {
  id: number
  title: string
  type: 'video' | 'document' | 'quiz'
  duration?: string
  completed: boolean
}

interface CourseDetail {
  id: number
  title: string
  description: string
  instructor?: string
  duration_months?: number
  enrolled_students?: number
  progress?: number
  lessons?: Lesson[]
}

export default function StudentCourseDetailPage() {
  const params = useParams()
  const courseId = params?.id as string
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCourse() {
      setLoading(true)
      try {
        if (courseId) {
          const result = await apiClient.getStudentCourses()
          if (result?.courses) {
            const found = result.courses.find((c: any) => c.id === parseInt(courseId))
            if (found) {
              setCourse({
                ...found,
                lessons: [
                  { id: 1, title: 'Course Introduction', type: 'video', duration: '15 min', completed: true },
                  { id: 2, title: 'Module 1: Basics', type: 'video', duration: '45 min', completed: true },
                  { id: 3, title: 'Module 1 Materials', type: 'document', completed: true },
                  { id: 4, title: 'Module 2: Advanced Topics', type: 'video', duration: '60 min', completed: false },
                  { id: 5, title: 'Module 2 Assignment', type: 'document', completed: false },
                  { id: 6, title: 'Module 2 Quiz', type: 'quiz', completed: false },
                ],
              })
            }
          }
        }
      } catch (err) {
        console.error('Failed to load course:', err)
        setError('Unable to load course details')
        // Placeholder data
        setCourse({
          id: parseInt(courseId || '1'),
          title: 'Advanced Nursing Science',
          description:
            'Comprehensive nursing education covering patient care, anatomy, medical procedures, and healthcare best practices.',
          instructor: 'Dr. Maria Johnson',
          duration_months: 6,
          enrolled_students: 24,
          progress: 75,
          lessons: [
            { id: 1, title: 'Course Introduction', type: 'video', duration: '15 min', completed: true },
            { id: 2, title: 'Module 1: Basics', type: 'video', duration: '45 min', completed: true },
            { id: 3, title: 'Module 1 Materials', type: 'document', completed: true },
            { id: 4, title: 'Module 2: Advanced Topics', type: 'video', duration: '60 min', completed: false },
            { id: 5, title: 'Module 2 Assignment', type: 'document', completed: false },
            { id: 6, title: 'Module 2 Quiz', type: 'quiz', completed: false },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <PortalSectionShell title="Course Not Found" description="" allowedRoles={['Student']}>
        <div className="text-center">
          <p className="text-slate-600 mb-4">This course could not be found</p>
          <Link href="/portal/student/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </PortalSectionShell>
    )
  }

  const completedLessons = course.lessons?.filter((l) => l.completed).length || 0
  const totalLessons = course.lessons?.length || 0

  return (
    <PortalSectionShell
      title={course.title}
      description="Course learning materials and progress"
      allowedRoles={['Student']}
    >
      <div className="grid gap-6">
        <Link href="/portal/student/courses">
          <Button variant="outline" className="w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>

        {/* Course Header */}
        <Card>
          <CardContent className="pt-8">
            <div className="grid gap-6 lg:grid-cols-3 mb-8">
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">{course.title}</h1>
                <p className="text-slate-600 mb-6">{course.description}</p>
                <div className="flex gap-6 text-sm text-slate-600">
                  {course.instructor && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Instructor: {course.instructor}
                    </div>
                  )}
                  {course.duration_months && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {course.duration_months} months
                    </div>
                  )}
                  {course.enrolled_students && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {course.enrolled_students} students
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="text-sm text-emerald-700 font-medium">Your Progress</p>
                <p className="mt-3 text-4xl font-bold text-emerald-600">{course.progress || 0}%</p>
                <div className="mt-4 w-full bg-emerald-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${course.progress || 0}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-emerald-600">
                  {completedLessons}/{totalLessons} lessons completed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {course.lessons?.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 transition"
                >
                  <div className="flex-1 flex items-center gap-3">
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                    )}

                    <div>
                      <p className="font-medium text-slate-900">{lesson.title}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                        {lesson.type === 'video' && (
                          <>
                            <Video className="h-3 w-3" />
                            Video
                          </>
                        )}
                        {lesson.type === 'document' && (
                          <>
                            <FileText className="h-3 w-3" />
                            Document
                          </>
                        )}
                        {lesson.type === 'quiz' && (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Quiz
                          </>
                        )}
                        {lesson.duration && <span>• {lesson.duration}</span>}
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    {lesson.completed ? (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Review
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Course Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Course Materials (PDF)
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Lecture Notes
              </Button>
              <Button variant="outline" className="justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Reference Books
              </Button>
              <Button variant="outline" className="justify-start">
                <Video className="h-4 w-4 mr-2" />
                Supplementary Videos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalSectionShell>
  )
}
