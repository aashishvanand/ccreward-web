import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function HowToRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Default to 'in' or detect browser locale if needed (optional)
    router.replace('/in/howto');
  }, [router]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div />
    </>
  );
}