import { consumeLimit, db, saveRecord } from '@/lib/server/store';
import { prepareMedia, readMultipart, saveMedia, type PreparedMedia } from '@/lib/server/media';
import { clientKey, errorResponse, HttpError, optionalText, requiredText, sameOrigin, validEmail } from '@/lib/server/security';
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    if (!consumeLimit(`membership:${clientKey(request)}`, 20, 60 * 60_000)) throw new HttpError('Too many submissions. Please try again later.', 429);
    const form = await readMultipart(request, 36 * 1024 * 1024);
    const record: Record<string, unknown> = { status: 'New', submittedAt: new Date().toISOString() };
    for (const field of ['name', 'phone', 'perma_address', 'committee', 'work_province', 'district', 'levi', 'issue_date', 'id_number']) record[field] = requiredText(form.get(field), field.replaceAll('_', ' '), 300);
    for (const field of ['email', 'temp_address', 'marital_status', 'parent_name', 'social_security', 'old_membership', 'blood_group', 'edu_level', 'min_labor', 'position', 'work_route']) record[field] = optionalText(form.get(field), 500);
    if (record.email && !validEmail(String(record.email))) throw new HttpError('Enter a valid email address.');
    if (!/^[+\d\s()-]{7,30}$/.test(String(record.phone))) throw new HttpError('Enter a valid phone number.');
    if (!['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'].includes(String(record.work_province))) throw new HttpError('Choose a valid province.');
    const files: PreparedMedia[] = [];
    const ids = form.getAll('id_image[]').filter((file): file is File => file instanceof File && file.size > 0);
    if (!ids.length || ids.length > 5) throw new HttpError('Upload between one and five identity documents.');
    for (const file of ids) files.push(await prepareMedia(file, true, 'id_image[]'));
    for (const field of ['photo', 'receipt']) {
      const file = form.get(field);
      if (!(file instanceof File) || !file.size) { if (field === 'photo') throw new HttpError('Upload a profile photo.'); continue; }
      files.push(await prepareMedia(file, true, field));
    }
    db().exec('BEGIN IMMEDIATE');
    try {
      record.files = files.map(saveMedia);
      const saved = saveRecord('applications', record, true);
      db().exec('COMMIT');
      return Response.json({ ok: true, id: saved.id }, { status: 201 });
    } catch (error) { db().exec('ROLLBACK'); throw error; }
  } catch (error) { return errorResponse(error); }
}
