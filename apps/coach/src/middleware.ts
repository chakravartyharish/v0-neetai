import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { securityManager, createRateLimitMiddleware } from '@/lib/security';

// Rate limiting configurations
const rateLimiters = {
  api: createRateLimitMiddleware(15 * 60 * 1000, 100), // 100 requests per 15 minutes
  auth: createRateLimitMiddleware(15 * 60 * 1000, 5),  // 5 auth attempts per 15 minutes
  upload: createRateLimitMiddleware(60 * 60 * 1000, 10), // 10 uploads per hour
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Apply security headers
  const securityHeaders = securityManager.getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.headers.set(key, value);
  });

  // Get client IP for rate limiting
  const clientIP = getClientIP(req);
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  // Apply rate limiting based on route
  const { pathname } = req.nextUrl;
  
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = rateLimiters.api(clientIP);
    if (!rateLimitResult.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          resetTime: rateLimitResult.resetTime,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }
  }

  // Special rate limiting for auth endpoints
  if (pathname.startsWith('/api/auth/') || pathname === '/login') {
    const rateLimitResult = rateLimiters.auth(clientIP);
    if (!rateLimitResult.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many authentication attempts. Please try again later.',
          resetTime: rateLimitResult.resetTime,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  }

  // Rate limiting for file uploads
  if (pathname.startsWith('/api/upload')) {
    const rateLimitResult = rateLimiters.upload(clientIP);
    if (!rateLimitResult.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Upload rate limit exceeded',
          resetTime: rateLimitResult.resetTime,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  // Authentication check for protected routes
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/onboard') ||
      pathname.startsWith('/api/protected')) {
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth error:', error);
        return redirectToLogin(req);
      }

      if (!session) {
        return redirectToLogin(req);
      }

      // Add user context to request headers for downstream use
      res.headers.set('x-user-id', session.user.id);
      res.headers.set('x-user-email', session.user.email || '');
      
      // Role-based access control for specific routes
      const userRole = session.user.user_metadata?.role || 'student';
      
      // Admin-only routes
      if (pathname.startsWith('/dashboard/billing') || 
          pathname.startsWith('/dashboard/settings')) {
        if (!['institute_owner', 'admin_staff'].includes(userRole)) {
          return new NextResponse(null, { 
            status: 403,
            statusText: 'Forbidden: Insufficient permissions'
          });
        }
      }

      // Teacher and admin routes
      if (pathname.startsWith('/dashboard/teachers') ||
          pathname.startsWith('/dashboard/analytics')) {
        if (!['institute_owner', 'admin_staff', 'teacher'].includes(userRole)) {
          return new NextResponse(null, { 
            status: 403,
            statusText: 'Forbidden: Insufficient permissions'
          });
        }
      }

    } catch (error) {
      console.error('Middleware auth error:', error);
      return redirectToLogin(req);
    }
  }

  // Block suspicious requests
  if (isSuspiciousRequest(req)) {
    // Log security incident
    console.warn('Suspicious request blocked:', {
      ip: clientIP,
      userAgent,
      url: req.url,
      timestamp: new Date().toISOString(),
    });

    return new NextResponse(null, { 
      status: 403,
      statusText: 'Forbidden'
    });
  }

  // Add security-related headers
  res.headers.set('X-Request-ID', generateRequestId());
  res.headers.set('X-Client-IP', clientIP);

  return res;
}

function getClientIP(req: NextRequest): string {
  // Try to get real IP from various headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfIP = req.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfIP) {
    return cfIP;
  }
  
  return req.ip || 'unknown';
}

function redirectToLogin(req: NextRequest): NextResponse {
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

function isSuspiciousRequest(req: NextRequest): boolean {
  const userAgent = req.headers.get('user-agent') || '';
  const { pathname, search } = req.nextUrl;
  
  // Block known malicious user agents
  const suspiciousUserAgents = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scanner/i,
    /hack/i,
  ];
  
  if (suspiciousUserAgents.some(pattern => pattern.test(userAgent))) {
    return true;
  }
  
  // Block common attack patterns in URL
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /\/admin/i,  // Admin panel attempts
    /\/wp-admin/i,  // WordPress admin attempts
    /\/config/i,  // Config file attempts
    /\/\.env/i,  // Environment file attempts
    /script>/i,  // XSS attempts
    /union.*select/i,  // SQL injection attempts
    /exec\(/i,  // Code execution attempts
  ];
  
  const fullUrl = pathname + search;
  if (suspiciousPatterns.some(pattern => pattern.test(fullUrl))) {
    return true;
  }
  
  return false;
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};