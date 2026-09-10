# ANTWU civic information site

ANTWU is a bilingual (English / नेपाली) Next.js App Router site for अखिल नेपाल यातायात मजदुर संघ. It uses the official supplied logo, field photographs, document scans, and the 121-person central committee workbook as its initial content.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The local content database is created at `.local/antwu.sqlite` on first start. To create the first administrator, run `npm run admin:setup`; the generated credentials are written to `.local/admin-access.txt` and should be changed after signing in at `/admin/login`.

## Useful commands

```bash
npm run lint
npm run typecheck
npm run test
npm run test:integration
npm run build
npm run start
```

`test:integration` starts a temporary Next server and exercises authentication, CSRF checks, content CRUD, uploads, public/private media, contact and membership submissions, password rotation, export, and route behavior.

## Content and administration

- Public routes live under `src/app/(public)` and share the responsive bilingual shell in `src/components/site-shell.tsx`.
- Seed content is in [`src/data/content-seed.json`](./src/data/content-seed.json); optimized supplied media is in `public/assets/official` and downloads are in `public/downloads`.
- The server-side store in `src/lib/server/store.ts` uses Node 24's built-in SQLite driver. Content is schema-validated, draft records stay private, and admin sessions use HttpOnly cookies with scrypt password hashes.
- `/admin` provides CRUD for committee, notices, activities, blog, gallery, documents, homepage, pages, statistics, values, settings, and inbox submissions. Uploaded files are validated and served through `/media/:id`; membership attachments remain private.

## Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the Node, PM2, Nginx, environment, backup, and first-admin setup. Keep `.local` outside disposable release directories and back it up with the SQLite database.
