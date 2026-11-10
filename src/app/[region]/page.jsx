import HomeClient from '../HomeClient';
import { getLandingBrowseData } from '@/features/landing/landingBrowseData';
import { getCardStats } from '@/core/utils/cardStats';

// Only allow valid region values
export const dynamicParams = false;

export async function generateStaticParams() {
    return [
        { region: 'in' },
        { region: 'sg' },
    ];
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { region } = resolvedParams;
    const countryName = region === 'sg' ? 'Singapore' : 'India';

    const title = `ccreward ${countryName} - Compare & Maximize Credit Card Rewards`;
    const description = `ccreward helps you compare and maximize credit card rewards in ${countryName}. Find the best card for your spending, check reward points, airport lounge access, and optimize your benefits.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://ccreward.app/${region}`,
            languages: {
                'en-IN': 'https://ccreward.app/in',
                'en-SG': 'https://ccreward.app/sg',
            },
        },
        openGraph: {
            title,
            description,
            url: `https://ccreward.app/${region}`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function RegionPage({ params }) {
    const { region } = await params;
    return <HomeClient region={region} cardStats={getCardStats()} browse={getLandingBrowseData()} />;
}
