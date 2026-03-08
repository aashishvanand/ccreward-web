import CardClient from './CardClient';
import cardsIN from '@/data/cards_in.json';
import cardsSG from '@/data/cards_sg.json';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export async function generateStaticParams() {
  const params = [];

  Object.entries(cardsIN.issuers).forEach(([bankName, bankData]) => {
    bankData.cards.forEach(cardName => {
      params.push({
        region: 'in',
        bankId: bankName.toLowerCase(),
        cardId: cardName.toLowerCase()
      });
    });
  });

  Object.entries(cardsSG.issuers).forEach(([bankName, bankData]) => {
    bankData.cards.forEach(cardName => {
      params.push({
        region: 'sg',
        bankId: bankName.toLowerCase(),
        cardId: cardName.toLowerCase()
      });
    });
  });

  return params;
}

export async function generateMetadata({ params }) {
  const { region, bankId, cardId } = await params;
  const cardsData = region === 'sg' ? cardsSG : cardsIN;

  const bankKey = Object.keys(cardsData.issuers).find(
    k => k.toLowerCase() === bankId.toLowerCase()
  );

  const cardName = bankKey
    ? cardsData.issuers[bankKey].cards.find(c => c.toLowerCase() === cardId)
    : null;

  const displayCard = cardName || cardId;
  const displayBank = bankKey || bankId.toUpperCase();
  const url = `https://ccreward.app/${region}/bank/${bankId}/${cardId}`;

  const title = `${displayCard} Review, Benefits & Rewards - ${new Date().getFullYear()} | ccreward`;
  const description = `Maximize rewards with ${displayCard} from ${displayBank}. Calculate specific rewards, check lounge access, and find best usage strategies using ccreward.`;

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

export default async function CardPage({ params }) {
  const { region, bankId, cardId } = await params;
  const cardsData = region === 'sg' ? cardsSG : cardsIN;

  const bankKey = Object.keys(cardsData.issuers).find(
    k => k.toLowerCase() === bankId.toLowerCase()
  );

  if (!bankKey) {
    notFound();
  }

  const originalCardName = cardsData.issuers[bankKey].cards.find(
    c => c.toLowerCase() === cardId
  );

  if (!originalCardName) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": originalCardName,
    "description": `Maximize rewards with ${originalCardName} from ${bankKey}.`,
    "brand": {
      "@type": "Brand",
      "name": bankKey
    },
    "url": `https://ccreward.app/${region}/bank/${bankId}/${cardId}`,
    "category": "Credit Card",
    "audience": {
      "@type": "Audience",
      "audienceType": `Credit Card Users in ${region === 'sg' ? 'Singapore' : 'India'}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CardClient bankName={bankKey} cardName={originalCardName} country={region} />
    </>
  );
}
