import { randomBytes, randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { db } from '../src/lib/server/store';
import { passwordHash, validEmail } from '../src/lib/server/security';

const emailArg = process.argv.indexOf('--email');
const email = (emailArg > -1 ? process.argv[emailArg + 1] : process.env.ADMIN_EMAIL || 'admin@antwu.org.np').toLowerCase();
if (!validEmail(email)) throw new Error('Supply a valid --email address.');
if (db().prepare('SELECT id FROM users WHERE email = ?').get(email)) {
  console.log('This administrator already exists. Use the account page to change its password.');
} else {
  const password = process.env.ADMIN_INITIAL_PASSWORD || randomBytes(20).toString('base64url');
  if (password.length < 12 || password.length > 200) throw new Error('Use a password of 12 to 200 characters.');
  db().prepare('INSERT INTO users VALUES (?, ?, ?)').run(randomUUID(), email, passwordHash(password));
  if (!process.env.ADMIN_INITIAL_PASSWORD) {
    const destination = path.join(process.cwd(), '.local', 'admin-access.txt');
    mkdirSync(path.dirname(destination), { recursive: true });
    writeFileSync(destination, `ANTWU local administrator\nEmail: ${email}\nPassword: ${password}\n\nSign in at /admin/login. Change this generated password in Account, then remove this file.\n`, { mode: 0o600, flag: 'wx' });
    console.log(`Administrator created. Generated credentials saved privately in ${destination}`);
  } else console.log(`Administrator created for ${email}.`);
}
