import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import { AuthProvider } from '../core/providers/AuthContext';
import AuthRedirectWrapper from '../shared/components/auth/AuthRedirectWrapper';
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
          <AuthRedirectWrapper>
            <MyCardsList />
          </AuthRedirectWrapper>
        </AuthProvider>
      </RegionProvider>
    </ThemeRegistry>
  );
}