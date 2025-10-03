// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const ref = url.searchParams.get('ref');
  const cid = url.searchParams.get('cid');
  const id = url.searchParams.get('id');

  if (ref === 'qanomed') {
    return new Response('Gone', { status: 410 });
  }

  if (cid === '4' && id === '177') {
    return new Response('Gone', { status: 410 });
  }

  return NextResponse.next();
}

// matcher limits middleware execution; use '/' if these only appear on homepage
export const config = { matcher: ['/'] };
