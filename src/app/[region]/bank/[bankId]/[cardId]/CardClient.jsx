"use client";

import dynamic from 'next/dynamic';
import { CircularProgress, Box } from '@mui/material';

const CardPage = dynamic(() => import('@/features/card/components/CardPage'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  )
});

export default function CardClient({ bankName, cardName, country }) {
  return <CardPage bankName={bankName} cardName={cardName} country={country} />;
}
