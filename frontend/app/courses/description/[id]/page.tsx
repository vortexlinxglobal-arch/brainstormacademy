import { notFound } from 'next/navigation'
import { CourseDetailPage } from '@/components/sections/CourseDetailPage'
import { courseDetails } from '@/lib/courses'

export default async function CourseDescriptionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = courseDetails[id]

  if (!course) {
    return notFound()
  }

  return <CourseDetailPage {...course} />
}
