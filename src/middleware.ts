
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  if (session?.user.isBlocked) {
    // If user is blocked and not already on the blocked page, redirect them.
    if (request.nextUrl.pathname !== '/blocked') {
      return NextResponse.redirect(new URL('/blocked', request.url));
    }
  } else {
     // If user is not blocked and tries to access the blocked page, redirect them away.
     if (request.nextUrl.pathname === '/blocked') {
        return NextResponse.redirect(new URL('/feed', request.url));
     }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except for static assets, API routes, and auth routes.
    '/((?!api|_next/static|_next/image|favicon.ico|auth/.*|blocked).*)',
    '/blocked' // Also apply middleware to the blocked page itself
  ],
};
