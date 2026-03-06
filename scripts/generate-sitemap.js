import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'https://ccreward.app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../src/data');
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

function getCardsData(region) {
    try {
        const dataPath = path.join(DATA_DIR, `cards_${region}.json`);
        // If file doesn't exist (e.g. for simple check), return empty
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

    let paths = [
        '/',
        '/calculator',
        '/my-cards',
        '/top-cards',
        '/transfer-calculator',
        '/best-card',
        '/faq',
        '/howto',
        '/privacy',
        '/terms',
        '/mcc-lookup'
    ];

    // India Data
    const cardsIn = getCardsData('in');
    if (cardsIn && cardsIn.issuers) {
        Object.keys(cardsIn.issuers).forEach(bank => {
            const bankLower = encodeURIComponent(bank.toLowerCase());
            // Bank Page
            paths.push(`/in/bank/${bankLower}`);

            // Card Pages
            const cards = cardsIn.issuers[bank].cards;
            if (cards) {
                cards.forEach(card => {
                    const cardSlug = encodeURIComponent(card.toLowerCase());
                    paths.push(`/in/bank/${bankLower}/${cardSlug}`);
                });
            }
        });
    }

    // Singapore Data (if needed/avail, structure might differ, lets assume similar or skip if not focused)
    // Structure: src/data/cards_sg.json ?
    const cardsSg = getCardsData('sg');
    if (cardsSg && cardsSg.issuers) {
        Object.keys(cardsSg.issuers).forEach(bank => {
            const bankLower = encodeURIComponent(bank.toLowerCase());
            paths.push(`/sg/bank/${bankLower}`);
            const cards = cardsSg.issuers[bank].cards;
            if (cards) {
                cards.forEach(card => {
                    const cardSlug = encodeURIComponent(card.toLowerCase()); // URL encoding spcaes
                    paths.push(`/sg/bank/${bankLower}/${cardSlug}`);
                });
            }
        });
    }


    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(url => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${url === '/' ? '1.0' : url.includes('/bank/') && !url.split('/').pop().includes('%20') ? '0.8' : '0.6'}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, sitemap);
    console.log(`Sitemap generated with ${paths.length} URLs at ${SITEMAP_PATH}`);
}

generateSitemap();
