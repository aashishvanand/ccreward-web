import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  CardContent,
} from "@mui/material";
import {
  Search as SearchIcon,
  Calculate as CalculateIcon,
  Bolt as BoltIcon,
  CompareArrows as CompareArrowsIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/providers/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import ExportedImage from "next-image-export-optimizer";
import { getCardsForUser } from "../utils/firebaseUtils";
import horizontalCardImages from "../data/horizontalCardImages.json";
const BASE_URL = "https://ccreward.app";

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
  "KOTAK",
  "INDUSIND",
  "YESBANK",
  "BOB",
  "CANARA",
  "DBS",
  "FEDERAL",
  "AU",
];

const getRandomCardImages = (count) => {
  const shuffled = [...horizontalCardImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function LandingPage() {
  const {
    signInWithGoogle,
    signInAnonymously,
    user,
    isAuthenticated,
    loading,
    isNewUser,
  } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardImages, setCardImages] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [hasCheckedCards, setHasCheckedCards] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const randomCards = getRandomCardImages(3);
    setCardImages(
      randomCards.map((card) => ({
        ...card,
        id: Date.now() + Math.random(), // Unique id for each card
        fullImagePath: `${BASE_URL}${card.imagePath}`,
      }))
    );
  }, []);

  const handleImageError = (failedCardId) => {
    console.error(`Failed to load image for card ${failedCardId}`);
    setCardImages((prevImages) => {
      const newImages = prevImages.filter((img) => img.id !== failedCardId);
      if (newImages.length < 3) {
        const additionalCard = getRandomCardImages(1)[0];
        newImages.push({
          ...additionalCard,
          id: Date.now() + Math.random(),
          fullImagePath: `${BASE_URL}${additionalCard.imagePath}`,
        });
      }
      return newImages;
    });
  };

  useEffect(() => {
    const authenticated = isAuthenticated();
    if (!loading && authenticated && user?.uid && !hasCheckedCards) {
      const checkUserCards = async () => {
        try {
          const fetchedCards = await getCardsForUser(user.uid);
          if (fetchedCards.length === 0) {
            router.push("/my-cards", undefined, { shallow: true });
          }
        } catch (error) {
          console.error("Error checking user cards:", error);
          setSnackbar({
            open: true,
            message: "Error checking your cards. Please try again later.",
            severity: "error",
          });
        } finally {
          setHasCheckedCards(true);
        }
      };
      checkUserCards();
    }
  }, [loading, isAuthenticated, user?.uid, router, hasCheckedCards]);

  const handleSignIn = async (signInMethod) => {
    setIsLoading(true);
    try {
      await signInMethod();
      setSnackbar({
        open: true,
        message: "Sign-in successful! You can now use all features of the app.",
        severity: "success",
      });
      setHasCheckedCards(false); // Reset this so we check cards after new sign-in
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      {/* Hero Section */}
      <Box sx={{ bgcolor: "background.default", py: { xs: 4, md: 6, lg: 8 } }}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={{ xs: 4, md: 6, lg: 8 }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid
              item
              xs={12}
              md={6}
              lg={5}
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              <Typography variant="h2" gutterBottom>
                Maximize Your Rewards with the Right Credit Card
              </Typography>
              <Typography variant="h5" paragraph>
                Compare cards, calculate rewards, and find the perfect credit
                card for your spending habits.
              </Typography>
              {!loading && !isAuthenticated() && (
                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => handleSignIn(signInWithGoogle)}
                    disabled={isLoading}
                    startIcon={
                      isLoading && (
                        <CircularProgress size={20} color="inherit" />
                      )
                    }
                  >
                    Sign in with Google
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => handleSignIn(signInAnonymously)}
                    disabled={isLoading}
                  >
                    Continue Anonymously
                  </Button>
                </Box>
              )}
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Box
                sx={{
                  position: "relative",
                  height: { xs: 300, sm: 400, md: 450, lg: 500 },
                  width: "100%",
                  maxWidth: { xs: 320, sm: 400, md: "100%" },
                  margin: "0 auto",
                }}
              >
                {cardImages.map((card, index) => (
                  <Card
                    key={card.id}
                    sx={{
                      position: "absolute",
                      top: isMobile
                        ? `${index * 20}%`
                        : isTablet
                        ? `${index * 22}%`
                        : `${index * 25}%`,
                      left: isMobile
                        ? "50%"
                        : isLargeScreen
                        ? `${index * 5}%`
                        : `${index * 8}%`,
                      transform: isMobile
                        ? `translateX(-50%) rotate(${(index - 1) * 5}deg)`
                        : `rotate(${(index - 1) * 5}deg)`,
                      width: isMobile ? 240 : isTablet ? 280 : 320,
                      height: isMobile ? 150 : isTablet ? 175 : 200,
                      boxShadow: 3,
                      overflow: "hidden",
                      borderRadius: "12px",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: isMobile
                          ? "translateX(-50%) scale(1.05) rotate(0deg)"
                          : "scale(1.05) rotate(0deg)",
                        zIndex: 10,
                      },
                    }}
                  >
                    <ExportedImage
                      src={card.imagePath}
                      alt={`${card.bank} ${card.cardName}`}
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="(max-width: 600px) 240px, (max-width: 960px) 280px, 320px"
                      onError={() => handleImageError(card.id)}
                    />
                  </Card>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Key Features Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            Key Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              {
                icon: <SearchIcon />,
                title: "Compare Top Cards",
                description: "Compare cards from leading banks.",
              },
              {
                icon: <CalculateIcon />,
                title: "Reward Calculator",
                description:
                  "Estimate your potential rewards without adding any personal card details.",
              },
              {
                icon: <BoltIcon />,
                title: "Merchant-Specific Rewards",
                description:
                  "Find the best card for your favorite merchants based on cashback and rewards.",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 3,
                  }}
                >
                  <Box sx={{ mb: 2, color: "primary.main" }}>
                    {React.cloneElement(feature.icon, { fontSize: "large" })}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    align="center"
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Supported Banks Section */}
      <Box sx={{ bgcolor: "background.default", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            Supported Banks
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {banks.map((bank) => (
              <Grid item key={bank} xs={6} sm={4} md={3} lg={2}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                  <Box sx={{ width: 80, height: 80, position: 'relative', mb: 1 }}>
                    <ExportedImage
                      src={`/bank-images/${bank.toLowerCase()}.webp`}
                      alt={`${bank} logo`}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                  <Typography variant="subtitle2" align="center">
                    {bank}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{ bgcolor: "primary.main", color: "primary.contrastText", py: 8 }}
      >
        <Container maxWidth="sm">
          <Typography variant="h3" align="center" gutterBottom>
            Ready to Maximize Your Rewards?
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Start comparing cards and maximizing your rewards today.
          </Typography>
          {/* <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
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
          </Box> */}
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
}
