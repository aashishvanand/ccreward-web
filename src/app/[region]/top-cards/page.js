
import TopCardsPage from '@/features/top-cards/components/TopCardsPage';
import { generateMetadata as generateMetadataHelper, pageMetadata } from '@/shared/components/seo';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

export const revalidate = 86400; // Revalidate every 24 hours

export async function generateStaticParams() {
    return [
        { region: 'in' },
        { region: 'sg' },
    ];
}

export async function generateMetadata({ params }) {
    const { region } = await params;
    const countryName = region.toLowerCase() === 'sg' ? 'Singapore' : 'India';

    let title = `Top Credit Cards in ${countryName} - Compare Best Rewards Cards | ccreward`;
    let description = `Discover and compare the best credit cards in ${countryName}. Find cards with the highest rewards, cashback, and benefits for your spending habits.`;

    return generateMetadataHelper({
        ...pageMetadata.topCards,
        title,
        description,
        path: `/${region}/top-cards`
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

export default async function TopCards({ params }) {
    const { region } = await params;

    // Ensure accurate region passing
    const targetRegion = region || 'in';

    const { categories, images } = await getData(targetRegion.toLowerCase());

    return (
        <PerformanceWrapper name="top_cards_page">
            <TopCardsPage initialCategories={categories} initialCardImages={images} />
        </PerformanceWrapper>
    );
}
