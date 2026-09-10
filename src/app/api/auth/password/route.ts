import { cookies } from 'next/headers';
import { requireAdmin, SESSION_COOKIE } from '@/lib/server/auth';
import { consumeLimit, db } from '@/lib/server/store';
import { errorResponse, hashToken, HttpError, passwordHash, passwordValue, readJson, sameOrigin, verifyPassword } from '@/lib/server/security';
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const user = await requireAdmin(); if (!user) throw new HttpError('Please sign in.', 401);
    if (!consumeLimit(`password:${user.id}`, 10, 15 * 60_000)) throw new HttpError('Please try again in 15 minutes.', 429);
    const body = await readJson(request, 4000);
    const current = passwordValue(body.currentPassword, 'Current password');
    const next = passwordValue(body.newPassword, 'New password');
    if (next.length < 12) throw new HttpError('Use at least 12 characters for the new password.');
    const row = db().prepare('SELECT password_hash FROM users WHERE id = ?').get(user.id) as { password_hash: string };
    if (!verifyPassword(current, row.password_hash)) throw new HttpError('The current password is incorrect.', 400);
    db().prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash(next), user.id);
    const token = (await cookies()).get(SESSION_COOKIE)?.value || '';
    db().prepare('DELETE FROM sessions WHERE user_id = ? AND token_hash != ?').run(user.id, hashToken(token));
    return Response.json({ ok: true });
  } catch (error) { return errorResponse(error); }
}
