import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const WEB_ORIGIN = process.env.WEB_ORIGIN ?? 'http://localhost:3000';

function corsHeaders(origin: string): Record<string, string> {
  const allowed =
    origin === WEB_ORIGIN ||
    origin === 'http://localhost:3000' ||
    /^https:\/\/[\w-]+\.vercel\.app$/.test(origin);

  return {
    'Access-Control-Allow-Origin': allowed ? origin : WEB_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: { ...corsHeaders(origin), 'Access-Control-Max-Age': '86400' },
    });
  }

  const response = NextResponse.next();
  for (const [k, v] of Object.entries(corsHeaders(origin))) {
    response.headers.set(k, v);
  }
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
