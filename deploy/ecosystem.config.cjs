module.exports = {
  apps: [{
    name: 'antwu-web',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/antwu',
    instances: 1,
    exec_mode: 'fork',
    env: { NODE_ENV: 'production', PORT: 3000, HOSTNAME: '127.0.0.1', ANTWU_DB_PATH: '/var/lib/antwu/antwu.sqlite', NEXT_PUBLIC_SITE_URL: 'https://antwu.org.np', TRUST_PROXY: 'true' },
  }],
};
