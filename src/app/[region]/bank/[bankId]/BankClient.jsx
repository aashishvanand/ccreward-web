"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CircularProgress, Box } from '@mui/material';

const BankPage = dynamic(() => import('@/features/bank/components/BankPage'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  )
});

export default function BankClient({ bank, cards }) {
  // Hide SSR content once client component mounts
  useEffect(() => {
    const ssrContent = document.querySelector('[data-ssr-content="bank"]');
    if (ssrContent) {
      ssrContent.style.display = 'none';
    }
  }, []);

  return <BankPage bank={bank} cards={cards} />;
}
