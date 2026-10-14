import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { bankPath, cardPath, categoryPath } from '../src/core/utils/slug.js';

const BASE_URL = 'https://ccreward.app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');
const SITEMAP_PATH = path.join(ROOT_DIR, 'public/sitemap.xml');

// Per-URL content hash + the date that content last changed. Committed to git
// so <lastmod> only moves when a page's content actually changes, not on every
// build (Google ignores lastmod values that are consistently inaccurate).
const LASTMOD_PATH = path.join(__dirname, 'sitemap-lastmod.json');

const REGIONS = ['in', 'sg'];

function readJson(filePath) {
    try {
        if (!fs.existsSync(filePath)) return null;
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
        return null;
    }
}

const hash = (value) =>
    crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);

// Last commit date (YYYY-MM-DD) touching any of the given source paths
function gitDate(paths) {
    try {
        const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...paths], {
            cwd: ROOT_DIR,
            encoding: 'utf8',
        }).trim();
        return out || null;
    } catch {
        return null;
    }
}

function generateSitemap() {
    console.log('Generating sitemap...');

    const today = new Date().toISOString().split('T')[0];
    const previous = readJson(LASTMOD_PATH) || {};
    const next = {};
    const urls = [];

    // Data-driven pages: lastmod moves when the hash of their input data changes
    const addDataUrl = (urlPath, content) => {
        const contentHash = hash(content);
        const prev = previous[urlPath];
        const lastmod = prev && prev.hash === contentHash ? prev.lastmod : today;
        next[urlPath] = { hash: contentHash, lastmod };
        urls.push({ path: urlPath, lastmod });
    };

    // Source-driven pages: lastmod is the last commit touching their source
    const addSourceUrl = (urlPath, sourcePaths) => {
        urls.push({ path: urlPath, lastmod: gitDate(sourcePaths) || today });
    };

    // ===== Static pages =====
    addSourceUrl('/', ['src/app/page.jsx', 'src/app/HomeClient.jsx', 'src/features/landing']);
    addSourceUrl('/faq', ['src/app/faq']);
    addSourceUrl('/in/howto', ['src/app/[region]/howto']);
    addSourceUrl('/sg/howto', ['src/app/[region]/howto']);
    addSourceUrl('/privacy', ['src/app/privacy']);
    addSourceUrl('/terms', ['src/app/terms']);

    for (const region of REGIONS) {
        const cardsData = readJson(path.join(DATA_DIR, `cards_${region}.json`));
        const categories = readJson(path.join(DATA_DIR, `cardCategories_${region}.json`)) || {};
        if (!cardsData?.issuers) continue;

        // Region home lists banks and card counts
        addDataUrl(`/${region}`, Object.entries(cardsData.issuers).map(([bank, { cards }]) => [bank, cards.length]));

        // Top cards: only categories that exist for this region
        addDataUrl(`/${region}/top-cards`, Object.keys(categories));
        for (const [name, category] of Object.entries(categories)) {
            addDataUrl(categoryPath(region, name), category.cards);
        }

        // Bank & card pages
        for (const [bank, { cards = [] }] of Object.entries(cardsData.issuers)) {
            addDataUrl(bankPath(region, bank), cards);

            for (const card of cards) {
                const topPicks = Object.values(categories).map(c => [
                    c.name,
                    c.cards.findIndex(x => x.bank === bank && x.cardName === card),
                ]);
                addDataUrl(cardPath(region, bank, card), { cards, topPicks });
            }
        }
    }

    // NOTE: Intentionally excluding pages blocked by robots.txt:
    // /calculator, /my-cards, /best-card, /transfer-calculator, /mcc-lookup
    // Also excluding /howto (root) since it redirects to /in/howto

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ path: urlPath, lastmod }) => `  <url>
    <loc>${BASE_URL}${urlPath}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>
`;

    fs.writeFileSync(SITEMAP_PATH, sitemap);
    fs.writeFileSync(LASTMOD_PATH, `${JSON.stringify(next, null, 2)}\n`);
    console.log(`Sitemap generated with ${urls.length} URLs at ${SITEMAP_PATH}`);
}

generateSitemap();
