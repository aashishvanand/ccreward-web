import TopCardsPage from '../../features/top-cards/components/TopCardsPage';
import { generateMetadata as generateMetadataHelper, pageMetadata } from '../../shared/components/seo';
import PerformanceWrapper from '../../shared/components/PerformanceWrapper';

export async function generateMetadata({ searchParams }) {
    const { category, region = 'in' } = await searchParams;
    const countryName = region.toLowerCase() === 'sg' ? 'Singapore' : 'India';

    let title = `Top Credit Cards in ${countryName} - Compare Best Rewards Cards | ccreward`;
    let description = `Discover and compare the best credit cards in ${countryName}. Find cards with the highest rewards, cashback, and benefits for your spending habits.`;

    if (category) {
        title = `Best Credit Cards for ${category} in ${countryName} - Top Picks ${new Date().getFullYear()} | ccreward`;
        description = `Find the best credit cards for ${category} in ${countryName}. Compare top rated cards for ${category} spending and maximize your rewards.`;
    }

    return generateMetadataHelper({
        ...pageMetadata.topCards,
        title,
        description,
        path: '/top-cards'
    });
}

async function getData(region = 'in') {
    const [categoriesRes, imagesRes] = await Promise.all([
        fetch(`https://files.ccreward.app/cardCategories_${region}.json`),
        fetch(`https://files.ccreward.app/cardImages_${region}.json`)
    ]);

    // Handle errors / fallback
    const categories = categoriesRes.ok ? await categoriesRes.json() : null;
    const images = imagesRes.ok ? await imagesRes.json() : [];

    return { categories, images };
}

export default async function TopCards({ searchParams }) {
    const { region } = await searchParams; // searchParams is a promise in Next.js 15+ (and maybe 14+), better await it just in case or use it if it's object
    // Next.js docs say searchParams is an object in pages, but good to check version. Package.json says "next": "^16.1.0". 
    // In Next 15, params and searchParams are promises.

    const targetRegion = region || 'in';

    const { categories, images } = await getData(targetRegion.toLowerCase());

    return (
        <PerformanceWrapper name="top_cards_page">
            <TopCardsPage initialCategories={categories} initialCardImages={images} />
        </PerformanceWrapper>
    );
}
