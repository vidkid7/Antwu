import { requireAdmin } from '@/lib/server/auth';
import { db } from '@/lib/server/store';
export const dynamic = 'force-dynamic';
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return new Response('Not found', { status: 404 });
  const file = db().prepare('SELECT * FROM media WHERE id = ?').get(id) as { name: string; type: string; data: Uint8Array; private: number } | undefined;
  if (!file || (file.private && !await requireAdmin())) return new Response('Not found', { status: 404 });
  const headers = new Headers({ 'Content-Type': file.type, 'Content-Length': String(file.data.length), 'X-Content-Type-Options': 'nosniff', 'Cache-Control': file.private ? 'private, no-store' : 'public, max-age=31536000, immutable', 'Content-Disposition': `${file.type === 'application/pdf' ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(file.name)}`, 'Accept-Ranges': 'bytes', 'Content-Security-Policy': "default-src 'none'; sandbox" });
  const range = request.headers.get('range');
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${file.data.length}` } });
    const start = match[1] ? Number(match[1]) : Math.max(0, file.data.length - Number(match[2]));
    const end = match[1] && match[2] ? Math.min(Number(match[2]), file.data.length - 1) : file.data.length - 1;
    if (start > end || start >= file.data.length) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${file.data.length}` } });
    headers.set('Content-Range', `bytes ${start}-${end}/${file.data.length}`); headers.set('Content-Length', String(end - start + 1));
    return new Response(file.data.slice(start, end + 1) as BodyInit, { status: 206, headers });
  }
  return new Response(file.data as BodyInit, { headers });
}
