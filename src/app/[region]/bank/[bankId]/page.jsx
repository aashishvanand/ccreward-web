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
  const cardsData = region === 'sg' ? cardsSG : cardsIN;
  const countryName = region === 'sg' ? 'Singapore' : 'India';

  const bankKey = Object.keys(cardsData.issuers).find(
    k => k.toLowerCase() === bankId.toLowerCase()
  );
  const bank = bankKey || bankId.toUpperCase();
  const cards = bankKey ? cardsData.issuers[bankKey]?.cards || [] : [];

  const title = `${bank} Credit Cards - Best ${bank} Cards of ${new Date().getFullYear()}`;
  const description = `Compare all ${cards.length} ${bank} credit cards in ${countryName}. Find the best ${bank} card for your spending, calculate rewards, check lounge access and maximize your benefits with ccreward.`;
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
  const countryName = region === 'sg' ? 'Singapore' : 'India';

  const issuerKey = Object.keys(cardsData.issuers).find(
    (key) => key.localeCompare(bankId, undefined, { sensitivity: 'base' }) === 0
  );

  const bank = issuerKey || bankId.toUpperCase();
  const cards = (issuerKey && cardsData.issuers[issuerKey]?.cards) || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${bank} Credit Cards in ${countryName}`,
    "description": `Compare and find the best ${bank} credit cards in ${countryName}. ${cards.length} cards available.`,
    "url": `https://ccreward.app/${region}/bank/${bankId}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": cards.length,
      "itemListElement": cards.map((card, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://ccreward.app/${region}/bank/${bankId}/${encodeURIComponent(card.toLowerCase())}`,
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
      {/* Server-rendered SEO content - hidden by client component after hydration */}
      <article data-ssr-content="bank">
        <header style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
          <nav aria-label="breadcrumb">
            <span><a href={`/${region}`}>{countryName}</a></span>
            {' / '}
            <span>{bank} Credit Cards</span>
          </nav>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '1rem 0 0.5rem' }}>
            {bank} Credit Cards
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '700px' }}>
            Compare all {cards.length} {bank} credit cards available in {countryName}.
            Find the best card for your spending patterns, calculate rewards, and maximize your benefits.
          </p>
        </header>

        <section style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            All {bank} Credit Cards ({cards.length})
          </h2>
          <ul style={{ lineHeight: 2, listStyle: 'none', padding: 0 }}>
            {cards.map(card => (
              <li key={card} style={{ padding: '0.25rem 0' }}>
                <a href={`/${region}/bank/${bankId}/${encodeURIComponent(card.toLowerCase())}`}>
                  {bank} {card} Credit Card
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Why Compare {bank} Cards on ccreward?
          </h2>
          <ul style={{ lineHeight: 2 }}>
            <li>Calculate exact reward points based on your spending categories</li>
            <li>Compare airport lounge access across all {bank} cards</li>
            <li>Find the best {bank} card for online shopping, travel, dining, and more</li>
            <li>View joining fees, annual fees, and minimum income requirements</li>
            <li>Check milestone rewards and spending targets</li>
          </ul>
        </section>
      </article>
      <BankClient bank={bank} cards={cards} />
    </>
  );
}
