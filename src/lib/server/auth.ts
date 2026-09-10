import { cookies } from 'next/headers';
import { db } from './store';
import { hashToken } from './security';

export const SESSION_COOKIE = 'antwu-session';
export type AdminUser = { id: string; email: string };
export async function requireAdmin(): Promise<AdminUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  return (db().prepare('SELECT users.id, users.email FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires > ?').get(hashToken(token), Date.now()) as AdminUser | undefined) || null;
}
