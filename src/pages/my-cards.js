import dynamic from 'next/dynamic';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import { AuthProvider } from '../core/providers/AuthContext';
import AuthRedirectWrapper from '../shared/components/auth/AuthRedirectWrapper';

const MyCardsList = dynamic(() => import('../features/cards/components/MyCardsPage'), { ssr: false });

export default function MyCardsPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <AuthRedirectWrapper>
          <MyCardsList />
        </AuthRedirectWrapper>
      </AuthProvider>
    </ThemeRegistry>
  );
}