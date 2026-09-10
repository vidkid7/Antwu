import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';

export function passwordHash(password: string) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}
export function verifyPassword(password: string, encoded: string) {
  const [salt, hash] = encoded.split(':');
  if (!salt || !hash || !/^[a-f0-9]{128}$/.test(hash)) return false;
  const actual = scryptSync(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(hash, 'hex'));
}
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
export class HttpError extends Error { constructor(message: string, public status = 400) { super(message); } }

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const requestUrl = new URL(request.url);
  const servedOrigin = `${requestUrl.protocol}//${request.headers.get('host') || requestUrl.host}`;
  const allowed = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : servedOrigin;
  if (!origin || (origin !== servedOrigin && origin !== allowed)) throw new HttpError('This request is not from the website.', 403);
}

export async function readJson(request: Request, limit = 150_000): Promise<Record<string, unknown>> {
  const bytes = await readBody(request, limit);
  try {
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
    return parsed;
  } catch { throw new HttpError('Please send a valid JSON object.'); }
}

export async function readBody(request: Request, limit: number): Promise<Uint8Array> {
  if (Number(request.headers.get('content-length')) > limit) throw new HttpError('The upload is too large.', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError('The request is empty.');
  const chunks: Uint8Array[] = []; let length = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    length += value.length;
    if (length > limit) { await reader.cancel(); throw new HttpError('The upload is too large.', 413); }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export function errorResponse(error: unknown) {
  if (error instanceof HttpError) return Response.json({ error: error.message }, { status: error.status });
  console.error('ANTWU request failed:', error instanceof Error ? error.message : 'Unknown error');
  return Response.json({ error: 'The request could not be completed. Please try again.' }, { status: 500 });
}
export function requiredText(value: unknown, name: string, max = 500): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new HttpError(`${name} is required and must be under ${max} characters.`);
  return value.trim();
}
export function optionalText(value: unknown, max = 500): string {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string' || value.length > max) throw new HttpError(`Text must be under ${max} characters.`);
  return value.trim();
}
export function passwordValue(value: unknown, name = 'Password'): string {
  if (typeof value !== 'string' || !value.length || value.length > 200) throw new HttpError(`${name} is required and must be under 200 characters.`);
  return value;
}
export function validEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
export function clientKey(request: Request) { return /^(true|1)$/i.test(process.env.TRUST_PROXY || '') ? (request.headers.get('x-real-ip') || 'shared') : 'shared'; }
