// src/pages/sg/bank/[bankId].js
import dynamic from 'next/dynamic';
import { ThemeRegistry } from '../../../core/providers/ThemeRegistry';
import { AuthProvider } from '../../../core/providers/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import bankImagesSG from '../../../shared/constants/bankImagesSG';

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

// Create a mapping from the bank ID in bankImagesSG to its display name
const BANK_NAME_MAPPING = bankImagesSG.reduce((acc, bank) => {
    acc[bank.bank.toLowerCase()] = bank.bank.toUpperCase();
    return acc;
}, {});

// This function runs at build time for each Singaporean bank
export async function getStaticProps({ params }) {
    const { bankId } = params;
    const mappedBankName = BANK_NAME_MAPPING[bankId.toLowerCase()];

    if (!mappedBankName) {
        return { notFound: true };
    }

    // Fetch from the Singapore-specific JSON file
    const response = await fetch('https://files.ccreward.app/cards_sg.json');
    const data = await response.json();

    const cards = data.issuers[mappedBankName]?.cards || [];

    return {
        props: {
            bank: mappedBankName,
            cards,
        },
        revalidate: 86400, // Re-generate once a day
    };
}

// This function generates all the static paths for Singaporean banks
export async function getStaticPaths() {
    const paths = Object.keys(BANK_NAME_MAPPING).map((bankId) => ({
        params: { bankId },
    }));

    return { paths, fallback: false };
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