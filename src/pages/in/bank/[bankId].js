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

const getData = async (filename) => {
  try {
    if (process.env.CCREWARD_BUCKET) {
      const object = await process.env.CCREWARD_BUCKET.get(filename);
      if (object) {
        return await object.json();
      }
    }
  } catch (e) {
    console.error(`Failed to fetch ${filename} from R2`, e);
  }

  // Fallback to fetch
  const res = await fetch(`https://files.ccreward.app/${filename}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${filename}: ${res.statusText}`);
  }
  return await res.json();
};

// --- Step 2: Use local data for getStaticPaths ---
export async function getStaticPaths() {
  let paths = [];
  try {
    const bankImagesIN = await getData('banks_in.json');
    paths = bankImagesIN.map((bankObject) => ({
      params: { bankId: bankObject.bank.toLowerCase() },
    }));
  } catch (error) {
    console.error("Failed to fetch banks_in.json", error);
  }

  return { paths, fallback: 'blocking' };
}

// --- Step 3: Use local data for getStaticProps ---
export async function getStaticProps({ params }) {
  const { bankId } = params;
  const bankName = bankId.toUpperCase();

  let cards = [];
  try {
    const cardsDataIN = await getData('cards_in.json');
    cards = cardsDataIN.issuers[bankName]?.cards || [];
  } catch (error) {
    console.error("Failed to fetch cards_in.json", error);
  }

  return {
    props: {
      bank: bankName,
      cards,
    },
    revalidate: 3600, // Revalidate every hour
  };
}

function BankRouteIN({ bank, cards }) {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <BankPage bank={bank} cards={cards} />
      </AuthProvider>
    </ThemeRegistry>
  );
}

export default BankRouteIN;