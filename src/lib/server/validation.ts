import { type ContentCollection } from '@/lib/content-types';
import { HttpError, optionalText, requiredText, validEmail } from './security';

const fields: Record<ContentCollection, { localized: string[]; required: string[]; optional?: string[] }> = {
  committeeMembers: { localized: ['name', 'role', 'location'], required: ['category'], optional: ['image', 'phone', 'accent'] },
  notices: { localized: ['title', 'excerpt'], required: ['category'], optional: ['date', 'file', 'image'] },
  blogPosts: { localized: ['title', 'excerpt', 'body', 'category'], required: ['slug', 'image'], optional: ['date', 'readTime'] },
  galleryItems: { localized: ['title'], required: ['type'], optional: ['image', 'video', 'size'] },
  documents: { localized: ['title'], required: ['category', 'file'], optional: ['date', 'type', 'size', 'image'] },
  heroSlides: { localized: ['title', 'kicker', 'sub'], required: ['image'] },
  activities: { localized: ['title', 'body'], required: [], optional: ['date', 'image'] },
  pages: { localized: ['title', 'body'], required: [], optional: ['image'] },
  stats: { localized: ['label'], required: [], optional: ['suffix'] },
  values: { localized: ['title', 'body'], required: ['icon', 'number'] },
  settings: { localized: ['address', 'mission', 'siteTitle', 'description'], required: ['phone', 'email'], optional: ['facebook', 'instagram'] },
};

export function safeUrl(value: string, localOnly = false): boolean {
  if (!value) return true;
  if (/[\s\\<>]/.test(value) || value.includes('..') || /%2e|%2f|%5c/i.test(value)) return false;
  if (/^\/(assets|downloads|media)\/[a-zA-Z0-9_./%-]+$/.test(value)) return true;
  if (localOnly) return false;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}

function bilingual(value: unknown, key: string) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpError(`${key} needs English and Nepali content.`);
  const pair = value as Record<string, unknown>;
  return { en: requiredText(pair.en, `${key} (English)`, 30_000), ne: requiredText(pair.ne, `${key} (Nepali)`, 30_000) };
}

export function validateRecord(collection: ContentCollection, input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new HttpError('A record is required.');
  const record = input as Record<string, unknown>;
  const output: Record<string, unknown> = {};
  if (record.id) {
    const id = requiredText(record.id, 'Record ID', 100);
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new HttpError('The record ID is invalid.');
    output.id = id;
  }
  for (const key of fields[collection].localized) output[key] = bilingual(record[key], key);
  for (const key of fields[collection].required) output[key] = requiredText(record[key], key, 1000);
  for (const key of fields[collection].optional || []) output[key] = optionalText(record[key], 1000);
  for (const key of collection === 'notices' ? ['body'] : collection === 'documents' ? ['description'] : []) {
    const pair = record[key] as { en?: string; ne?: string } | undefined;
    if (pair?.en || pair?.ne) output[key] = bilingual(pair, key);
  }
  for (const key of ['image', 'file', 'video', 'facebook', 'instagram']) {
    if (output[key] && !safeUrl(String(output[key]), key === 'image')) throw new HttpError(`${key} must use a safe ${key === 'image' ? 'uploaded image' : 'HTTPS or uploaded file'} URL.`);
  }
  if (collection !== 'settings') {
    if (record.status !== undefined && !['Published', 'Draft'].includes(String(record.status))) throw new HttpError('Choose Published or Draft.');
    output.status = record.status || 'Draft';
    const order = Number(record.order || 0);
    if (!Number.isFinite(order) || order < 0 || order > 100_000) throw new HttpError('Order must be a number from 0 to 100000.');
    output.order = order;
  }
  if (collection === 'committeeMembers' && !['Central', 'Province', 'District', 'Unit', 'International'].includes(String(output.category))) throw new HttpError('Choose a valid committee category.');
  if (collection === 'notices') {
    if (!['Notice', 'Press release', 'Tender', 'News'].includes(String(output.category))) throw new HttpError('Choose a valid notice category.');
    output.urgent = record.urgent === true;
  }
  if (collection === 'blogPosts' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(output.slug))) throw new HttpError('Use a lowercase slug with hyphens.');
  if (collection === 'galleryItems') {
    if (!['photo', 'video'].includes(String(output.type))) throw new HttpError('Choose photo or video.');
    if (output.type === 'photo' && !output.image) throw new HttpError('Choose an image.');
    if (output.type === 'video' && !output.video) throw new HttpError('Choose a video file.');
    if (!['wide', 'tall', 'square'].includes(String(output.size))) output.size = 'wide';
  }
  if (collection === 'stats') {
    const value = Number(record.value);
    if (!Number.isFinite(value) || value < 0 || value > 1_000_000_000) throw new HttpError('Value must be a valid positive number.');
    output.value = value;
  }
  if (collection === 'values' && !['shield', 'eye', 'flag', 'users', 'heart', 'book', 'megaphone', 'bus', 'map', 'handshake'].includes(String(output.icon))) throw new HttpError('Choose a valid icon.');
  if (collection === 'settings' && !validEmail(String(output.email))) throw new HttpError('Enter a valid email.');
  return output;
}
