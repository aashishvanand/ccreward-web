"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CircularProgress, Box } from '@mui/material';

const PrivacyPolicyPage = dynamic(() => import('@/features/legal/components/PrivacyPolicyPage'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <CircularProgress />
    </Box>
  )
});

export default function PrivacyClient() {
  useEffect(() => {
    const ssrContent = document.querySelector('[data-ssr-content="privacy"]');
    if (ssrContent) {
      ssrContent.style.display = 'none';
    }
  }, []);

  return <PrivacyPolicyPage />;
}
