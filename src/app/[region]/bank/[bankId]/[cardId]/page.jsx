import CardClient from './CardClient';
import cardsIN from '@/data/cards_in.json';
import cardsSG from '@/data/cards_sg.json';
import categoriesIN from '@/data/cardCategories_in.json';
import categoriesSG from '@/data/cardCategories_sg.json';
import { notFound } from 'next/navigation';
import { slugify, findBySlug, bankPath, cardPath, categoryPath } from '@/core/utils/slug';

export const dynamicParams = false;

const BASE_URL = 'https://ccreward.app';

const REGION_DATA = {
  in: { cards: cardsIN, categories: categoriesIN, countryName: 'India' },
  sg: { cards: cardsSG, categories: categoriesSG, countryName: 'Singapore' },
};

export async function generateStaticParams() {
  return Object.entries(REGION_DATA).flatMap(([region, { cards }]) =>
    Object.entries(cards.issuers).flatMap(([bankName, bankData]) =>
      bankData.cards.map(cardName => ({
        region,
        bankId: slugify(bankName),
        cardId: slugify(cardName),
      }))
    )
  );
}

// Resolves route params (slugs, possibly percent-encoded) to the real bank/card names.
function resolveCard(params) {
  const { region, bankId, cardId } = params;
  const regionData = REGION_DATA[region];
  if (!regionData) return null;

  const bankKey = findBySlug(Object.keys(regionData.cards.issuers), bankId);
  if (!bankKey) return null;

  const cardName = findBySlug(regionData.cards.issuers[bankKey].cards, cardId);
  if (!cardName) return null;

  return { region, bankKey, cardName, ...regionData };
}

export async function generateMetadata({ params }) {
  const resolved = resolveCard(await params);
  if (!resolved) return {};

  const { region, bankKey, cardName, countryName } = resolved;
  const url = `${BASE_URL}${cardPath(region, bankKey, cardName)}`;

  const title = `${bankKey} ${cardName} Credit Card Review, Benefits & Rewards - ${new Date().getFullYear()}`;
  const description = `Comprehensive review of ${bankKey} ${cardName} credit card. Check joining fee, annual fee, reward rates, airport lounge access, milestone benefits and calculate your exact rewards in ${countryName}.`;

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

// Categories where this card is one of the top picks, with its rank in each
function getTopPickCategories(categories, bankKey, cardName, region) {
  // Keyed by route name (category.name can differ, e.g. "Offline Transactions")
  return Object.entries(categories)
    .map(([name, category]) => {
      const rank = category.cards.findIndex(
        c => c.bank === bankKey && c.cardName === cardName
      );
      return rank === -1
        ? null
        : { name, rank: rank + 1, url: categoryPath(region, name) };
    })
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank);
}

// Cards from other banks that are top picks in the same categories
function getSimilarCards(categories, bankKey, cardName, topPickCategories, region) {
  const seen = new Set();
  const similar = [];
  for (const { name } of topPickCategories) {
    for (const c of categories[name]?.cards || []) {
      const key = `${c.bank}|${c.cardName}`;
      if (c.bank === bankKey || seen.has(key)) continue;
      seen.add(key);
      similar.push({ bank: c.bank, name: c.cardName, url: cardPath(region, c.bank, c.cardName) });
    }
  }
  return similar.slice(0, 6);
}

// Other cards from the same bank for internal linking
function getRelatedCards(cardsData, bankKey, currentCardName, region) {
  return cardsData.issuers[bankKey].cards
    .filter(c => c !== currentCardName)
    .slice(0, 8)
    .map(c => ({ name: c, url: cardPath(region, bankKey, c) }));
}

export default async function CardPage({ params }) {
  const resolved = resolveCard(await params);
  if (!resolved) {
    notFound();
  }

  const { region, bankKey, cardName, cards, categories, countryName } = resolved;
  const url = `${BASE_URL}${cardPath(region, bankKey, cardName)}`;

  const topPickCategories = getTopPickCategories(categories, bankKey, cardName, region);
  const similarCards = getSimilarCards(categories, bankKey, cardName, topPickCategories, region);
  const relatedCards = getRelatedCards(cards, bankKey, cardName, region);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": `${bankKey} ${cardName}`,
      "description": `Comprehensive review and rewards calculator for ${bankKey} ${cardName} credit card in ${countryName}. Calculate exact rewards, check lounge access, and maximize your benefits.`,
      "brand": {
        "@type": "Brand",
        "name": bankKey
      },
      "url": url,
      "category": "Credit Card",
      "audience": {
        "@type": "Audience",
        "audienceType": `Credit Card Users in ${countryName}`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": countryName, "item": `${BASE_URL}/${region}` },
        { "@type": "ListItem", "position": 2, "name": `${bankKey} Credit Cards`, "item": `${BASE_URL}${bankPath(region, bankKey)}` },
        { "@type": "ListItem", "position": 3, "name": cardName, "item": url },
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CardClient
        bankName={bankKey}
        cardName={cardName}
        country={region}
        countryName={countryName}
        bankUrl={bankPath(region, bankKey)}
        topPickCategories={topPickCategories}
        similarCards={similarCards}
        relatedCards={relatedCards}
      />
    </>
  );
}
