import dynamic from 'next/dynamic';
import { ThemeRegistry } from '../../../core/providers/ThemeRegistry';
import { AuthProvider } from '../../../core/providers/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// --- Step 1: Import local data ---
// removed local imports

const BankPage = dynamic(() => import('../../../features/bank/components/BankPage'), {
    ssr: false,
    loading: () => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <CircularProgress />
        </Box>
    )
});

// --- Step 2: Use local data for getStaticPaths ---
export async function getStaticPaths() {
    let paths = [];
    try {
        const res = await fetch('https://files.ccreward.app/banks_sg.json');
        const bankImagesSG = await res.json();
        paths = bankImagesSG.map((bankObject) => ({
            params: { bankId: bankObject.bank.toLowerCase() },
        }));
    } catch (error) {
        console.error("Failed to fetch banks_sg.json", error);
    }

    return { paths, fallback: false };
}

// --- Step 3: Use local data for getStaticProps ---
export async function getStaticProps({ params }) {
    const { bankId } = params;
    const bankName = bankId.toUpperCase();

    let cards = [];
    try {
        const res = await fetch('https://files.ccreward.app/cards_sg.json');
        const cardsDataSG = await res.json();
        cards = cardsDataSG.issuers[bankName]?.cards || [];
    } catch (error) {
        console.error("Failed to fetch cards_sg.json", error);
    }

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