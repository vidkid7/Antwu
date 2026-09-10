import { randomUUID } from 'node:crypto';
import { db } from './store';
import { HttpError, readBody } from './security';

export type PreparedMedia = { id: string; name: string; type: string; data: Buffer; private: boolean; field: string };
export async function readMultipart(request: Request, max = 28 * 1024 * 1024) {
  const type = request.headers.get('content-type') || '';
  if (!type.startsWith('multipart/form-data;')) throw new HttpError('Please submit the form with its attachments.');
  const body = await readBody(request, max);
  try { return await new Response(body as BodyInit, { headers: { 'Content-Type': type } }).formData(); }
  catch { throw new HttpError('The uploaded form could not be read.'); }
}
export async function prepareMedia(file: File, isPrivate: boolean, field = 'file', allowVideo = false): Promise<PreparedMedia> {
  const max = allowVideo && file.type.startsWith('video/') ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
  if (!file.size || file.size > max) throw new HttpError(`Files must be under ${max / 1024 / 1024} MB.`, 413);
  const data = Buffer.from(await file.arrayBuffer());
  const signature = data.subarray(0, 12);
  let type = '';
  if (signature.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) type = 'image/jpeg';
  else if (signature.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) type = 'image/png';
  else if (signature.toString('ascii', 0, 4) === 'RIFF' && signature.toString('ascii', 8, 12) === 'WEBP') type = 'image/webp';
  else if (signature.toString('ascii', 0, 5) === '%PDF-') type = 'application/pdf';
  else if (allowVideo && signature.toString('ascii', 4, 8) === 'ftyp') type = 'video/mp4';
  else if (allowVideo && signature.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) type = 'video/webm';
  if (!type || file.type !== type) throw new HttpError('Upload a valid JPEG, PNG, WebP or PDF file' + (allowVideo ? ', or an MP4/WebM video.' : '.'));
  if ((field === 'photo') && !type.startsWith('image/')) throw new HttpError('Profile photo must be an image.');
  return { id: randomUUID(), name: file.name.replace(/[^\p{L}\p{N} ._-]/gu, '_').slice(-150), type, data, private: isPrivate, field };
}
export function saveMedia(file: PreparedMedia) {
  db().prepare('INSERT INTO media VALUES (?, ?, ?, ?, ?, ?)').run(file.id, file.name, file.type, file.data, file.private ? 1 : 0, new Date().toISOString());
  return { url: `/media/${file.id}`, name: file.name, type: file.type, size: file.data.length, field: file.field };
}
