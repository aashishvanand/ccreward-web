
import TopCardsPage from '@/features/top-cards/components/TopCardsPage';
import { generateMetadata as generateMetadataHelper, pageMetadata, commonMetadata } from '@/shared/components/seo';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

import categoriesIN from '@/data/cardCategories_in.json';
import categoriesSG from '@/data/cardCategories_sg.json';

const DATA = {
    in: { categories: categoriesIN, images: [] },
    sg: { categories: categoriesSG, images: [] }
};

export async function generateStaticParams() {
    return [
        { region: 'in' },
        { region: 'sg' },
    ];
}

export async function generateMetadata({ params }) {
    const { region } = await params;
    const countryName = region.toLowerCase() === 'sg' ? 'Singapore' : 'India';

    let title = `Top Credit Cards in ${countryName} - Compare Best Rewards Cards`;
    let description = `Discover and compare the best credit cards in ${countryName}. Find cards with the highest rewards, cashback, and benefits for your spending habits.`;

    return generateMetadataHelper({
        ...pageMetadata.topCards,
        title,
        description,
        path: `/${region}/top-cards`,
        alternateLanguages: {
            'en-IN': `${commonMetadata.baseUrl}/in/top-cards`,
            'en-SG': `${commonMetadata.baseUrl}/sg/top-cards`,
        },
    });
}

function getData(region = 'in') {
    const key = region.toLowerCase() === 'sg' ? 'sg' : 'in';
    return DATA[key] || DATA['in'];
}

export default async function TopCards({ params }) {
    const { region } = await params;

    // Ensure accurate region passing
    const targetRegion = region || 'in';

    const { categories, images } = getData(targetRegion.toLowerCase());

    return (
        <PerformanceWrapper name="top_cards_page">
            <TopCardsPage initialCategories={categories} initialCardImages={images} />
        </PerformanceWrapper>
    );
}
