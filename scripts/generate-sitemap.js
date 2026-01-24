const fs = require('fs');
const path = require('path');
const glob = require('glob'); // You might need to install 'glob' if not present, but usually 'fs' is enough if we know paths.
// We'll use fs and standard loops to avoid external deps if possible, or assume simple structure.
// Actually, I can require the JSON files directly as they are in src/data.

const BASE_URL = 'https://ccreward.app';

// Import data
// Note: We need to handle ES modules vs CommonJS. The project seems to use "type": "module"? 
// Let's check package.json. If it's a mix or Next.js handles it, scripts might need plain node.
// Safer to read JSON files using fs to avoid module issues in a standalone script.

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
            const bankLower = bank.toLowerCase();
            // Bank Page
            paths.push(`/in/bank/${bankLower}`);

            // Card Pages
            const cards = cardsIn.issuers[bank].cards;
            if (cards) {
                cards.forEach(card => {
                    const cardSlug = card.toLowerCase().replace(/ /g, '%20');
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
            const bankLower = bank.toLowerCase();
            paths.push(`/sg/bank/${bankLower}`);
            const cards = cardsSg.issuers[bank].cards;
            if (cards) {
                cards.forEach(card => {
                    const cardSlug = card.toLowerCase().replace(/ /g, '%20'); // URL encoding spcaes
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
