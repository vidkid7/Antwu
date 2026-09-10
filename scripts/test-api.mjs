import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const secret = readFileSync('.local/admin-access.txt', 'utf8');
const email = secret.match(/^Email: (.+)$/m)[1];
const password = secret.match(/^Password: (.+)$/m)[1];
let cookie = ''; let assertions = 0; const cleanup = []; const uploaded = [];
const check = (value, message) => { assert.ok(value, message); assertions++; };
async function call(path, method = 'GET', body, auth = true) {
  const response = await fetch(base + path, { method, headers: { Origin: base, ...(auth && cookie ? { Cookie: cookie } : {}), ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}) }, body: body ? body instanceof FormData ? body : JSON.stringify(body) : undefined });
  return response;
}
async function login(pass = password) {
  const response = await call('/api/auth/login', 'POST', { email, password: pass }, false);
  if (response.ok) cookie = response.headers.get('set-cookie').split(';')[0];
  return response;
}
const l = { en: 'QA test content', ne: 'परीक्षण सामग्री' };
const fixtures = {
  committeeMembers: { name: l, role: l, category: 'Province', location: l, image: '', accent: 'red', phone: '' },
  notices: { title: l, excerpt: l, body: l, category: 'News', date: '2026-09-08', file: '', urgent: false },
  blogPosts: { title: l, excerpt: l, body: l, category: l, slug: 'qa-test-article', date: '2026-09-08', image: '/assets/official/union-gathering.webp', readTime: '2 min' },
  galleryItems: { title: l, image: '/assets/official/union-gathering.webp', type: 'photo', size: 'wide' },
  documents: { title: l, description: l, category: 'Publications', file: '/downloads/taxi-campaign.jpg', type: 'JPG', size: '123 KB', date: '' },
  heroSlides: { title: l, kicker: l, sub: l, image: '/assets/official/union-gathering.webp' },
  activities: { title: l, body: l, date: '', image: '/assets/official/office-meeting.webp' },
  pages: { title: l, body: l, image: '' },
  stats: { label: l, value: 3, suffix: '' },
  values: { title: l, body: l, icon: 'shield', number: '04' },
};
try {
  check((await call('/api/admin/content', 'GET', undefined, false)).status === 401, 'Admin data requires login');
  check((await login('incorrect-password')).status === 401, 'Invalid credentials rejected');
  const loggedIn = await login(); check(loggedIn.ok, 'Valid administrator can log in');
  check(loggedIn.headers.get('set-cookie').includes('HttpOnly'), 'Cookie is HttpOnly');
  check(loggedIn.headers.get('set-cookie').includes('SameSite=strict'), 'Cookie restricts cross-site requests');
  const csrf = await fetch(base + '/api/admin/content', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie, Origin: 'https://unrelated.example' }, body: '{}' });
  check(csrf.status === 403, 'Cross-origin writes rejected');
  for (const [collection, fixture] of Object.entries(fixtures)) {
    const response = await call('/api/admin/content', 'POST', { collection, record: { ...fixture, status: 'Draft', order: 9999 } });
    assert.equal(response.status, 201, `${collection}: ${await response.clone().text()}`); assertions++;
    let record = (await response.json()).record; cleanup.push([collection, record.id]);
    let publicData = await (await call('/api/content')).json();
    check(!publicData[collection].some(item => item.id === record.id), `${collection}: draft hidden`);
    record = { ...record, status: 'Published' };
    check((await call('/api/admin/content', 'PUT', { collection, record })).ok, `${collection}: publish`);
    publicData = await (await call('/api/content')).json();
    check(publicData[collection].some(item => item.id === record.id), `${collection}: visible on frontend data`);
    if (collection === 'blogPosts') {
      const page = await call('/blog/qa-test-article');
      check(page.ok && (await page.text()).includes('QA test content'), 'Published article route and body');
    }
    record = { ...record, order: 9998 };
    check((await call('/api/admin/content', 'PUT', { collection, record })).ok, `${collection}: edit`);
    check((await (await call('/api/admin/content')).json())[collection].some(item => item.id === record.id && item.order === 9998), `${collection}: edit persists after refetch`);
    check((await call('/api/admin/content', 'DELETE', { collection, id: record.id })).ok, `${collection}: delete`);
    check(!(await (await call('/api/content')).json())[collection].some(item => item.id === record.id), `${collection}: deleted on frontend data`);
  }
  const settings = (await (await call('/api/admin/content')).json()).settings[0];
  try {
    check((await call('/api/admin/content', 'PUT', { collection: 'settings', record: { ...settings, mission: l } })).ok, 'Settings edit');
    check((await (await call('/api/content')).json()).settings[0].mission.en === l.en, 'Settings update visible publicly');
  } finally { await call('/api/admin/content', 'PUT', { collection: 'settings', record: settings }); }
  check((await call('/api/admin/content', 'DELETE', { collection: 'settings', id: settings.id })).status === 400, 'Core settings protected');
  const form = new FormData(); form.set('file', new File([readFileSync('public/assets/official/logo.png')], 'qa-logo.png', { type: 'image/png' }));
  const upload = await call('/api/admin/uploads', 'POST', form); check(upload.status === 201, 'Image upload succeeds');
  const media = await upload.json(); uploaded.push(media.url);
  check((await call(media.url, 'GET', undefined, false)).ok, 'Public image loads');
  const range = await fetch(base + media.url, { headers: { Range: 'bytes=0-9' } });
  check(range.status === 206 && (await range.arrayBuffer()).byteLength === 10, 'Media ranges work');
  const invalid = new FormData(); invalid.set('file', new File(['<html>bad</html>'], 'bad.png', { type: 'image/png' }));
  check((await call('/api/admin/uploads', 'POST', invalid)).status === 400, 'Forged image upload rejected');
  const contact = await call('/api/contact', 'POST', { name: 'QA Integration', email: 'qa@example.org', phone: '9800000000', subject: 'QA integration', message: 'Temporary automated verification. Delete after test.' }, false);
  check(contact.status === 201, 'Contact saved'); const contactId = (await contact.json()).id; cleanup.push(['messages', contactId]);
  const application = new FormData();
  for (const [key, value] of Object.entries({ name: 'QA Application', email: 'qa@example.org', phone: '9800000000', perma_address: 'Kathmandu', committee: 'Central', work_province: 'Bagmati', district: 'Kathmandu', levi: 'केन्द्र - 500', issue_date: '2083/05/23', id_number: 'QA-TEST-ONLY' })) application.set(key, value);
  application.set('photo', new File([readFileSync('public/assets/official/logo.png')], 'qa-photo.png', { type: 'image/png' }));
  application.set('id_image[]', new File([readFileSync('public/assets/official/logo.png')], 'qa-identity.png', { type: 'image/png' }));
  const membership = await call('/api/membership', 'POST', application, false); check(membership.status === 201, 'Membership and private attachments saved');
  const memberId = (await membership.json()).id; cleanup.push(['applications', memberId]);
  const admin = await (await call('/api/admin/content')).json();
  check(admin.messages.some(item => item.id === contactId), 'Contact appears in admin inbox');
  const member = admin.applications.find(item => item.id === memberId); check(member.files.length === 2, 'Both private files linked');
  check((await call(member.files[0].url, 'GET', undefined, false)).status === 404, 'Anonymous private-file access denied');
  check((await call(member.files[0].url)).ok, 'Admin can read private file');
  check((await call('/api/admin/content', 'PUT', { collection: 'applications', record: { ...member, status: 'Reviewed' } })).ok, 'Submission status update');
  const publicData = await (await call('/api/content')).json(); check(!publicData.messages && !publicData.applications, 'Private submissions excluded');
  const exported = await call('/api/admin/export'); check(exported.ok && (await exported.json()).version === 1, 'Authenticated content backup');
  check((await call('/api/admin/export', 'GET', undefined, false)).status === 401, 'Anonymous backup denied');
  check((await call('/blog/not-a-real-post')).status === 404, 'Unknown blog slug returns 404');
  const currentCookie = cookie; await login(); const secondaryCookie = cookie; cookie = currentCookie;
  const nextPassword = randomBytes(20).toString('base64url');
  try {
    check((await call('/api/auth/password', 'POST', { currentPassword: password, newPassword: nextPassword })).ok, 'Password change');
    check((await fetch(base + '/api/admin/content', { headers: { Cookie: secondaryCookie } })).status === 401, 'Password change revokes other sessions');
    check((await login(nextPassword)).ok, 'New password works');
  } finally { await call('/api/auth/password', 'POST', { currentPassword: nextPassword, newPassword: password }); }
  writeFileSync('audit/api-tests.json', JSON.stringify({ assertions, result: 'passed', testedAt: new Date().toISOString(), collections: Object.keys(fixtures), features: ['login', 'CSRF', 'CRUD', 'drafts', 'settings', 'uploads', 'file ranges', 'contact', 'membership', 'private attachments', 'backup', '404', 'password rotation'] }, null, 2));
  console.log(`${assertions} API checks passed.`);
} finally {
  for (const [collection, id] of cleanup) await call('/api/admin/content', 'DELETE', { collection, id });
  for (const url of uploaded) await call('/api/admin/uploads', 'DELETE', { url });
  if (cookie) {
    await call('/api/auth/logout', 'POST');
    check((await call('/api/admin/content')).status === 401, 'Logout invalidates session');
  }
}
