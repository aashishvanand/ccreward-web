import BankClient from './BankClient';
import cardsIN from '@/data/cards_in.json';
import cardsSG from '@/data/cards_sg.json';
import { notFound } from 'next/navigation';
import { slugify, findBySlug, bankPath, cardPath } from '@/core/utils/slug';

export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    ...Object.keys(cardsIN.issuers).map(bank => ({ region: 'in', bankId: slugify(bank) })),
    ...Object.keys(cardsSG.issuers).map(bank => ({ region: 'sg', bankId: slugify(bank) })),
  ];
}

export async function generateMetadata({ params }) {
  const { region, bankId } = await params;
  const cardsData = region === 'sg' ? cardsSG : cardsIN;
  const countryName = region === 'sg' ? 'Singapore' : 'India';

  const bank = findBySlug(Object.keys(cardsData.issuers), bankId);
  if (!bank) return {};
  const cards = cardsData.issuers[bank].cards || [];

  const title = `${bank} Credit Cards - Best ${bank} Cards of ${new Date().getFullYear()}`;
  const description = `Compare all ${cards.length} ${bank} credit cards in ${countryName}. Find the best ${bank} card for your spending, calculate rewards, check lounge access and maximize your benefits with ccreward.`;
  const url = `https://ccreward.app${bankPath(region, bank)}`;

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
  const countryName = region === 'sg' ? 'Singapore' : 'India';

  const bank = findBySlug(Object.keys(cardsData.issuers), bankId);
  if (!bank) {
    notFound();
  }
  const cards = cardsData.issuers[bank].cards || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${bank} Credit Cards in ${countryName}`,
    "description": `Compare and find the best ${bank} credit cards in ${countryName}. ${cards.length} cards available.`,
    "url": `https://ccreward.app${bankPath(region, bank)}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": cards.length,
      "itemListElement": cards.map((card, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://ccreward.app${cardPath(region, bank, card)}`,
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
