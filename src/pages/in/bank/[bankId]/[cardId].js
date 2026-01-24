
import dynamic from 'next/dynamic';
import { ThemeRegistry } from '@/core/providers/ThemeRegistry';
import { AuthProvider } from '@/core/providers/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// Import local data
import cardsDataIN from '@/data/cards_in.json';

const CardPage = dynamic(() => import('@/features/card/components/CardPage'), {
    ssr: false,
    loading: () => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <CircularProgress />
        </Box>
    )
});

export async function getStaticPaths() {
    const paths = [];

    Object.entries(cardsDataIN.issuers).forEach(([bankName, bankData]) => {
        bankData.cards.forEach(cardName => {
            paths.push({
                params: {
                    bankId: bankName.toLowerCase(),
                    cardId: cardName.toLowerCase()
                }
            });
        });
    });

    return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
    const { bankId, cardId } = params;

    // Find the exact casing for bankName and cardName from the JSON
    const bankKey = Object.keys(cardsDataIN.issuers).find(
        k => k.toLowerCase() === bankId.toLowerCase()
    );

    if (!bankKey) {
        return { notFound: true };
    }

    const cardName = cardsDataIN.issuers[bankKey].cards.find(
        c => c.toLowerCase() === cardId.toLowerCase() // Simple lowercase match might be risky for URL decoding?
        // Actually cardId from URL will be lowercased by Next.js if I generated it lowercased.
        // But we need the original casing for the API.
    );

    // Better logic to find card name:
    // The params.cardId comes from the URL. In getStaticPaths we lowercased it.
    // So we match against lowercased version of cards in the list.
    const originalCardName = cardsDataIN.issuers[bankKey].cards.find(
        c => c.toLowerCase() === cardId // cardId is already lowercased from params
    );


    if (!originalCardName) {
        return { notFound: true };
    }

    return {
        props: {
            bankName: bankKey,
            cardName: originalCardName,
            country: 'in'
        },
    };
}

// --- Step 4: Import SEO Component ---
import SEOHead from '@/shared/components/seo/SEOHead';

function CardRouteIN({ bankName, cardName, country }) {
    const title = `${cardName} Review, Benefits & Rewards - ${new Date().getFullYear()} | ccreward`;
    const description = `Maximize rewards with ${cardName} from ${bankName}. Calculate specific rewards, check lounge access, and find best usage strategies using ccreward.`;
    const url = `https://ccreward.app/${country}/bank/${bankName.toLowerCase()}/${cardName.toLowerCase().replace(/ /g, '%20')}`;

    // JSON-LD for Financial Product
    // Note: Skipping complex fees/points data for now.
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": cardName,
        "description": description,
        "brand": {
            "@type": "Brand",
            "name": bankName
        },
        "url": url,
        "category": "Credit Card",
        "audience": {
            "@type": "Audience",
            "audienceType": "Credit Card Users in India"
        }
    };

    const metadata = {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
            type: 'website',
            // We could add image here if available in a map or fetched, but skipping dynamic image for now if not easily available synchronously
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description
        },
        alternates: {
            canonical: url
        },
        jsonLd
    };

    return (
        <ThemeRegistry>
            <AuthProvider>
                <SEOHead metadata={metadata} />
                <CardPage bankName={bankName} cardName={cardName} country={country} />
            </AuthProvider>
        </ThemeRegistry>
    );
}

export default CardRouteIN;
