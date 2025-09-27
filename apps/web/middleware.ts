import { NextRequest, NextResponse } from 'next/server';

// Simple rate limiting based on IP address
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = {
  auth: 5,   // 5 auth requests per 15 minutes
  api: 100,  // 100 API requests per 15 minutes
};

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const remote = request.ip;
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (real) {
    return real;
  }
  return remote || 'unknown';
}

function isRateLimited(ip: string, maxRequests: number): boolean {
  const now = Date.now();
  const userRate = rateLimitMap.get(ip);

  if (!userRate || now > userRate.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }

  if (userRate.count >= maxRequests) {
    return true;
  }

  userRate.count++;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);

  // Apply rate limiting to auth endpoints
  if (pathname.startsWith('/api/auth/')) {
    if (isRateLimited(clientIP, RATE_LIMIT_MAX_REQUESTS.auth)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded. Too many authentication attempts.',
          resetTime: rateLimitMap.get(clientIP)?.resetTime,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(RATE_LIMIT_WINDOW / 1000).toString(),
          },
        }
      );
    }
  }
  
  // Apply rate limiting to other API endpoints
  else if (pathname.startsWith('/api/')) {
    if (isRateLimited(clientIP, RATE_LIMIT_MAX_REQUESTS.api)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          resetTime: rateLimitMap.get(clientIP)?.resetTime,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'Retry-After': Math.ceil(RATE_LIMIT_WINDOW / 1000).toString(),
          },
        }
      );
    }
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};