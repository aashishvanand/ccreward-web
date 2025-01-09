import dynamic from 'next/dynamic';
import { generateMetadata } from '../../shared/components/seo';
import { ThemeRegistry } from '../../core/providers/ThemeRegistry';
import { AuthProvider } from '../../core/providers/AuthContext';

const BankPage = dynamic(() => import('../../features/bank/components/BankPage'), { ssr: false });

const CACHE_KEY = 'cardsData';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const BANK_NAME_MAPPING = {
  'amex': 'AMEX',
  'au': 'AU',
  'axis': 'Axis',
  'bob': 'BOB',
  'canara': 'Canara',
  'dbs': 'DBS',
  'federal': 'Federal',
  'hdfc': 'HDFC',
  'hsbc': 'HSBC',
  'icici': 'ICICI',
  'idbi': 'IDBI',
  'idfcfirst': 'IDFCFirst',
  'indusind': 'IndusInd',
  'kotak': 'Kotak',
  'onecard': 'OneCard',
  'pnb': 'PNB',
  'rbl': 'RBL',
  'sbi': 'SBI',
  'sc': 'SC',
  'yesbank': 'YesBank'
};

async function getCardsData() {
  // Check cache first
  if (typeof window !== 'undefined') {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  }

  // Fetch fresh data if cache is expired or missing
  const response = await fetch('https://files.ccreward.app/cards.json');
  const data = await response.json();

  // Update cache
  if (typeof window !== 'undefined') {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  }

  return data;
}

export async function getStaticPaths() {
  try {
    // Get paths from our known bank mappings
    const paths = Object.keys(BANK_NAME_MAPPING).map((bank) => ({
      params: { bankId: bank.toLowerCase() },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error fetching banks:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const data = await getCardsData();
    const bankId = params.bankId.toLowerCase();
    const mappedBankName = BANK_NAME_MAPPING[bankId];
    
    if (!mappedBankName) {
      return {
        notFound: true,
      };
    }

    const cards = data.issuers[mappedBankName]?.cards || [];
    
    if (!cards.length) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        bank: mappedBankName,
        cards,
      },
    };
  } catch (error) {
    console.error('Error fetching bank cards:', error);
    return {
      notFound: true,
    };
  }
}

export default function BankRoute({ bank, cards }) {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <BankPage bank={bank} cards={cards} />
      </AuthProvider>
    </ThemeRegistry>
  );
}