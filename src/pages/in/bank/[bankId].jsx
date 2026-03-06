import dynamic from 'next/dynamic';
import { ThemeRegistry } from '@/core/providers/ThemeRegistry';
import { AuthProvider } from '@/core/providers/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// --- Step 1: Import local data ---
import bankImagesIN from '@/data/banks_in.json';
import cardsDataIN from '@/data/cards_in.json';

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
  const paths = bankImagesIN.map((bankObject) => ({
    params: { bankId: bankObject.bank.toLowerCase() },
  }));

  return { paths, fallback: false };
}

// --- Step 3: Use local data for getStaticProps ---
export async function getStaticProps({ params }) {
  const { bankId } = params;
  const bankName = bankId.toUpperCase();

  // No fetch needed, just access the imported JSON directly
  // Fix: Perform case-insensitive lookup for the bank key
  const issuerKey = Object.keys(cardsDataIN.issuers).find(
    (key) => key.localeCompare(bankId, undefined, { sensitivity: 'base' }) === 0
  );

  const cards = (issuerKey && cardsDataIN.issuers[issuerKey]?.cards) || [];

  return {
    props: {
      bank: bankName,
      cards,
    },
  };
}

// --- Step 4: Import SEO Component ---
import SEOHead from '@/shared/components/seo/SEOHead';

function BankRouteIN({ bank, cards }) {
  const title = `${bank} Credit Cards - Best ${bank} Cards of ${new Date().getFullYear()} | ccreward`;
  const description = `Compare and find the best ${bank} credit cards in India. Maximize your rewards with our ${bank} credit card calculator.`;
  const url = `https://ccreward.app/in/bank/${bank.toLowerCase()}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${bank} Credit Cards`,
    "description": description,
    "url": url,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": cards.map((card, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${url}/${card.toLowerCase()}`,
        "name": `${bank} ${card}`
      }))
    }
  };

  const metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website'
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
        <BankPage bank={bank} cards={cards} />
      </AuthProvider>
    </ThemeRegistry>
  );
}

export default BankRouteIN;