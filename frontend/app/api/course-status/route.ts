export type CourseStatusRecord = {
  enrolled: string[]
  bookmarked: string[]
}

const COOKIE_NAME = 'course_status'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

function parseStatusCookie(cookieHeader: string | null): CourseStatusRecord {
  if (!cookieHeader) {
    return { enrolled: [], bookmarked: [] }
  }

  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`))
  if (!match) {
    return { enrolled: [], bookmarked: [] }
  }

  try {
    const value = decodeURIComponent(match[1])
    const parsed = JSON.parse(value)
    return {
      enrolled: Array.isArray(parsed.enrolled) ? parsed.enrolled : [],
      bookmarked: Array.isArray(parsed.bookmarked) ? parsed.bookmarked : [],
    }
  } catch {
    return { enrolled: [], bookmarked: [] }
  }
}

function serializeStatusCookie(status: CourseStatusRecord) {
  const value = encodeURIComponent(JSON.stringify(status))
  return `${COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; HttpOnly`
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const courseId = url.searchParams.get('courseId')
  const status = parseStatusCookie(request.headers.get('cookie'))

  const payload = {
    enrolled: status.enrolled,
    bookmarked: status.bookmarked,
    courseId,
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const courseId = body?.courseId
  const action = body?.action

  if (!courseId || typeof courseId !== 'string' || !['toggle-enroll', 'toggle-bookmark'].includes(action)) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    })
  }

  const status = parseStatusCookie(request.headers.get('cookie'))
  const nextStatus: CourseStatusRecord = {
    enrolled: [...status.enrolled],
    bookmarked: [...status.bookmarked],
  }

  if (action === 'toggle-enroll') {
    const index = nextStatus.enrolled.indexOf(courseId)
    if (index >= 0) {
      nextStatus.enrolled.splice(index, 1)
    } else {
      nextStatus.enrolled.push(courseId)
    }
  }

  if (action === 'toggle-bookmark') {
    const index = nextStatus.bookmarked.indexOf(courseId)
    if (index >= 0) {
      nextStatus.bookmarked.splice(index, 1)
    } else {
      nextStatus.bookmarked.push(courseId)
    }
  }

  const response = new Response(JSON.stringify(nextStatus), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Set-Cookie': serializeStatusCookie(nextStatus),
    },
  })

  return response
}
