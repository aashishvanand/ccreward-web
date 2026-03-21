import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'https://ccreward.app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../src/data');
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

// Categories matching the TopCardsPage route generation
const CATEGORIES = [
    "Education",
    "Entertainment",
    "Food & Dining",
    "Government/Tax",
    "Groceries",
    "Healthcare & Medical",
    "Insurance",
    "International Spends",
    "Jewellery",
    "Offline Shopping",
    "Online Shopping",
    "Petrol",
    "Travel & Transportation",
    "Utility Bill",
    "Wallet Loading",
];

function getCardsData(region) {
    try {
        const dataPath = path.join(DATA_DIR, `cards_${region}.json`);
        if (!fs.existsSync(dataPath)) return null;
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error(`Error reading cards_${region}.json:`, e);
        return null;
    }
}

function generateSitemap() {
    console.log('Generating sitemap...');

    const today = new Date().toISOString().split('T')[0];

    // URL entries with priority and changefreq
    const urls = [];

    // Helper to add URL with metadata
    const addUrl = (path, priority = 0.6, changefreq = 'weekly') => {
        urls.push({ path, priority, changefreq });
    };

    // ===== Static pages =====
    addUrl('/', 1.0, 'daily');

    // Region home pages
    addUrl('/in', 0.9, 'daily');
    addUrl('/sg', 0.9, 'daily');

    // Informational pages
    addUrl('/faq', 0.5, 'monthly');
    addUrl('/in/howto', 0.5, 'monthly');
    addUrl('/sg/howto', 0.5, 'monthly');
    addUrl('/privacy', 0.3, 'yearly');
    addUrl('/terms', 0.3, 'yearly');

    // Top cards pages (index)
    addUrl('/in/top-cards', 0.8, 'weekly');
    addUrl('/sg/top-cards', 0.8, 'weekly');

    // Top cards category pages
    for (const category of CATEGORIES) {
        const encodedCategory = encodeURIComponent(category);
        addUrl(`/in/top-cards/${encodedCategory}`, 0.7, 'weekly');
        addUrl(`/sg/top-cards/${encodedCategory}`, 0.7, 'weekly');
    }

    // ===== Dynamic bank & card pages =====
    const regions = ['in', 'sg'];
    for (const region of regions) {
        const cardsData = getCardsData(region);
        if (!cardsData || !cardsData.issuers) continue;

        Object.keys(cardsData.issuers).forEach(bank => {
            const bankLower = encodeURIComponent(bank.toLowerCase());

            // Bank page
            addUrl(`/${region}/bank/${bankLower}`, 0.8, 'weekly');

            // Card pages
            const cards = cardsData.issuers[bank].cards;
            if (cards) {
                cards.forEach(card => {
                    const cardSlug = encodeURIComponent(card.toLowerCase());
                    addUrl(`/${region}/bank/${bankLower}/${cardSlug}`, 0.6, 'weekly');
                });
            }
        });
    }

    // NOTE: Intentionally excluding pages blocked by robots.txt:
    // /calculator, /my-cards, /best-card, /transfer-calculator, /mcc-lookup
    // Also excluding /howto (root) since it redirects to /in/howto

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ path: urlPath, priority, changefreq }) => `  <url>
    <loc>${BASE_URL}${urlPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, sitemap);
    console.log(`Sitemap generated with ${urls.length} URLs at ${SITEMAP_PATH}`);
}

generateSitemap();
