import dynamic from 'next/dynamic';
import { ThemeRegistry } from '../components/ThemeRegistry';
import { AuthProvider } from '../app/providers/AuthContext';
import AuthRedirectWrapper from '../components/AuthRedirectWrapper';

const MyCardsList = dynamic(() => import('../components/MyCardsPage'), { ssr: false });

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