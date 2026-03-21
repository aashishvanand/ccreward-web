import HowToClient from './HowToClient';

export async function generateStaticParams() {
  return [
    { region: 'in' },
    { region: 'sg' },
  ];
}

export async function generateMetadata({ params }) {
  const { region } = await params;
  const countryName = region === 'sg' ? 'Singapore' : 'India';

  return {
    title: `How To Guide - ${countryName}`,
    description: `Comprehensive guides for using the ccreward app in ${countryName}. Step-by-step tutorials for iOS, Android, and web.`,
    alternates: {
      canonical: `https://ccreward.app/${region}/howto`,
      languages: {
        'en-IN': 'https://ccreward.app/in/howto',
        'en-SG': 'https://ccreward.app/sg/howto',
      },
    },
  };
}

async function fetchGuides(region) {
  const platforms = ['ios', 'android', 'web'];
  const guides = {};

  await Promise.all(
    platforms.map(async (platform) => {
      try {
        const response = await fetch(
          `https://files.ccreward.app/guides/${region}/${platform}-guides.json`,
          { next: { revalidate: 86400 } }
        );
        if (response.ok) {
          guides[platform] = await response.json();
        } else {
          guides[platform] = { platform, topics: [] };
        }
      } catch (err) {
        console.error(`Error loading ${platform} guides:`, err);
        guides[platform] = { platform, topics: [] };
      }
    })
  );

  return guides;
}

export default async function HowToPage({ params }) {
  const { region } = await params;
  const validRegion = ['in', 'sg'].includes(region) ? region : 'in';
  const guidesData = await fetchGuides(validRegion);

  return <HowToClient initialGuidesData={guidesData} />;
}
