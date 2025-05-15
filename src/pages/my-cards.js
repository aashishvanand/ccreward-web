import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import { AuthProvider } from '../core/providers/AuthContext';
import { RegionProvider } from '../core/providers/RegionContext';

const MyCardsList = dynamic(() => import('../features/cards/components/MyCardsPage'), { ssr: false });

export const metadata = generateMetadata({
  ...pageMetadata.myCards,
  path: '/my-cards'
});

export default function MyCardsPage() {
  return (
    <ThemeRegistry>
      <RegionProvider>
        <AuthProvider>
          <MyCardsList />
        </AuthProvider>
      </RegionProvider>
    </ThemeRegistry>
  );
}