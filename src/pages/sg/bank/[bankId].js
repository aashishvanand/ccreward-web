// src/pages/sg/bank/[bankId].js
import dynamic from 'next/dynamic';
import { ThemeRegistry } from '../../../core/providers/ThemeRegistry';
import { AuthProvider } from '../../../core/providers/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const BankPage = dynamic(() => import('../../../features/bank/components/BankPage'), {
    ssr: false,
    loading: () => (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}
        >
            <CircularProgress />
        </Box>
    )
});

// This function now fetches the bank list and correctly maps the data
export async function getStaticPaths() {
    const response = await fetch('https://files.ccreward.app/banks_sg.json');
    const banksData = await response.json();

    const paths = banksData.map((bankObject) => ({
        params: { bankId: bankObject.bank.toLowerCase() },
    }));

    return { paths, fallback: 'blocking' };
}

// This function correctly fetches card data for the specific bank
export async function getStaticProps({ params }) {
    const { bankId } = params;
    const bankName = bankId.toUpperCase();
    
    try {
        const response = await fetch('https://files.ccreward.app/cards_sg.json');
        const data = await response.json();

        const cards = data.issuers[bankName]?.cards || [];

        return {
            props: {
                bank: bankName,
                cards,
            },
            revalidate: 86400, // Re-generate once a day
        };
    } catch (error) {
        console.error(`Failed to fetch card data for ${bankName}:`, error);
        return { notFound: true };
    }
}

// The page component receives the data as props
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