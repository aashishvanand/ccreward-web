
import TopCardsPage from '@/features/top-cards/components/TopCardsPage';
import { generateMetadata as generateMetadataHelper, pageMetadata } from '@/shared/components/seo';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

// Categories list matching TopCardsPage.jsx
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

export const revalidate = 86400; // Revalidate every 24 hours

export async function generateStaticParams() {
    const regions = ['in', 'sg'];
    let params = [];

    for (const region of regions) {
        for (const category of CATEGORIES) {
            params.push({ region, category });
        }
    }

    return params;
}

export async function generateMetadata({ params }) {
    const { category, region } = await params;
    const countryName = region.toLowerCase() === 'sg' ? 'Singapore' : 'India';
    const decodedCategory = decodeURIComponent(category);

    let title = `Best Credit Cards for ${decodedCategory} in ${countryName} - Top Picks ${new Date().getFullYear()} | ccreward`;
    let description = `Find the best credit cards for ${decodedCategory} in ${countryName}. Compare top rated cards for ${decodedCategory} spending and maximize your rewards.`;

    return generateMetadataHelper({
        ...pageMetadata.topCards,
        title,
        description,
        path: `/${region}/top-cards/${category}`
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

export default async function TopCardsCategory({ params }) {
    const { region, category } = await params;
    const decodedCategory = decodeURIComponent(category);

    // Ensure accurate region passing
    const targetRegion = region || 'in';

    const { categories, images } = await getData(targetRegion.toLowerCase());

    return (
        <PerformanceWrapper name="top_cards_category_page">
            <TopCardsPage
                initialCategories={categories}
                initialCardImages={images}
                initialCategory={decodedCategory}
            />
        </PerformanceWrapper>
    );
}
