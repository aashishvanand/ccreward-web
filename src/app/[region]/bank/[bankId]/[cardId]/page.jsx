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
  const countryName = region === 'sg' ? 'Singapore' : 'India';

  const bankKey = Object.keys(cardsData.issuers).find(
    k => k.toLowerCase() === bankId.toLowerCase()
  );

  const cardName = bankKey
    ? cardsData.issuers[bankKey].cards.find(c => c.toLowerCase() === cardId)
    : null;

  const displayCard = cardName || cardId;
  const displayBank = bankKey || bankId.toUpperCase();
  const url = `https://ccreward.app/${region}/bank/${bankId}/${cardId}`;

  const title = `${displayBank} ${displayCard} Credit Card Review, Benefits & Rewards - ${new Date().getFullYear()}`;
  const description = `Comprehensive review of ${displayBank} ${displayCard} credit card. Check joining fee, annual fee, reward rates, airport lounge access, milestone benefits and calculate your exact rewards in ${countryName}.`;

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

// Build list of related cards from same bank for internal linking
function getRelatedCards(cardsData, bankKey, currentCardName, region) {
  const allCards = cardsData.issuers[bankKey]?.cards || [];
  return allCards
    .filter(c => c.toLowerCase() !== currentCardName.toLowerCase())
    .slice(0, 8)
    .map(c => ({
      name: c,
      url: `/${region}/bank/${bankKey.toLowerCase()}/${encodeURIComponent(c.toLowerCase())}`,
    }));
}

export default async function CardPage({ params }) {
  const { region, bankId, cardId } = await params;
  const cardsData = region === 'sg' ? cardsSG : cardsIN;
  const countryName = region === 'sg' ? 'Singapore' : 'India';

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

  const relatedCards = getRelatedCards(cardsData, bankKey, originalCardName, region);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": `${bankKey} ${originalCardName}`,
    "description": `Comprehensive review and rewards calculator for ${bankKey} ${originalCardName} credit card in ${countryName}. Calculate exact rewards, check lounge access, and maximize your benefits.`,
    "brand": {
      "@type": "Brand",
      "name": bankKey
    },
    "url": `https://ccreward.app/${region}/bank/${bankId}/${cardId}`,
    "category": "Credit Card",
    "audience": {
      "@type": "Audience",
      "audienceType": `Credit Card Users in ${countryName}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Server-rendered SEO content - replaced by client component after hydration */}
      <article data-ssr-content="card">
        <header style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
          <nav aria-label="breadcrumb">
            <span><a href={`/${region}`}>{countryName}</a></span>
            {' / '}
            <span><a href={`/${region}/bank/${bankId}`}>{bankKey} Credit Cards</a></span>
            {' / '}
            <span>{originalCardName}</span>
          </nav>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '1rem 0 0.5rem' }}>
            {bankKey} {originalCardName} Credit Card
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '700px' }}>
            Comprehensive review and rewards calculator for the {bankKey} {originalCardName} credit card.
            Sign in to calculate your exact rewards, check airport lounge access, view milestone benefits,
            and find the best usage strategies.
          </p>
        </header>

        <section style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Card Highlights</h2>
          <ul style={{ lineHeight: 2 }}>
            <li>Calculate exact reward points for every transaction using MCC codes</li>
            <li>Check complimentary airport lounge access - domestic and international</li>
            <li>View milestone rewards and spending targets</li>
            <li>Compare with other {bankKey} credit cards</li>
            <li>Find the best card for specific spending categories in {countryName}</li>
          </ul>
        </section>

        {relatedCards.length > 0 && (
          <section style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Other {bankKey} Credit Cards</h2>
            <ul style={{ lineHeight: 2 }}>
              {relatedCards.map(card => (
                <li key={card.name}>
                  <a href={card.url}>{bankKey} {card.name} Credit Card</a>
                </li>
              ))}
            </ul>
            <p>
              <a href={`/${region}/bank/${bankId}`}>View all {bankKey} credit cards in {countryName}</a>
            </p>
          </section>
        )}
      </article>
      <CardClient bankName={bankKey} cardName={originalCardName} country={region} />
    </>
  );
}
