import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import TopCardsPage from '@/features/top-cards/components/TopCardsPage';
import { generateMetadata as generateMetadataHelper, pageMetadata, commonMetadata } from '@/shared/components/seo';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';
import { slugify, findBySlug, categoryPath } from '@/core/utils/slug';

import categoriesIN from '@/data/cardCategories_in.json';
import categoriesSG from '@/data/cardCategories_sg.json';

const DATA = {
    in: { categories: categoriesIN, images: [] },
    sg: { categories: categoriesSG, images: [] }
};

export const dynamicParams = false;

// Resolves a category slug ("food-and-dining", or a legacy "Food%20%26%20Dining")
// to its display name for the region, or undefined if the region doesn't have it.
function resolveCategory(region, category) {
    const regionData = DATA[region];
    return regionData ? findBySlug(Object.keys(regionData.categories), category) : undefined;
}

export async function generateStaticParams() {
    return Object.entries(DATA).flatMap(([region, { categories }]) =>
        Object.keys(categories).map(name => ({ region, category: slugify(name) }))
    );
}

export async function generateMetadata({ params }) {
    const { category, region } = await params;
    const categoryName = resolveCategory(region, category);
    if (!categoryName) return {};

    const countryName = region === 'sg' ? 'Singapore' : 'India';

    const title = `Best Credit Cards for ${categoryName} in ${countryName} - Top Picks ${new Date().getFullYear()}`;
    const description = `Find the best credit cards for ${categoryName} in ${countryName}. Compare top rated cards for ${categoryName} spending and maximize your rewards.`;

    // hreflang only when the category exists in both regions
    const alternateLanguages = resolveCategory('in', category) && resolveCategory('sg', category)
        ? {
            'en-IN': `${commonMetadata.baseUrl}${categoryPath('in', categoryName)}`,
            'en-SG': `${commonMetadata.baseUrl}${categoryPath('sg', categoryName)}`,
        }
        : null;

    return generateMetadataHelper({
        ...pageMetadata.topCards,
        title,
        description,
        path: categoryPath(region, categoryName),
        alternateLanguages,
    });
}

function getData(region = 'in') {
    const key = region.toLowerCase() === 'sg' ? 'sg' : 'in';
    return DATA[key] || DATA['in'];
}

export default async function TopCardsCategory({ params }) {
    const { region, category } = await params;
    const categoryName = resolveCategory(region, category);
    if (!categoryName) {
        notFound();
    }

    const { categories, images } = getData(region);

    return (
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
            <PerformanceWrapper name="top_cards_category_page">
                <TopCardsPage
                    initialCategories={categories}
                    initialCardImages={images}
                    initialCategory={categoryName}
                />
            </PerformanceWrapper>
        </Suspense>
    );
}
