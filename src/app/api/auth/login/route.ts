import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { db, consumeLimit } from '@/lib/server/store';
import { SESSION_COOKIE } from '@/lib/server/auth';
import { clientKey, errorResponse, hashToken, HttpError, passwordValue, readJson, requiredText, sameOrigin, verifyPassword } from '@/lib/server/security';

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const body = await readJson(request, 4000);
    const email = requiredText(body.email, 'Email', 254).toLowerCase();
    const password = passwordValue(body.password);
    if (!consumeLimit(`login:${email}`, 10, 15 * 60_000) || !consumeLimit(`login-ip:${clientKey(request)}`, 100, 15 * 60_000)) throw new HttpError('Too many login attempts. Please try again in 15 minutes.', 429);
    const user = db().prepare('SELECT * FROM users WHERE email = ?').get(email) as { id: string; password_hash: string } | undefined;
    // The same password work runs when an account does not exist.
    const hash = user?.password_hash || `${'0'.repeat(32)}:${'0'.repeat(128)}`;
    if (!verifyPassword(password, hash) || !user) throw new HttpError('The email or password is incorrect.', 401);
    const token = randomBytes(32).toString('hex');
    db().prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now());
    db().prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(hashToken(token), user.id, Date.now() + 8 * 60 * 60_000);
    db().prepare('DELETE FROM rate_limits WHERE key = ?').run(`login:${email}`);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 8 * 60 * 60 });
    return response;
  } catch (error) { return errorResponse(error); }
}
