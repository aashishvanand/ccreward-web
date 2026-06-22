"use client";

import { Box, Container, Typography, Button } from '@mui/material';
import Link from 'next/link';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

export default function NotFound() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8, textAlign: 'center' }}>
        <SentimentDissatisfiedIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />

        <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 800, color: 'primary.main', fontSize: { xs: '4rem', md: '6rem' } }}>
          404
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 4,
            maxWidth: '500px'
          }}>
          Sorry, the page you are looking for does not exist. It might have been moved or deleted.
        </Typography>

        <Link href="/" passHref>
          <Button variant="contained" size="large" sx={{ borderRadius: 2, px: 4, py: 1.5 }}>
            Go Home
          </Button>
        </Link>
      </Container>
      <Footer />
    </Box>
  );
}
