const fs = require('fs');
const path = require('path');
const https = require('https');

// Load .env.local manually if not in CI/production
const loadedEnv = {};
if (!process.env.STATIC_DATA_API_KEY || !process.env.NEXT_PUBLIC_API_BASE_URL) {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes if present
                if (key === 'STATIC_DATA_API_KEY') process.env.STATIC_DATA_API_KEY = value;
                if (key === 'NEXT_PUBLIC_API_BASE_URL') process.env.NEXT_PUBLIC_API_BASE_URL = value;
            }
        });
    }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/v3/static/`;
const DATA_DIR = path.join(__dirname, '../src/data');
const API_KEY = process.env.STATIC_DATA_API_KEY;

const FILES_TO_FETCH = [
    'airline_logo.json',
    'banks_in.json',
    'banks_sg.json',
    'cardCategories_in.json',
    'cardCategories_sg.json',
    'cardImages_in.json',
    'cardImages_sg.json',
    'cardNetworks_in.json',
    'cardNetworks_sg.json',
    'cards_in.json',
    'cards_sg.json',
    'hotel_logo.json',
    'referral_in.json',
    'referral_sg.json',
    'transfer_airline_in.json',
    'transfer_airline_sg.json',
    'transfer_hotel_in.json',
    'transfer_hotel_sg.json'
];

if (!API_KEY) {
    console.warn('⚠️ STATIC_DATA_API_KEY is not set. Skipping data fetch.');
    // We exit with 0 so the build doesn't fail if the key is missing in dev environments,
    // assuming local data might exist or be optional for dev.
    // However, for production builds, this might need to fail. 
    // Given the user request "pull these files during build", let's assume valid key is provided for prod.
    // Ideally we should fail if CI=true or similar, but a warning is safer for now.
    process.exit(0);
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const downloadFile = (filename) => {
    return new Promise((resolve, reject) => {
        const url = `${API_BASE_URL}${filename}`;
        const filePath = path.join(DATA_DIR, filename);
        const file = fs.createWriteStream(filePath);

        const options = {
            headers: {
                'x-api-key': API_KEY
            }
        };

        https.get(url, options, (response) => {
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(filePath, () => { }); // Delete empty file
                reject(new Error(`Failed to fetch ${filename}: Status Code ${response.statusCode}`));
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`✅ Fetched ${filename}`);
                resolve();
            });

            file.on('error', (err) => {
                fs.unlink(filePath, () => { });
                reject(err);
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => { });
            reject(err);
        });
    });
};

async function fetchAll() {
    console.log('🚀 Starting static data fetch...');
    try {
        await Promise.all(FILES_TO_FETCH.map(file => downloadFile(file)));
        console.log('✨ All static data fetched successfully.');
    } catch (error) {
        console.error('❌ Error fetching static data:', error.message);
        process.exit(1);
    }
}

fetchAll();
