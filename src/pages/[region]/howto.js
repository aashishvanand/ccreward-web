
import HowToPage from '@/features/how-to/HowToGuide';
import axios from 'axios';
import SEOHead from '@/shared/components/seo/SEOHead';
import { generateMetadata } from '@/shared/components/seo';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

export async function getStaticPaths() {
    return {
        paths: [
            { params: { region: 'in' } },
            { params: { region: 'sg' } },
        ],
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const region = params.region.toLowerCase();

    // Validate region again just in case
    if (!['in', 'sg'].includes(region)) {
        return { notFound: true };
    }

    const platforms = ["ios", "android", "web"];
    const guides = {};

    try {
        await Promise.all(
            platforms.map(async (platform) => {
                try {
                    const response = await axios.get(
                        `https://files.ccreward.app/guides/${region}/${platform}-guides.json`
                    );
                    guides[platform] = response.data;
                } catch (err) {
                    console.error(`Error loading ${platform} guides on server:`, err);
                    guides[platform] = { platform, topics: [] };
                }
            })
        );
    } catch (err) {
        console.error("Error loading guide data on server:", err);
    }

    return {
        props: {
            initialGuidesData: guides,
            region
        },
        revalidate: 86400, // Revalidate every 24 hours
    };
}

export default function HowToRoute({ initialGuidesData, region }) {
    const countryName = region === 'sg' ? 'Singapore' : 'India';

    const metadata = generateMetadata({
        title: `How To Guide - ccreward ${countryName}`,
        description: `Comprehensive guides for using the ccreward app in ${countryName}`,
        path: `/${region}/howto`
    });

    return (
        <PerformanceWrapper name="how_to_page">
            <SEOHead metadata={metadata} />
            <HowToPage initialGuidesData={initialGuidesData} />
        </PerformanceWrapper>
    );
}
