import { consumeLimit, saveRecord } from '@/lib/server/store';
import { clientKey, errorResponse, HttpError, optionalText, readJson, requiredText, sameOrigin, validEmail } from '@/lib/server/security';
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    if (!consumeLimit(`contact:${clientKey(request)}`, 30, 60 * 60_000)) throw new HttpError('Too many submissions. Please try again later.', 429);
    const body = await readJson(request, 20_000);
    const name = requiredText(body.name, 'Name', 150); const email = requiredText(body.email, 'Email', 254);
    if (!validEmail(email)) throw new HttpError('Enter a valid email address.');
    const phone = optionalText(body.phone, 30);
    if (phone && !/^[+\d\s()-]{7,30}$/.test(phone)) throw new HttpError('Enter a valid phone number.');
    const record = saveRecord('messages', { name, email, phone, subject: optionalText(body.subject, 250), message: requiredText(body.message, 'Message', 10_000), status: 'New', submittedAt: new Date().toISOString() }, true);
    return Response.json({ ok: true, id: record.id }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
