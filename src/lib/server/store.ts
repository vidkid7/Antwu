import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import seed from '@/data/content-seed.json';
import { contentCollections, type ContentCollection, type ContentData, type AdminData } from '@/lib/content-types';

let database: DatabaseSync | undefined;
export function db() {
  if (database) return database;
  const filename = process.env.ANTWU_DB_PATH || path.join(process.cwd(), '.local', 'antwu.sqlite');
  if (filename !== ':memory:') mkdirSync(path.dirname(filename), { recursive: true });
  const connection = new DatabaseSync(filename);
  connection.exec(`PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS content (collection TEXT NOT NULL, id TEXT NOT NULL, data TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY(collection,id));
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL, data BLOB NOT NULL, private INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS migrations (id TEXT PRIMARY KEY);`);
  if (!connection.prepare('SELECT id FROM migrations WHERE id = ?').get('initial-content-v1')) {
    connection.exec('BEGIN IMMEDIATE');
    try {
      const insert = connection.prepare('INSERT OR IGNORE INTO content VALUES (?, ?, ?, ?)');
      for (const collection of contentCollections) {
        for (const record of seed[collection]) insert.run(collection, record.id, JSON.stringify(record), new Date().toISOString());
      }
      connection.prepare('INSERT INTO migrations VALUES (?)').run('initial-content-v1');
      connection.exec('COMMIT');
    } catch (error) { connection.exec('ROLLBACK'); connection.close(); throw error; }
  }
  // Keep newly curated seed metadata available in existing installations without
  // overwriting editorial changes made through the admin console.
  if (!connection.prepare('SELECT id FROM migrations WHERE id = ?').get('document-preview-v2')) {
    connection.exec('BEGIN IMMEDIATE');
    try {
      const find = connection.prepare('SELECT data FROM content WHERE collection = ? AND id = ?');
      const update = connection.prepare('UPDATE content SET data = ?, updated_at = ? WHERE collection = ? AND id = ?');
      for (const record of seed.documents) {
        if (!record.image) continue;
        const row = find.get('documents', record.id) as { data: string } | undefined;
        if (!row) continue;
        const current = JSON.parse(row.data) as Record<string, unknown>;
        if (current.image) continue;
        update.run(JSON.stringify({ ...current, image: record.image }), new Date().toISOString(), 'documents', record.id);
      }
      connection.prepare('INSERT INTO migrations VALUES (?)').run('document-preview-v2');
      connection.exec('COMMIT');
    } catch (error) { connection.exec('ROLLBACK'); connection.close(); throw error; }
  }
  // Add the curated bilingual blog launch stories to existing installations
  // without replacing any article an editor may already have changed.
  if (!connection.prepare('SELECT id FROM migrations WHERE id = ?').get('blog-content-v1')) {
    connection.exec('BEGIN IMMEDIATE');
    try {
      const find = connection.prepare('SELECT id FROM content WHERE collection = ? AND id = ?');
      const insert = connection.prepare('INSERT OR IGNORE INTO content VALUES (?, ?, ?, ?)');
      for (const record of seed.blogPosts) {
        if (find.get('blogPosts', record.id)) continue;
        insert.run('blogPosts', record.id, JSON.stringify(record), new Date().toISOString());
      }
      connection.prepare('INSERT INTO migrations VALUES (?)').run('blog-content-v1');
      connection.exec('COMMIT');
    } catch (error) { connection.exec('ROLLBACK'); connection.close(); throw error; }
  }
  // Use the meeting photograph for the flood statement story when the initial
  // scan image is still present; the source scan remains available in Documents.
  if (!connection.prepare('SELECT id FROM migrations WHERE id = ?').get('blog-content-v2')) {
    connection.exec('BEGIN IMMEDIATE');
    try {
      const row = connection.prepare('SELECT data FROM content WHERE collection = ? AND id = ?').get('blogPosts', 'bhotekoshi-flood-solidarity') as { data: string } | undefined;
      if (row) {
        const current = JSON.parse(row.data) as Record<string, unknown>;
        if (current.image === '/assets/official/press-release.webp') {
          connection.prepare('UPDATE content SET data = ?, updated_at = ? WHERE collection = ? AND id = ?').run(JSON.stringify({ ...current, image: '/assets/official/office-meeting.webp' }), new Date().toISOString(), 'blogPosts', 'bhotekoshi-flood-solidarity');
        }
      }
      connection.prepare('INSERT INTO migrations VALUES (?)').run('blog-content-v2');
      connection.exec('COMMIT');
    } catch (error) { connection.exec('ROLLBACK'); connection.close(); throw error; }
  }
  database = connection;
  return connection;
}

export function getRecords(collection: string): Record<string, unknown>[] {
  return (db().prepare('SELECT data FROM content WHERE collection = ? ORDER BY rowid').all(collection) as { data: string }[])
    .map((row) => JSON.parse(row.data) as Record<string, unknown>)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

export function getPublicContent(): ContentData {
  const data = Object.fromEntries(contentCollections.map((collection) => [collection, getRecords(collection).filter((record) => record.status !== 'Draft')])) as ContentData;
  data.stats = data.stats.map((stat) => stat.id === 'central-count' ? { ...stat, value: data.committeeMembers.filter((member) => member.category === 'Central').length } : stat);
  return data;
}

export function getAdminContent(): AdminData {
  return Object.fromEntries([...contentCollections, 'messages', 'applications'].map((collection) => [collection, getRecords(collection)])) as AdminData;
}

export function getRecord(collection: string, id: string): Record<string, unknown> | null {
  const row = db().prepare('SELECT data FROM content WHERE collection = ? AND id = ?').get(collection, id) as { data: string } | undefined;
  return row ? JSON.parse(row.data) : null;
}

export function saveRecord(collection: string, record: Record<string, unknown>, create = false) {
  const id = String(record.id || randomUUID());
  const value = { ...record, id };
  const now = new Date().toISOString();
  if (create) db().prepare('INSERT INTO content VALUES (?, ?, ?, ?)').run(collection, id, JSON.stringify(value), now);
  else db().prepare('UPDATE content SET data = ?, updated_at = ? WHERE collection = ? AND id = ?').run(JSON.stringify(value), now, collection, id);
  return value;
}

export function deleteRecord(collection: string, id: string) {
  const record = getRecord(collection, id);
  db().exec('BEGIN IMMEDIATE');
  try {
    db().prepare('DELETE FROM content WHERE collection = ? AND id = ?').run(collection, id);
    if ((collection === 'applications' || collection === 'messages') && Array.isArray(record?.files)) {
      for (const file of record.files as { url: string }[]) db().prepare('DELETE FROM media WHERE id = ? AND private = 1').run(file.url.split('/').pop() || '');
    }
    db().exec('COMMIT');
  } catch (error) { db().exec('ROLLBACK'); throw error; }
}

export function isCollection(value: unknown): value is ContentCollection { return typeof value === 'string' && contentCollections.includes(value as ContentCollection); }
export function consumeLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  db().prepare('DELETE FROM rate_limits WHERE expires < ?').run(now);
  db().prepare('INSERT INTO rate_limits VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1').run(key, now + windowMs);
  const row = db().prepare('SELECT count FROM rate_limits WHERE key = ?').get(key) as { count: number };
  return row.count <= max;
}
