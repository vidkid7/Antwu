# ANTWU delivery notes

The requested rebuild is implemented as a production shaped Next.js App Router application. The public site is bilingual, responsive, content driven, and uses the supplied ANTWU logo, photographs, scans, and committee workbook. Legacy URLs remain available through route aliases.

The initial content is stored in `src/data/content-seed.json` and loaded into a persistent Node 24 SQLite store. The admin workspace at `/admin` manages all public collections, inbox submissions, uploads, settings, and password rotation. Draft visibility, same origin writes, rate limits, upload signatures, private attachments, and backup export are handled server side.

The final acceptance checks cover public navigation, English/Nepali persistence, committee filtering, gallery lightbox, contact and membership submissions, admin authentication and CRUD, keyboard labels, reduced motion, no horizontal overflow, and the production build. See `README.md` and `DEPLOYMENT.md` for operational details.
