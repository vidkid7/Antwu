import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import content from '../src/data/content-seed.json';

describe('ANTWU smoke contract', () => {
  it('keeps bilingual content available in both languages', () => {
    expect(content.notices.every((notice) => notice.title.en && notice.title.ne)).toBe(true);
    expect(content.committeeMembers.length).toBe(121);
  });

  it('ships real local images and downloadable documents', () => {
    for (const item of content.galleryItems) expect(fs.existsSync(path.join(process.cwd(), 'public', item.image))).toBe(true);
    for (const item of content.documents) expect(fs.existsSync(path.join(process.cwd(), 'public', item.file))).toBe(true);
  });
});
