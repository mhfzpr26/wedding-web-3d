import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for admin paths
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('admin_session')
    const isLoggedIn = Boolean(sessionCookie?.value)

    // Allow login page access
    if (pathname === '/admin/login') {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      return NextResponse.next()
    }

    // Protect all other admin routes
    if (!isLoggedIn) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Redirect root /admin to /admin/dashboard
    if (pathname === '/admin' || pathname === '/admin/') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
