import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  const portalOnlyRoutes = ['/admin', '/instructor', '/student']
  const isPortalOnlyRoute = portalOnlyRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  // If accessing portal subdomain, preserve root pages and only rewrite portal-specific paths.
  if (hostname.startsWith('portal.') || hostname === 'portal.brainstormacademy.ng') {
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/portal', request.url))
    }

    if (isPortalOnlyRoute) {
      return NextResponse.rewrite(new URL(`/portal${pathname}`, request.url))
    }
  }

  // If accessing main domain (not portal), redirect /portal to the portal subdomain
  if (hostname === 'brainstormacademy.ng' || hostname === 'www.brainstormacademy.ng') {
    if (pathname.startsWith('/portal')) {
      const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.brainstormacademy.ng'
      const portalUrlObj = new URL(portalUrl)
      const portalOrigin = `${portalUrlObj.protocol}//${portalUrlObj.host}`
      const portalBasePath = portalUrlObj.pathname.replace(/\/$/, '')
      const suffix = pathname === '/portal' ? '' : pathname.replace(/^\/portal/, '')
      return NextResponse.redirect(`${portalOrigin}${portalBasePath}${suffix}`)
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
