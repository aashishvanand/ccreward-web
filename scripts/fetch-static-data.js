const fs = require('fs');
const path = require('path');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;

// Load .env.local manually if not in CI/production
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
    'banks_in.json',
    'banks_sg.json',
    'cardCategories_in.json',
    'cardCategories_sg.json',
    'cards_in.json',
    'cards_sg.json',
    'referral_in.json',
    'referral_sg.json',
    'transfer_airline_in.json',
    'transfer_airline_sg.json',
    'transfer_hotel_in.json',
    'transfer_hotel_sg.json'
];

if (!API_KEY) {
    console.warn('⚠️ STATIC_DATA_API_KEY is not set. Skipping data fetch.');
    process.exit(0);
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Configure axios with retry
axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount) => {
        console.log(`⚠️ Rate limit hit. Retrying attempt ${retryCount}...`);
        return retryCount * 2000; // Exponential backoff: 2s, 4s, 6s
    },
    retryCondition: (error) => {
        return error.response?.status === 429 || error.response?.status >= 500;
    }
});

const downloadFile = async (filename) => {
    const url = `${API_BASE_URL}${filename}`;
    const filePath = path.join(DATA_DIR, filename);

    try {
        const response = await axios.get(url, {
            headers: { 'x-api-key': API_KEY },
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);

        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            writer.on('finish', () => {
                writer.close();
                console.log(`✅ Fetched ${filename}`);
                resolve();
            });
            writer.on('error', (err) => {
                writer.close();
                fs.unlink(filePath, () => { });
                reject(err);
            });
        });

    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        throw new Error(`Failed to fetch ${filename}: ${error.message}`);
    }
};

async function fetchAll() {
    console.log('🚀 Starting static data fetch...');
    try {
        // Still fetch sequentially to be nice, but rely on retry for rate limits
        for (const file of FILES_TO_FETCH) {
            await downloadFile(file);
            // Small delay to be polite
            await new Promise(r => setTimeout(r, 500));
        }
        console.log('✨ All static data fetched successfully.');
    } catch (error) {
        console.error('❌ Error fetching static data:', error.message);
        process.exit(1);
    }
}

fetchAll();
