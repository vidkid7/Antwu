# Deployment notes

ANTWU runs as a small Node.js 24 service behind Nginx and PM2. The application stores content, sessions, and media metadata in a SQLite database, so the database and `.local` directory must persist between releases.

1. Install Node.js 24.12+, Nginx, and PM2 on the server.
2. Copy the repository, run `npm ci`, and copy `.env.example` to `.env`.
3. Set `ANTWU_DB_PATH` to a persistent absolute path, `NEXT_PUBLIC_SITE_URL` to the public HTTPS URL, and `TRUST_PROXY=true` when Nginx is the trusted proxy. (`1` is also accepted.) Set `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD` for unattended first-admin setup, or run `npm run admin:setup` interactively.
4. Run `npm run build`, then `pm2 start deploy/ecosystem.config.cjs` and `pm2 save`.
5. Obtain the `antwu.org.np` certificate (Certbot is recommended), copy `deploy/nginx.conf` to `/etc/nginx/sites-available/antwu`, verify the certificate paths, create the `sites-enabled` symlink, run `nginx -t`, and reload Nginx. The included config redirects HTTP to HTTPS and sends HSTS after TLS is active.
6. Back up the SQLite database and media stored in the configured data directory. Restrict filesystem permissions so only the service account can read private membership attachments.

The production app validates localized content and uploads, limits login and public form requests, enforces same-origin writes, and serves private submission files only to authenticated administrators. Change the generated administrator password after the first sign-in and rotate it if an account is shared.
