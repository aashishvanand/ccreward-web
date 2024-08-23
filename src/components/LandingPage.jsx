'use client';
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Link,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CreditCard,
  Calculate,
  Search,
  Bolt,
  Brightness4,
  Brightness7,
  Google as GoogleIcon,
} from "@mui/icons-material";
import NextLink from "next/link";
import { useRouter } from 'next/navigation';
import { useAppTheme } from '../components/ThemeRegistry';
import { useAuth } from '../app/providers/AuthContext';

export default function LandingPage() {
  const { mode, toggleTheme, theme } = useAppTheme();
  const { signInWithGoogle, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const banks = [
    "AMEX",
    "AXIS",
    "HDFC",
    "HSBC",
    "ICICI",
    "IDFCFIRST",
    "ONECARD",
    "SBI",
    "SC",
  ];

  useEffect(() => {
    if (!loading && isAuthenticated()) {
      router.push('/my-cards');
    }
  }, [loading, isAuthenticated, router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.push('/my-cards');
    } catch (error) {
      console.error("Error during Google sign in:", error);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <CreditCard sx={{ mr: 1 }} />
            CardCompare
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: { xs: 8, md: 12, lg: 16 },
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" align="center" gutterBottom>
            Maximize Your Rewards with the Right Credit Card
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Compare cards, calculate rewards, and find the perfect credit card
            for your spending habits.
          </Typography>
          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <GoogleIcon />}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign in with Google'}
            </Button>
          </Box>
        </Container>
      </Box>

        <Container sx={{ py: 8 }} maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            Key Features
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <Search />,
                title: "Compare Top Cards",
                description:
                  "Compare cards from leading banks.",
              },
              {
                icon: <Calculate />,
                title: "Reward Calculator",
                description:
                  "Estimate your potential rewards without adding any personal card details.",
              },
              {
                icon: <Bolt />,
                title: "Merchant-Specific Rewards",
                description:
                  "Find the best card for your favorite merchants based on cashback and rewards.",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "background.paper",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                    <Box sx={{ mb: 2 }}>
                      {React.cloneElement(feature.icon, {
                        fontSize: "large",
                        color: "primary",
                        sx: { color: "primary.main" },
                      })}
                    </Box>
                    <Typography variant="h5" component="div" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Box sx={{ bgcolor: "background.default", py: 4, overflow: "hidden" }}>
          <Typography variant="h3" align="center" gutterBottom>
            Supported Banks and Card Issuers
          </Typography>
          <Box
            sx={{
              display: "flex",
              whiteSpace: "nowrap",
              animation: "marquee 20s linear infinite",
              "&:hover": {
                animationPlayState: "paused",
              },
              "@keyframes marquee": {
                "0%": { transform: "translateX(100%)" },
                "100%": { transform: "translateX(-100%)" },
              },
            }}
          >
            {[...banks, ...banks].map((bank, index) => (
              <Typography
                key={index}
                variant="h6"
                sx={{ display: "inline-block", px: 4, color: "text.primary" }}
              >
                {bank}
              </Typography>
            ))}
          </Box>
        </Box>

        <Box
          sx={{ bgcolor: "primary.main", color: "primary.contrastText", py: 8 }}
        >
          <Container maxWidth="sm">
            <Typography variant="h3" align="center" gutterBottom>
              Ready to Find Your Perfect Card?
            </Typography>
            <Typography variant="h6" align="center" paragraph>
              Start comparing cards and maximizing your rewards today. No
              sign-up required!
            </Typography>
            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}
            >
              <NextLink href="/calculator" passHref>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component="a"
                >
                  Points Calculator
                </Button>
              </NextLink>
            </Box>
          </Container>
        </Box>

        <Box
          component="footer"
          sx={{ py: 3, px: 2, mt: "auto", backgroundColor: "background.paper" }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © 2024 CardCompare. All rights reserved.
              <Link color="inherit" href="#" sx={{ ml: 2 }}>
                Terms of Service
              </Link>
              <Link color="inherit" href="#" sx={{ ml: 2 }}>
                Privacy
              </Link>
            </Typography>
          </Container>
        </Box>
      </Box>
  );
}
