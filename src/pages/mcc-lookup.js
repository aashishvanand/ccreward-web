import dynamic from 'next/dynamic';
import Head from 'next/head';
import { generateMetadata } from '@/shared/components/seo';

const MccLookupWrapper = dynamic(() => import('@/features/mcc/components/MccLookup'), { ssr: false });

const metadata = {
    title: "MCC Code Lookup Tool - Find Merchant Category Codes | ccreward",
    description: "Search and find Merchant Category Codes (MCC) by merchant name. Identify merchant categories and industry classifications instantly.",
    keywords: "MCC lookup, merchant category code, mcc search, credit card mcc, merchant codes",
    path: '/mcc-lookup',
    jsonLd: [{
        "@type": "WebApplication",
        "name": "ccreward MCC Lookup Tool",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "description": "Search and find Merchant Category Codes (MCC) by merchant name."
    }]
};

// Next.js Pages router uses Head component or getStaticProps/getServerSideProps for metadata
// But the project seems to use a Custom SEO component or generateMetadata helper.
// Looking at calculator.js: export const metadata = generateMetadata(...) 
// but wait, calculator.js exports metadata which is an App Router pattern?
// src/pages/calculator.js is in `src/pages` so it is Pages Router. 
// Exporting `metadata` from a Page component in Pages Router doesn't do anything automatically unless `_app.js` or `_document.js` handles it.
// Let's check shared/components/seo/generateMetadata.js if possible.
// However, since I see `export const metadata = ...` in `calculator.js`, I will follow that pattern.
// AND I will also add a Head component just in case.

export default function MccLookupPage() {
    return (
        <>
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <meta name="keywords" content={metadata.keywords} />
                {/* Open Graph */}
                <meta property="og:title" content={metadata.title} />
                <meta property="og:description" content={metadata.description} />
                <meta property="og:url" content={`https://ccreward.app${metadata.path}`} />
                <meta property="og:type" content="website" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={metadata.title} />
                <meta name="twitter:description" content={metadata.description} />
            </Head>
            <MccLookupWrapper />
        </>
    );
}
