import { courseCatalog } from '@/lib/courses'
import { getSupabaseAdmin, json } from '../auth/_lib'

export const dynamic = 'force-dynamic'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('course_catalog')
      .select('*')
      .eq('is_active', true)
      .order('title', { ascending: true })

    if (error) {
      console.warn('Course catalog lookup failed:', error)
      return json({ data: courseCatalog, source: 'fallback' })
    }

    const courses = (data ?? []).map((course: any) => {
      const id = slugify(course.code || course.title)
      const durationHours = Number(course.duration_hours || 0)
      const duration =
        durationHours > 0
          ? `${Math.max(1, Math.round(durationHours / 20))} months`
          : 'Contact for duration'

      return {
        id,
        title: course.title,
        category: course.category_name || course.trade_name || 'Skills Training',
        thumbnail: '/assets/course-thumbnails/web-design_result.webp',
        instructor: {
          name: course.instructor_name || 'Brainstorm Facilitator',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(course.code || course.title)}`,
          title: course.trade_name || 'Course Facilitator',
        },
        rating: 4.8,
        ratingCount: Math.max(12, Number(course.completed_enrollments || 0) + 24),
        price: course.course_fee ? `₦${Number(course.course_fee).toLocaleString()}` : 'Contact for pricing',
        duration,
        level: 'Beginner',
        href: `/courses/description/${id}`,
      }
    })

    return json({ data: courses.length ? courses : courseCatalog, source: courses.length ? 'database' : 'fallback' })
  } catch (error) {
    console.warn('Unable to load server course catalog:', error)
    return json({ data: courseCatalog, source: 'fallback' })
  }
}
