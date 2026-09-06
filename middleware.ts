import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that do not require auth header
  if (
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/logout') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/api/payments/mpesa/callback') ||
    !pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // 1. Try Bearer token from Authorization header
  const authHeader = request.headers.get('authorization');
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // 2. Fallback to HttpOnly session cookie
    token = request.cookies.get('agroflow_session')?.value;
  }

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing or invalid authorization token or session' },
      { status: 401 }
    );
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Malformed token');
    }

    const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);

    // Check token expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return NextResponse.json({ error: 'Unauthorized: Session token expired' }, { status: 401 });
    }

    const response = NextResponse.next();
    response.headers.set('x-user-data', JSON.stringify(payload));
    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
