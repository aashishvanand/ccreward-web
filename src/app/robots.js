import { headers } from 'next/headers';

export default async function robots() {
    const headersList = await headers();
    const host = headersList.get('host');

    // Check if we are in dev environment (dev.ccreward.app)
    const isDevEnvironment = host?.includes('dev.ccreward.app');

    if (isDevEnvironment) {
        return {
            rules: {
                userAgent: '*',
                disallow: '/',
            },
        };
    }

    // Production Rules
    return {
        rules: {
            userAgent: '*',
            allow: [
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
            ],
            disallow: [
                '/my-cards',
                '/calculator',
                '/best-card',
                '/transfer-calculator',
                '/mcc-lookup',
            ],
        },
        sitemap: [
            'https://ccreward.app/sitemap.xml',
            'https://ccreward.app/llms.txt',
        ],
    };
}
