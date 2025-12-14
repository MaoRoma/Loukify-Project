import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Skip middleware for:
  // - API routes
  // - Admin routes
  // - Auth routes
  // - Static files
  // - _next files
  // - Store routes (already handled)
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/auth') ||
    url.pathname.startsWith('/store') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/static') ||
    url.pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Skip for localhost
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return NextResponse.next();
  }

  // Extract subdomain from hostname
  // Format: subdomain.loukify.website or custom domain subdomains
  const parts = hostname.split('.');
  
  // Check if this is a subdomain request
  let subdomain: string | null = null;
  
  // Handle custom domains (e.g., subdomain.loukify.website)
  if (hostname.includes('.loukify.website')) {
    subdomain = parts[0];
    // Skip if it's the main domain (www or just loukify)
    if (subdomain === 'www' || subdomain === 'loukify' || subdomain === '') {
      return NextResponse.next();
    }
  }
  // Handle other custom domains (if you add more domains later)
  // You can add more domain checks here
  else if (!hostname.includes('.vercel.app') && !hostname.includes('localhost')) {
    // For custom domains, check if first part is a subdomain
    // Main domain would typically be just the domain name
    // Subdomain would be: subdomain.domain.com
    if (parts.length >= 3) {
      const firstPart = parts[0];
      // Skip common non-subdomain prefixes
      if (firstPart && firstPart !== 'www' && firstPart !== 'api' && firstPart !== 'admin') {
        // Check if it looks like a valid subdomain (alphanumeric with hyphens)
        if (/^[a-z0-9-]+$/.test(firstPart) && firstPart.length > 0) {
          subdomain = firstPart;
        }
      }
    }
  }
  // Note: Vercel's .vercel.app domains don't support true wildcard subdomains
  // For testing, use path-based routing: /store/[subdomain]
  // For production, use a custom domain with wildcard DNS

  if (subdomain) {
    // Rewrite to the store page with subdomain
    url.pathname = `/store/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
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
};

