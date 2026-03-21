"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CircularProgress, Box } from '@mui/material';

const TermsOfServicePage = dynamic(() => import('@/features/legal/components/TermsOfServicePage'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <CircularProgress />
    </Box>
  )
});

export default function TermsClient() {
  useEffect(() => {
    const ssrContent = document.querySelector('[data-ssr-content="terms"]');
    if (ssrContent) {
      ssrContent.style.display = 'none';
    }
  }, []);

  return <TermsOfServicePage />;
}
