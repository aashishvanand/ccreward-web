import HowToPage from '../features/how-to/HowToGuide';
import axios from 'axios';
import SEOHead from '../shared/components/seo/SEOHead';
import { generateMetadata } from '../shared/components/seo';
import PerformanceWrapper from '../shared/components/PerformanceWrapper';

export async function getServerSideProps(context) {
  // Attempt to get country from headers (Cloudflare or Vercel or standard)
  const countryHeader = context.req.headers['cf-ipcountry'] || context.req.headers['x-vercel-ip-country'];
  const region = countryHeader ? countryHeader.toLowerCase() : 'in';
  const platforms = ["ios", "android", "web"];
  const guides = {};

  try {
    await Promise.all(
      platforms.map(async (platform) => {
        try {
          // Use absolute URL for server-side fetch if needed, but here we can use the external URL directly
          const response = await axios.get(
            `https://files.ccreward.app/guides/${region}/${platform}-guides.json`
          );
          guides[platform] = response.data;
        } catch (err) {
          console.error(`Error loading ${platform} guides on server:`, err);
          guides[platform] = { platform, topics: [] };
        }
      })
    );
  } catch (err) {
    console.error("Error loading guide data on server:", err);
  }

  return {
    props: {
      initialGuidesData: guides,
    },
  };
}

const metadata = generateMetadata({
  title: "How To Guide - ccreward",
  description: "Comprehensive guides for using the ccreward app across different platforms",
  path: '/howto'
});

export default function HowToRoute({ initialGuidesData }) {
  return (
    <PerformanceWrapper name="how_to_page">
      <SEOHead metadata={metadata} />
      <HowToPage initialGuidesData={initialGuidesData} />
    </PerformanceWrapper>
  );
}