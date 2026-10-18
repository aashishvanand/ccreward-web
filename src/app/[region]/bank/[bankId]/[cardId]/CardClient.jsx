"use client";

import dynamic from 'next/dynamic';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '@/core/providers/AuthContext';
import CardPublicView from '@/features/card/components/CardPublicView';

const CardPage = dynamic(() => import('@/features/card/components/CardPage'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  )
});

// Signed-in users get the full card details; everyone else (including the
// server render that crawlers index) gets the public preview.
export default function CardClient({ bankName, cardName, country, ...publicProps }) {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <CardPage bankName={bankName} cardName={cardName} country={country} />;
  }

  return (
    <CardPublicView
      bankName={bankName}
      cardName={cardName}
      country={country}
      {...publicProps}
    />
  );
}
