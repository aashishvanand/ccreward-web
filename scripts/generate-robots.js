// Writes public/robots.txt so it's served as a static asset instead of by the worker.
// DEPLOY_ENV=dev (set by `npm run deploy:dev`) blocks everything; anything else gets the
// production rules. Run as part of prebuild:site, so each deploy writes its own file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../public/robots.txt');

const ALLOW = [
    '/',
    '/og.png',
    '/og1.png',
    '/ccreward_light.png',
    '/ccreward_dark.png',
    '/favicon.ico',
    '/*.png',
    '/*.ico',
    '/site.webmanifest',
    '/llms.txt',
];

// Pages that need sign-in; their public explainers live at other URLs
const DISALLOW = ['/my-cards', '/calculator', '/best-card', '/transfer-calculator', '/mcc-lookup'];

const isDev = process.env.DEPLOY_ENV === 'dev';

const body = isDev
    ? 'User-Agent: *\nDisallow: /\n'
    : [
        'User-Agent: *',
        ...ALLOW.map((p) => `Allow: ${p}`),
        ...DISALLOW.map((p) => `Disallow: ${p}`),
        '',
        'Sitemap: https://ccreward.app/sitemap.xml',
        '',
    ].join('\n');

fs.writeFileSync(OUT, body);
console.log(`✅ Wrote public/robots.txt (${isDev ? 'dev: Disallow /' : 'production'})`);
