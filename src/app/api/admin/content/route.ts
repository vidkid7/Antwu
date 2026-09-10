import { requireAdmin } from '@/lib/server/auth';
import { deleteRecord, getAdminContent, getRecord, getRecords, isCollection, saveRecord } from '@/lib/server/store';
import { errorResponse, HttpError, readJson, requiredText, sameOrigin } from '@/lib/server/security';
import { validateRecord } from '@/lib/server/validation';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!await requireAdmin()) return Response.json({ error: 'Please sign in.' }, { status: 401 });
  return Response.json(getAdminContent(), { headers: { 'Cache-Control': 'no-store' } });
}
async function mutate(request: Request, mode: 'POST' | 'PUT' | 'DELETE') {
  try {
    sameOrigin(request);
    if (!await requireAdmin()) throw new HttpError('Please sign in.', 401);
    const body = await readJson(request);
    const collection = requiredText(body.collection, 'Collection', 40);
    const inbox = collection === 'messages' || collection === 'applications';
    if (!isCollection(collection) && !inbox) throw new HttpError('Unknown content collection.');
    if (mode === 'DELETE') {
      const id = requiredText(body.id, 'Record ID', 100);
      if (collection === 'settings' || (collection === 'pages' && ['about', 'chairperson'].includes(id))) throw new HttpError('This core record can be edited but cannot be deleted.');
      if (!getRecord(collection, id)) throw new HttpError('Record not found.', 404);
      deleteRecord(collection, id); return Response.json({ ok: true });
    }
    if (inbox) {
      if (mode === 'POST') throw new HttpError('Submissions must come from the public form.');
      const incoming = body.record as Record<string, unknown> | undefined;
      const id = requiredText(incoming?.id, 'Record ID', 100);
      const current = getRecord(collection, id); if (!current) throw new HttpError('Record not found.', 404);
      const statuses = collection === 'messages' ? ['New', 'Reviewed', 'Resolved'] : ['New', 'Reviewed', 'Approved', 'Rejected'];
      if (!statuses.includes(String(incoming?.status))) throw new HttpError('Choose a valid status.');
      return Response.json({ record: saveRecord(collection, { ...current, status: incoming?.status }) });
    }
    if (!isCollection(collection)) throw new HttpError('Unknown collection.');
    const record = validateRecord(collection, body.record);
    if (mode === 'PUT' && (!record.id || !getRecord(collection, String(record.id)))) throw new HttpError('Record not found.', 404);
    if (mode === 'POST' && collection === 'settings' && getRecords('settings').length) throw new HttpError('Edit the existing site settings.');
    if (mode === 'POST' && record.id && getRecord(collection, String(record.id))) throw new HttpError('This ID already exists.', 409);
    if (collection === 'blogPosts' && getRecords(collection).some((item) => item.slug === record.slug && item.id !== record.id)) throw new HttpError('This article slug already exists.', 409);
    return Response.json({ record: saveRecord(collection, record, mode === 'POST') }, { status: mode === 'POST' ? 201 : 200 });
  } catch (error) { return errorResponse(error); }
}
export const POST = (request: Request) => mutate(request, 'POST');
export const PUT = (request: Request) => mutate(request, 'PUT');
export const DELETE = (request: Request) => mutate(request, 'DELETE');
