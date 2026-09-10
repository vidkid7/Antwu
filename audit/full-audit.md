# ANTWU final audit

Audit date: 2026-09-10

## Scope

- Reviewed the original delivery brief and the supplied `imagesss` assets.
- Verified the official logo, 11 optimized field/photo assets, 2 scanned document downloads, and the 121-person committee workbook are integrated into the seeded content. The two optimized scan variants are now used as document thumbnails while the original JPG downloads remain available.
- Reviewed the public site, legacy route aliases, bilingual shell, forms, gallery interaction, admin console, API boundaries, metadata, deployment notes, semantic headings, image alternatives, and contrast rules.
- Applied the globally installed `vercel-react-best-practices` and `web-design-guidelines` skills from skills.sh during the implementation and review.
- Checked skills.sh for the browser, frontend, React performance, and UI review workflows; those required skills were already installed locally, so no duplicate installation was needed.

## Automated verification

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test` — passed: 11 tests across 2 files.
- `npm run test:integration` — passed: 108 API checks covering authentication, CSRF, CRUD, draft visibility, uploads, media ranges, private attachments, contact, membership, password rotation, export, and 404 behavior.
- `npm run build` — passed with the production route table generated successfully and no application or Autoprefixer warnings.
- Node 24 emitted its standard built-in SQLite `ExperimentalWarning` during build/tests; it did not affect results.
- `npm audit --omit=dev` — 0 vulnerabilities.
- Full `npm audit --audit-level=high` — 0 vulnerabilities after upgrading the development test runner to Vitest 5.0.0; the config is now an explicit ESM `.mts` file using `import.meta.dirname`, so the test run is warning-free apart from Node’s SQLite experimental notice.
- Response headers verified: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict referrer policy, restricted permissions policy, and no `X-Powered-By` header.
- Deployment hardening reviewed: HTTP-to-HTTPS redirect, TLS 1.2/1.3, HSTS, upload limit, static asset caching, and reverse-proxy settings are present in `deploy/nginx.conf`; nginx syntax could not be executed locally because nginx is not installed on the audit machine.

## Browser verification

- Full public and legacy route axe sweep: 0 violations on every tested route, including empty-state routes, committee directories, documents, gallery, updates, organization chart, contact, membership, registration aliases, blog, and the custom 404 page. The homepage and Nepali homepage each report one incomplete contrast heuristic because the hero background is produced by a pseudo-element; the membership step indicator reports one overlap heuristic. Visible text uses explicit colors and was visually checked.
- Admin login and dashboard axe audits: 0 violations, 0 incomplete checks.
- Admin publications table and edit dialog axe audit: 0 violations, 0 incomplete checks; the new preview-image field is present with its current optimized scan and the modal closes cleanly with focus restoration.
- Latest local production performance probe: TTFB 31.5 ms, FCP 152 ms, LCP 152 ms, CLS 0. No console or page errors were reported during the final interactions.
- Responsive widths checked: 320, 375, 390, 430, 768, 1024, 1366, 1440, and 1920 px. No horizontal overflow was detected at any width.
- Final production route probe: 37 expected public, legacy, admin, robots, and sitemap routes returned 200; an unknown blog slug returned 404; no unexpected status codes were observed.
- Language switching checked with `?change_language=ne`: document language, navigation, hero, footer, and controls render in Nepali and persist via cookie/local storage.
- Navbar regression checked against the live reference: desktop exposes only `Home`, `About Us`, `Information`, `Gallery`, `Statisics/Activity`, `Blog`, and `Contact`; `About Us`, `Gallery`, and `Statisics/Activity` open on hover with the same submenu labels and routes. `Information` remains a plain item because the live desktop popup is empty, and now routes to the local public information library at `/documents` when clicked.
- Added the live-reference utility bar treatment: Facebook, Instagram and LinkedIn links sit on the left while the Kathmandu office location links to Google Maps on the right. The bar keeps the bilingual language switcher, has visible hover/focus states, and remains within the viewport at 390px.
- Mobile navbar checked at 390×844 against the live structure: `Home`, `About Us`, `Documents`, `Downloads`, `Gallery`, `Blog`, `Statistics/Activity`, and `Contact`; each grouped section expands with its live links and `Escape` closes the panel.
- Gallery checked: 8 real media tiles, native dialog opens, keyboard Escape closes, next-image navigation works, and the trigger regains focus.
- Contact form checked end to end in the browser; the temporary QA message was removed from the local database afterward.
- Final database check confirmed no QA test submissions remain.
- Membership form checked end to end in Chrome: required-field validation focuses the first invalid control, province selection populates districts, accepted identity/photo uploads reach the success state, the success reference passes contrast, and the temporary application was removed afterward.
- Admin login checked end to end; the committee workspace rendered all 121 rows and the edit dialog opened successfully.
- Admin navigation checked section by section on desktop and at 390px: populated sections, empty Events/Blog/Inbox states, settings, account, editor dialog, and mobile navigation all reported 0 axe violations with no overflow. Empty collections now omit the empty table markup and use a correctly ordered heading.
- The contact success-state reference label was rechecked after the final production rebuild and now passes contrast at 0 axe violations.
- Reproduced and fixed the Information navigation regression: the desktop control previously had no action and left the URL unchanged; it now opens `/documents`, which renders “Information, open to all.” with the published document previews and downloads. Chrome verification reports 0 axe violations, no overflow, and no console errors at 1440px. Mobile Documents expansion remains intact with its three live links.
- All tested public, legacy, admin, blog, robots, and sitemap routes returned the expected status (200 for valid routes and 404 for an unknown blog slug).
- Browser console/error inspection was clean during the final interactions.

## Deployment check

- The Chrome tab at `https://antwu.org.np` is still serving the previous deployment and remains the source of truth for the navbar labels and submenu contents. The matched, hover-enabled navbar is verified in the local production build at `http://127.0.0.1:3000`.
- No hosting configuration or server credentials are present in this workspace, so publishing the fixed build to `antwu.org.np` remains the deployment step.

