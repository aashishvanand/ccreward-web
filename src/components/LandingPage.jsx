import React, { useState, useEffect, useMemo } from "react";
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
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Calculate as CalculateIcon,
  Bolt as BoltIcon,
  CompareArrows as CompareArrowsIcon,
  TrendingUp as TrendingUpIcon,
  Twitter as TwitterIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/providers/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import { getCardsForUser } from "../utils/firebaseUtils";
import useCardImagesData from "../hooks/useCardImagesData";
import bankImagesData from "../data/bankImages";
import Image from "next/image";

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

const tweets = [
  {
    id: 1,
    author: "Amit Chopra | Every Paisa Matters",
    handle: "@EvryPaisaMatter",
    avatar:
      "https://pbs.twimg.com/profile_images/1481104355919282176/5lZaqKF9_400x400.jpg",
    content:
      "One stop shop to go to for all Credit Card Rewards related answers!",
    url: "https://x.com/aashishvanand/status/1834868453498601877/quotes",
  },
  {
    id: 2,
    author: "Rewards Maverick",
    handle: "@RewardsMaverick",
    avatar:
      "https://pbs.twimg.com/profile_images/1689934420067905536/Sx4B6taZ_400x400.jpg",
    content:
      "Ever wondered which card to use for what kind of payment!!! No more. Use the rewards calculator and be sure of the points and maximize your rewards!!!",
    url: "https://x.com/RewardsMaverick/status/1830421884623630555",
  },
  {
    id: 3,
    author: "Gajender Yadav",
    handle: "@imYadav31",
    avatar:
      "https://pbs.twimg.com/profile_images/1763209842020483072/Pa8pVMzP_400x400.jpg",
    content: "New Launch alert 🔥💯 Credit Card Reward Calculator 💰",
    url: "https://x.com/imYadav31/status/1830173465514475970",
  },
  {
    id: 4,
    author: "Bachat Xpert",
    handle: "@BachatXpert",
    avatar:
      "https://pbs.twimg.com/profile_images/1559278856988925953/BBSNPR2S_400x400.jpg",
    content:
      "Really liked @aashishvanand work on card by card expected points on various transactions. Visit http://ccreward.app Since its beta stage, u can test and give feedback to make corrections..",
    url: "https://x.com/BachatXpert/status/1830295336532979927",
  },
  {
    id: 5,
    author: "CardMaven",
    handle: "@CardMavenIn",
    avatar:
      "https://pbs.twimg.com/profile_images/1609594059651444737/EpWK43O__400x400.png",
    content:
      "Check out this credit card rewards calculator from @aashishvanand and know which is the best one for your spends ✅",
    url: "https://x.com/CardMavenIn/status/1830266994152837504",
  },
  {
    id: 6,
    author: "Creditkeeda",
    handle: "@creditkeeda",
    avatar:
      "https://pbs.twimg.com/profile_images/1785035352736231424/w1DKxAM8_400x400.jpg",
    content:
      "✨ If you're trying to figure out which card will give you the best rewards, check out this credit card rewards calculator. 🔥 👉 http://ccreward.app Great work, @aashishvanand! Best wishes! 🎉 #ccgeek #ccgeeks #CreditCardTips",
    url: "https://x.com/creditkeeda/status/1830219490463739933",
  },
  {
    id: 7,
    author: "Satish Kumar Agarwal",
    handle: "@iSatishAgarwal",
    avatar:
      "https://pbs.twimg.com/profile_images/1679892355405557768/3XHiJvsD_400x400.jpg",
    content:
      "Credit Card Rewards Calculator 📱 💰Maximize Rewards & Save time Great work @aashishvanand 👏 Like ❤️ n Repost ♻️ if useful #CreditCard #ccgeek",
    url: "https://x.com/iSatishAgarwal/status/1830639440861040697",
  },
];

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
  const [currentPage, setCurrentPage] = useState(0);
  const shuffledTweets = useMemo(() => {
    return [...tweets].sort(() => Math.random() - 0.5);
  }, []);
  const {
    cardImagesData,
    isLoading: isLoadingCardImages,
    error: cardImagesError,
  } = useCardImagesData();
  const tweetsPerPage = isMobile ? 1 : isTablet ? 2 : 3;
  const totalPages = Math.ceil(shuffledTweets.length / tweetsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  const visibleTweets = shuffledTweets.slice(
    currentPage * tweetsPerPage,
    (currentPage + 1) * tweetsPerPage
  );

  const bankImages = useMemo(() => {
    return bankImagesData.reduce((acc, bank) => {
      acc[bank.bank] = bank.id;
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    if (cardImagesData.length > 0) {
      const horizontalCards = cardImagesData.filter(
        (card) => card.orientation === "horizontal"
      );
      const shuffled = [...horizontalCards].sort(() => 0.5 - Math.random());
      setCardImages(shuffled.slice(0, 3));
    }
  }, [cardImagesData]);

  useEffect(() => {
    const horizontalCards = cardImagesData.filter(
      (card) => card.orientation === "horizontal"
    );
    const shuffled = [...horizontalCards].sort(() => 0.5 - Math.random());
    setCardImages(shuffled.slice(0, 3));
  }, []);

  const handleImageError = (failedCardId) => {
    setCardImages((prevImages) => {
      const newImages = prevImages.filter((img) => img.id !== failedCardId);
      if (newImages.length < 3) {
        const horizontalCards = cardImagesData.filter(
          (card) =>
            card.orientation === "horizontal" &&
            !prevImages.some((img) => img.id === card.id)
        );
        const additionalCard =
          horizontalCards[Math.floor(Math.random() * horizontalCards.length)];
        newImages.push(additionalCard);
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

  if (isLoading || loading || isLoadingCardImages) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
                    <Image
                      src={card.id}
                      alt={`${card.bank} ${card.cardName}`}
                      layout="fill"
                      objectFit="contain"
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
            {Object.entries(bankImages).map(([bank, imageId]) => (
              <Grid item key={bank} xs={6} sm={4} md={3} lg={2}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Image
                      src={imageId}
                      alt={`${bank.toUpperCase()} logo`}
                      width={80}
                      height={80}
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                  <Typography variant="subtitle2" align="center">
                    {bank.toUpperCase()}
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
        </Container>
      </Box>

      {/*X Community Recommendations */}
      <Box sx={{ bgcolor: "background.default", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            Recommended by the X Community
          </Typography>
          <Box
            sx={{ position: "relative", mt: 4, px: { xs: 4, sm: 6, md: 8 } }}
          >
            <IconButton
              onClick={handlePrevPage}
              sx={{
                position: "absolute",
                left: { xs: -8, sm: -16, md: -24 },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
              aria-label="Previous page"
            >
              <ChevronLeftIcon />
            </IconButton>
            <Grid container spacing={3} justifyContent="center">
              {visibleTweets.map((tweet) => (
                <Grid item xs={12} sm={6} md={4} key={tweet.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          src={tweet.avatar}
                          alt={tweet.author}
                          sx={{ mr: 2 }}
                        />
                        <Box>
                          <Typography variant="subtitle1">
                            {tweet.author}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {tweet.handle}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body1" sx={{ mb: 2, flexGrow: 1 }}>
                        {tweet.content}
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<TwitterIcon />}
                        href={tweet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        fullWidth
                        sx={{ mt: "auto" }}
                      >
                        View on X
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <IconButton
              onClick={handleNextPage}
              sx={{
                position: "absolute",
                right: { xs: -8, sm: -16, md: -24 },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
              aria-label="Next page"
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
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
