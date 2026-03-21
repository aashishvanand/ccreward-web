"use client";

import { useEffect } from 'react';
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
  // Hide SSR content once client component mounts
  useEffect(() => {
    const ssrContent = document.querySelector('[data-ssr-content="card"]');
    if (ssrContent) {
      ssrContent.style.display = 'none';
    }
  }, []);

  return <CardPage bankName={bankName} cardName={cardName} country={country} />;
}