## Final UI refresh and re-verification

- Reworked the shared public visual system in `src/app/globals.css` with warm paper surfaces, ink typography, union red accents, consistent spacing, responsive grids, editorial page heroes, refined cards, forms, archive rows, gallery/lightbox treatments, CTA bands, footer layout, and reduced-motion safeguards.
- Integrated the supplied union flag graphic into the red CTA as a blend-safe watermark, alongside the official emblem, optimized field photos, scanned downloads, and the committee workbook data.
- Verified the live navbar again against `https://antwu.org.np/?change_language=en`: desktop labels are `Home`, `About Us`, `Information`, `Gallery`, `Statisics/Activity`, `Blog`, and `Contact`; About Us, Gallery, and Statisics/Activity expose only the matching live submenu links on hover. Mobile keeps the live grouped structure with Documents, Downloads, and the Unit Committee link. The local Information item now has a working route to `/documents`.
- Removed the extra dropdown heading and aligned desktop navbar casing with the reference. Keyboard focus, ArrowDown opening, Escape closing, mobile focus trapping, and trigger focus restoration remain enabled.
- Final local production browser checks at 1440×1000 and 390×844 reported no horizontal overflow; desktop and mobile axe scans reported 0 violations. The only incomplete axe result is the known pseudo-element background heuristic on the decorative hero layer.
- Latest Chrome production vitals on the rebuilt local server: TTFB 31.5 ms, FCP 152 ms, LCP 152 ms, CLS 0; no console or page errors were reported during the final pass.
- The final legacy sweep covered 24 aliases individually in Chrome, all with expected headings, matching viewport and document widths, no page errors, and 0 axe violations. Four routes retained only the known pseudo-element contrast heuristic as an axe incomplete result.
- Rechecked the standalone gallery after the final CSS pass: all eight cards retain their image aspect ratio, the closed native dialog has zero layout dimensions, opening focuses the close control, ArrowRight advances media, Escape closes, and focus returns to the triggering card. The gallery axe scan now reports 0 violations. The CTA watermark was also verified at desktop and mobile sizes with no overflow.
- Added preview-image fields to notice/document admin schemas and safe URL validation, then added a non-destructive `document-preview-v2` SQLite migration so existing installations receive the curated thumbnails without overwriting editorial changes. The document library now renders the optimized taxi campaign and Bhotekoshi scan previews with accessible, high-contrast file labels; the final desktop document screenshot and axe scan both pass.
- Corrected the mobile document cascade so download actions remain visible below each narrow-screen row; the 390px full-page capture confirms both preview thumbnails and both download links with no horizontal overflow.
- Removed the red backing treatment from the official header logo so the emblem sits cleanly on the paper header, and added the supplied union flag as a large, low-opacity hero watermark with responsive positioning behind the lead visual. Final Chrome checks at 1440×1000 and 390×844 report no overflow, no console/page errors, and 0 real axe violations.
- Added four bilingual, published blog stories grounded in the verified About page, union values, Valley Taxi campaign notice, and Bhotekoshi flood statement. Each uses an existing official image, has a readable slug and summary, and opens through its detail route. The content seed and `blog-content-v1`/`blog-content-v2` migrations keep the stories available on fresh and existing installations without overwriting editorial changes. The mobile blog page now shows all four cards at 390px with no overflow; the listing and first detail route each report 0 axe violations and no console/page errors.
- Added a file-based 64px favicon at `/icon.png` and a `/manifest.webmanifest` with the ANTWU theme, app name and icon. Global metadata now includes normalized metadata base URLs, keywords, authorship, publisher, social cards, canonical URLs for the core pages, viewport settings and Organization/WebSite JSON-LD.
- Added the bilingual FAQ component to the homepage and `/faq`, with native keyboard-accessible disclosure panels and FAQPage structured data. Added `/privacy-policy` and `/terms-and-conditions`, plus `/about-us` and `/contact-us` aliases that preserve canonical URLs to the existing core pages. The new page set is linked in the footer and included in the sitemap.
- Corrected the AashaTech footer credit sizing so the full logo remains contained and legible, then separated the mobile legal, attribution and login rows to prevent inline text collisions.
- Added styled 404 and 500 experiences: the root not-found page, a recoverable route-level `error.tsx`, a branded `/server-error` page exposed through `/500`, and a global error fallback. The 404 and `/500` smoke checks render with 0 axe violations and no console/page errors.
- Rechecked `/robots.txt`, `/sitemap.xml`, `/icon.png` and `/manifest.webmanifest`: all return 200; robots disallows `/admin` and `/api/`, and the sitemap includes the FAQ, legal, alias and published blog routes. The homepage, FAQ, legal pages and aliases report equal document and viewport widths at 390px with no overflow.
- Fixed the membership wizard’s active fieldset class so its three steps are visible and interactive in the production stylesheet.
- Corrected admin empty-state heading order and removed empty table markup from collections with no records, eliminating the heading-order finding while keeping the empty-state guidance.
- Representative evidence: [home-final-1440.png](D:/ANTWU/audit/home-final-1440.png), [home-final-390.png](D:/ANTWU/audit/home-final-390.png), [home-seo-final-desktop.png](D:/ANTWU/audit/home-seo-final-desktop.png), [home-seo-final-mobile.png](D:/ANTWU/audit/home-seo-final-mobile.png), [faq-final-desktop.png](D:/ANTWU/audit/faq-final-desktop.png), [privacy-final-mobile.png](D:/ANTWU/audit/privacy-final-mobile.png), [hero-flag-desktop-final.png](D:/ANTWU/audit/hero-flag-desktop-final.png), [hero-flag-mobile-final.png](D:/ANTWU/audit/hero-flag-mobile-final.png), [documents-preview-final-v4.png](D:/ANTWU/audit/documents-preview-final-v4.png), [documents-preview-mobile-final-v4.png](D:/ANTWU/audit/documents-preview-mobile-final-v4.png), [blog-final-mobile-v3.png](D:/ANTWU/audit/blog-final-mobile-v3.png), [gallery-final-1440-latest.png](D:/ANTWU/audit/gallery-final-1440-latest.png), [gallery-final-390-en.png](D:/ANTWU/audit/gallery-final-390-en.png), [contact-cta-flag-final-v3.png](D:/ANTWU/audit/contact-cta-flag-final-v3.png), [contact-cta-flag-mobile.png](D:/ANTWU/audit/contact-cta-flag-mobile.png), [navbar-final-hover-about-titlecase.png](D:/ANTWU/audit/navbar-final-hover-about-titlecase.png), and [navbar-mobile-open-final.png](D:/ANTWU/audit/navbar-mobile-open-final.png).

