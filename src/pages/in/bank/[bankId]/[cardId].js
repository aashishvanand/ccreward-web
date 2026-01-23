
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

function CardRouteIN({ bankName, cardName, country }) {
    return (
        <ThemeRegistry>
            <AuthProvider>
                <CardPage bankName={bankName} cardName={cardName} country={country} />
            </AuthProvider>
        </ThemeRegistry>
    );
}

export default CardRouteIN;
