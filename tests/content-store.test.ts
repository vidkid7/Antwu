import { describe, expect, it, beforeAll } from 'vitest';
import { getPublicContent, getAdminContent, saveRecord, deleteRecord, getRecord, consumeLimit } from '../src/lib/server/store';
import { validateRecord, safeUrl } from '../src/lib/server/validation';
import { passwordHash, passwordValue, verifyPassword, hashToken, sameOrigin, readJson } from '../src/lib/server/security';
import { prepareMedia } from '../src/lib/server/media';

beforeAll(() => { process.env.ANTWU_DB_PATH = ':memory:'; });

describe('real content and publication boundaries', () => {
  it('imports all 121 members without demo identities', () => {
    const content = getPublicContent();
    expect(content.committeeMembers).toHaveLength(121);
    expect(content.committeeMembers[0].name.en).toBe('Dipak K.C');
    expect(content.committeeMembers.some((member) => member.name.en === 'Sita Rai')).toBe(false);
    expect(content.galleryItems).toHaveLength(8);
    expect(content.documents.every((document) => document.file.startsWith('/downloads/'))).toBe(true);
  });
  it('persists changes, hides drafts and excludes private submissions', () => {
    const record = saveRecord('notices', { id: 'test-notice', title: { en: 'Draft', ne: 'मस्यौदा' }, status: 'Draft' }, true);
    saveRecord('messages', { id: 'test-message', name: 'Private applicant' }, true);
    expect(getAdminContent().notices.some((item) => item.id === record.id)).toBe(true);
    expect(getPublicContent().notices.some((item) => item.id === record.id)).toBe(false);
    expect(getPublicContent()).not.toHaveProperty('messages');
    saveRecord('notices', { ...record, status: 'Published' });
    expect(getPublicContent().notices.some((item) => item.id === record.id)).toBe(true);
    deleteRecord('notices', 'test-notice'); deleteRecord('messages', 'test-message');
    expect(getRecord('notices', 'test-notice')).toBeNull();
  });
  it('derives central member count after edits', () => {
    const original = getPublicContent().committeeMembers[0];
    saveRecord('committeeMembers', { ...original, status: 'Draft' });
    expect(getPublicContent().stats.find((item) => item.id === 'central-count')?.value).toBe(120);
    saveRecord('committeeMembers', original);
  });
});
describe('request and content validation', () => {
  it('rejects missing translations, invalid categories and unsafe URLs', () => {
    expect(() => validateRecord('heroSlides', { title: { en: 'Missing Nepali' } })).toThrow();
    const person = getPublicContent().committeeMembers[0];
    expect(() => validateRecord('committeeMembers', { ...person, category: 'Invalid' })).toThrow();
    for (const url of ['javascript:alert(1)', '//evil.test', '/media/../secret', '/media/%2e%2e/secret', 'https://user:password@host.test/x']) expect(safeUrl(url)).toBe(false);
    expect(safeUrl('/assets/official/logo.png', true)).toBe(true);
    expect(safeUrl('https://example.org/file.pdf')).toBe(true);
  });
  it('accepts valid bilingual records and validates video media', () => {
    const notice = getPublicContent().notices[0];
    expect(validateRecord('notices', notice).title).toEqual(notice.title);
    expect(() => validateRecord('galleryItems', { title: { en: 'Video', ne: 'भिडियो' }, type: 'video' })).toThrow();
  });
  it('enforces origin and bounded JSON parsing', async () => {
    expect(() => sameOrigin(new Request('http://localhost/api/test', { headers: { origin: 'https://evil.test' } }))).toThrow();
    expect(() => sameOrigin(new Request('http://localhost/api/test', { headers: { origin: 'http://localhost' } }))).not.toThrow();
    await expect(readJson(new Request('http://localhost', { method: 'POST', body: 'x'.repeat(100) }), 20)).rejects.toThrow();
    await expect(readJson(new Request('http://localhost', { method: 'POST', body: '[]' }))).rejects.toThrow();
  });
  it('does not accept renamed HTML as an image', async () => {
    await expect(prepareMedia(new File(['<script>alert(1)</script>'], 'photo.png', { type: 'image/png' }), false)).rejects.toThrow();
  });
});
describe('authentication primitives', () => {
  it('salts password hashes, verifies passwords and preserves intentional spaces', () => {
    const value = ' a sufficiently long password ';
    const hash = passwordHash(value);
    expect(passwordHash(value)).not.toBe(hash);
    expect(passwordValue(value)).toBe(value);
    expect(verifyPassword(value, hash)).toBe(true);
    expect(verifyPassword('incorrect', hash)).toBe(false);
    expect(verifyPassword(value, 'malformed')).toBe(false);
    expect(hashToken('session-secret')).not.toContain('session-secret');
  });
  it('enforces limits rather than resetting on every request', () => {
    expect(consumeLimit('test-limit', 2, 60_000)).toBe(true);
    expect(consumeLimit('test-limit', 2, 60_000)).toBe(true);
    expect(consumeLimit('test-limit', 2, 60_000)).toBe(false);
  });
});
