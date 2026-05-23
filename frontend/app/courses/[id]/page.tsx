import { redirect } from 'next/navigation'

export default async function CourseIdRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/courses/description/${id}`)
}
