import { requireAdmin } from '@/lib/server/auth';
import { db, getAdminContent } from '@/lib/server/store';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!await requireAdmin()) return Response.json({ error: 'Please sign in.' }, { status: 401 });
  const media = (db().prepare('SELECT * FROM media').all() as unknown as { data: Uint8Array; id: string }[]).map((file) => ({ ...file, data: Buffer.from(file.data).toString('base64') }));
  return Response.json({ version: 1, exportedAt: new Date().toISOString(), content: getAdminContent(), media }, { headers: { 'Content-Disposition': 'attachment; filename="antwu-content-backup.json"', 'Cache-Control': 'private, no-store' } });
}