## Production DNS and deployment verification

- Vercel production deployment is `READY`, with the apex and `www` hostnames attached to the `antwu` project.
- Authoritative nameservers are `ns1.aashatech.com` and `ns2.aashatech.com`; both return `76.76.21.21` for the apex. Cloudflare `1.1.1.1` and Google `8.8.8.8` return the same current value.
- `www.antwu.org.np` is a CNAME to `antwu.org.np` and resolves to `76.76.21.21` through public resolvers. Vercel reports both hostnames as verified and `misconfigured: false`; its `dns-change-recommended` status is an optional newer-record recommendation, not a failure.
- TLS checks pass for both hostnames. Certificates are issued by Let’s Encrypt and cover their respective hostnames through December 9, 2026. The apex, `www`, FAQ, documents, sitemap, robots file and branded `/500` redirect all return expected responses when routed to the current Vercel address.
- The audit machine’s default resolver still cached the previous `188.40.198.146` address during this check, so requests that use that resolver can show the previous host until its cache expires. Public resolver results and direct Vercel-IP checks serve the new deployment correctly.

## Remaining low-priority note

Committee and gallery filters are client state and are not encoded into query parameters, so a filtered view is not deep-linkable. This does not affect navigation, accessibility, or CRUD behavior and can be added as a follow-up enhancement if shareable filtered URLs are needed.
