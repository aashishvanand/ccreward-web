
import dynamic from 'next/dynamic';
import { ThemeRegistry } from '@/core/providers/ThemeRegistry';
import { AuthProvider } from '@/core/providers/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// Import local data
import cardsDataSG from '@/data/cards_sg.json';

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

    Object.entries(cardsDataSG.issuers).forEach(([bankName, bankData]) => {
        bankData.cards.forEach(cardName => {
            paths.push({
                params: {
                    bankId: bankName.toLowerCase(),
                    cardId: cardName.toLowerCase()
                }
            });
        });
    });

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const { bankId, cardId } = params;

    // Find the exact casing for bankName and cardName from the JSON
    const bankKey = Object.keys(cardsDataSG.issuers).find(
        k => k.toLowerCase() === bankId.toLowerCase()
    );

    if (!bankKey) {
        return { notFound: true };
    }

    const originalCardName = cardsDataSG.issuers[bankKey].cards.find(
        c => c.toLowerCase() === cardId
    );


    if (!originalCardName) {
        return { notFound: true };
    }

    return {
        props: {
            bankName: bankKey,
            cardName: originalCardName,
            country: 'sg'
        },
    };
}

function CardRouteSG({ bankName, cardName, country }) {
    return (
        <ThemeRegistry>
            <AuthProvider>
                <CardPage bankName={bankName} cardName={cardName} country={country} />
            </AuthProvider>
        </ThemeRegistry>
    );
}

export default CardRouteSG;
