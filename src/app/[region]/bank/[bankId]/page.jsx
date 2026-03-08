import BankClient from './BankClient';
import banksIN from '@/data/banks_in.json';
import banksSG from '@/data/banks_sg.json';
import cardsIN from '@/data/cards_in.json';
import cardsSG from '@/data/cards_sg.json';

export const dynamicParams = false;

export async function generateStaticParams() {
  const params = [];

  banksIN.forEach((bankObj) => {
    params.push({ region: 'in', bankId: bankObj.bank.toLowerCase() });
  });

  banksSG.forEach((bankObj) => {
    params.push({ region: 'sg', bankId: bankObj.bank.toLowerCase() });
  });

  return params;
}

export async function generateMetadata({ params }) {
  const { region, bankId } = await params;
  const bank = bankId.toUpperCase();
  const countryName = region === 'sg' ? 'Singapore' : 'India';
  const title = `${bank} Credit Cards - Best ${bank} Cards of ${new Date().getFullYear()} | ccreward`;
  const description = `Compare and find the best ${bank} credit cards in ${countryName}. Maximize your rewards with our ${bank} credit card calculator.`;
  const url = `https://ccreward.app/${region}/bank/${bankId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

function getCardsData(region) {
  return region === 'sg' ? cardsSG : cardsIN;
}

export default async function BankPage({ params }) {
  const { region, bankId } = await params;
  const cardsData = getCardsData(region);
  const bank = bankId.toUpperCase();

  const issuerKey = Object.keys(cardsData.issuers).find(
    (key) => key.localeCompare(bankId, undefined, { sensitivity: 'base' }) === 0
  );

  const cards = (issuerKey && cardsData.issuers[issuerKey]?.cards) || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${bank} Credit Cards`,
    "description": `Compare and find the best ${bank} credit cards.`,
    "url": `https://ccreward.app/${region}/bank/${bankId}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": cards.map((card, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://ccreward.app/${region}/bank/${bankId}/${card.toLowerCase()}`,
        "name": `${bank} ${card}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BankClient bank={bank} cards={cards} />
    </>
  );
}
