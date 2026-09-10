import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/server/auth';
import { db } from '@/lib/server/store';
import { errorResponse, hashToken, sameOrigin } from '@/lib/server/security';
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (token) db().prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
    return response;
  } catch (error) { return errorResponse(error); }
}
