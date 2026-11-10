import { notFound } from 'next/navigation';
import ToolExplainerPage from '@/features/tools/components/ToolExplainerPage';
import { TOOL_PAGES, getToolPage } from '@/features/tools/toolPages';
import { serializeJsonLd } from '@/core/utils/jsonLd';

export const dynamicParams = false;

const BASE_URL = 'https://ccreward.app';

export async function generateStaticParams() {
    return TOOL_PAGES.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }) {
    const tool = getToolPage((await params).tool);
    if (!tool) return {};
    const url = `${BASE_URL}/tools/${tool.slug}`;
    return {
        title: tool.title,
        description: tool.description,
        alternates: { canonical: url },
        openGraph: { title: tool.title, description: tool.description, url, type: 'website' },
        twitter: { card: 'summary_large_image', title: tool.title, description: tool.description },
    };
}

export default async function ToolPage({ params }) {
    const tool = getToolPage((await params).tool);
    if (!tool) notFound();

    const url = `${BASE_URL}/tools/${tool.slug}`;
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: `ccreward ${tool.name}`,
            url: `${BASE_URL}${tool.toolPath}`,
            description: tool.description,
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0' },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: tool.faqs.map(([q, a]) => ({
                '@type': 'Question',
                name: q,
                acceptedAnswer: { '@type': 'Answer', text: a },
            })),
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
                { '@type': 'ListItem', position: 2, name: 'Tools', item: `${BASE_URL}/tools` },
                { '@type': 'ListItem', position: 3, name: tool.name, item: url },
            ],
        },
    ];

    // Plain data only across the client boundary
    const others = TOOL_PAGES.filter((t) => t.slug !== tool.slug).map(({ slug, name }) => ({ slug, name }));

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
            <ToolExplainerPage tool={tool} others={others} />
        </>
    );
}
