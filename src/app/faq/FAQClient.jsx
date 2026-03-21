"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CircularProgress, Box } from '@mui/material';

const FAQPage = dynamic(() => import('@/features/faq/components/FAQPage'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <CircularProgress />
    </Box>
  )
});

export default function FAQClient() {
  // Hide SSR content once the interactive client component mounts
  useEffect(() => {
    const ssrContent = document.querySelector('[data-ssr-content="faq"]');
    if (ssrContent) {
      ssrContent.style.display = 'none';
    }
  }, []);

  return <FAQPage />;
}
