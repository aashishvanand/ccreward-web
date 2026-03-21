
import TopCardsPage from '@/features/top-cards/components/TopCardsPage';
import { generateMetadata as generateMetadataHelper, pageMetadata, commonMetadata } from '@/shared/components/seo';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

import categoriesIN from '@/data/cardCategories_in.json';
import categoriesSG from '@/data/cardCategories_sg.json';

const DATA = {
    in: { categories: categoriesIN, images: [] },
    sg: { categories: categoriesSG, images: [] }
};

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

    let title = `Best Credit Cards for ${decodedCategory} in ${countryName} - Top Picks ${new Date().getFullYear()}`;
    let description = `Find the best credit cards for ${decodedCategory} in ${countryName}. Compare top rated cards for ${decodedCategory} spending and maximize your rewards.`;

    return generateMetadataHelper({
        ...pageMetadata.topCards,
        title,
        description,
        path: `/${region}/top-cards/${category}`,
        alternateLanguages: {
            'en-IN': `${commonMetadata.baseUrl}/in/top-cards/${category}`,
            'en-SG': `${commonMetadata.baseUrl}/sg/top-cards/${category}`,
        },
    });
}

function getData(region = 'in') {
    const key = region.toLowerCase() === 'sg' ? 'sg' : 'in';
    return DATA[key] || DATA['in'];
}

export default async function TopCardsCategory({ params }) {
    const { region, category } = await params;
    const decodedCategory = decodeURIComponent(category);

    // Ensure accurate region passing
    const targetRegion = region || 'in';

    const { categories, images } = getData(targetRegion.toLowerCase());

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
