import dynamic from 'next/dynamic';

const LoginPage = dynamic(() => import('../components/LoginPage'), { ssr: false });

export default function SignInPage() {
  return <LoginPage />;
}