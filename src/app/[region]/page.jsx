import HomeClient from '../HomeClient';

// Only allow valid region values - reject everything else so Pages Router can handle those routes
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
    const upperRegion = region.toUpperCase();

    return {
        title: `Credit Card Rewards Calculator ${upperRegion} - Maximize Your Benefits`,
        description: `Compare, calculate, and choose the best credit card rewards in ${upperRegion} with ccreward. Optimize your spending with our advanced calculator.`,
        alternates: {
            canonical: `https://ccreward.app/${region}`,
        },
    };
}

export default async function RegionPage({ params }) {
    const resolvedParams = await params;
    const { region } = resolvedParams;
    return <HomeClient region={region} />;
}
