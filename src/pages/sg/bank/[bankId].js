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

export async function getStaticPaths() {
    const response = await fetch('https://files.ccreward.app/banks_sg.json');
    const banksData = await response.json();

    const paths = banksData.map((bankObject) => ({
        params: { bankId: bankObject.bank.toLowerCase() },
    }));

    // Change fallback to 'false' to support static export
    return { paths, fallback: false };
}

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
            // Ensure the 'revalidate' key is not present here
        };
    } catch (error) {
        console.error(`Failed to fetch card data for ${bankName}:`, error);
        return { notFound: true };
    }
}

// The rest of your page component remains the same
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