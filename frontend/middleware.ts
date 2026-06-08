import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // If accessing portal subdomain
  if (hostname.startsWith('portal.') || hostname === 'portal.brainstormacademy.ng') {
    // Ensure all portal subdomain traffic goes to /portal
    if (!pathname.startsWith('/portal')) {
      return NextResponse.rewrite(new URL(`/portal${pathname}`, request.url))
    }
  }

  // If accessing main domain (not portal), redirect /portal to the portal subdomain
  if (hostname === 'brainstormacademy.ng' || hostname === 'www.brainstormacademy.ng') {
    if (pathname.startsWith('/portal')) {
      const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.brainstormacademy.ng'
      return NextResponse.redirect(`${portalUrl}${pathname}`)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
