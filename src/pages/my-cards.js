import dynamic from 'next/dynamic';

const MyCardsList = dynamic(() => import('../components/MyCardsPage'), { ssr: false });

export default function MyCardsPage() {
  return <MyCardsList />;
}