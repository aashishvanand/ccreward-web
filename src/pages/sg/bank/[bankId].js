import dynamic from 'next/dynamic';
import { ThemeRegistry } from '@/core/providers/ThemeRegistry';
import { AuthProvider } from '@/core/providers/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// --- Step 1: Import local data ---
import bankImagesSG from '@/data/banks_sg.json';
import cardsDataSG from '@/data/cards_sg.json';

const BankPage = dynamic(() => import('@/features/bank/components/BankPage'), {
    ssr: false,
    loading: () => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <CircularProgress />
        </Box>
    )
});

// --- Step 2: Use local data for getStaticPaths ---
export async function getStaticPaths() {
    const paths = bankImagesSG.map((bankObject) => ({
        params: { bankId: bankObject.bank.toLowerCase() },
    }));

    return { paths, fallback: false };
}

// --- Step 3: Use local data for getStaticProps ---
export async function getStaticProps({ params }) {
    const { bankId } = params;
    const bankName = bankId.toUpperCase();

    // No fetch needed, just access the imported JSON directly
    const cards = cardsDataSG.issuers[bankName]?.cards || [];

    return {
        props: {
            bank: bankName,
            cards,
        },
    };
}

function BankRouteSG({ bank, cards }) {
    return (
        <ThemeRegistry>
            <AuthProvider>
                <BankPage bank={bank} cards={cards} />
            </AuthProvider>
        </ThemeRegistry>
    );
}

export default BankRouteSG;