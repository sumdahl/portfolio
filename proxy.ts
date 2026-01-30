import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export default async function proxy(request: NextRequest) {
  const { response, supabase } = await updateSession(request);

  // Get current user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect dashboard routes - require authentication
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user has admin role (stored in user metadata)
    const isAdmin = user.user_metadata?.role === 'admin' || user.email === process.env.ADMIN_EMAIL;
    
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
