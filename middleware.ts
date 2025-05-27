import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the user is authenticated
  const token = request.cookies.get('auth_token')?.value
  
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname
  
  // If the user is not authenticated and trying to access protected routes
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/auth/:path*'],
}
