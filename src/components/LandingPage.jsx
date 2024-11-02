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
  Alert,
  CardContent,
  Avatar,
  IconButton,
  useTheme,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  Calculate as CalculateIcon,
  Bolt as BoltIcon,
  CompareArrows as CompareArrowsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  X as XIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/providers/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import { getCardsForUser } from "../utils/firebaseUtils";
import useCardImagesData from "../hooks/useCardImagesData";
import bankImagesData from "../data/bankImages";
import Image from "next/image";

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
  {
    id: 8,
    author: "Nebula World",
    handle: "@nebula_world",
    avatar:
      "https://pbs.twimg.com/profile_images/1628247643855126529/MLXfPLCj_400x400.jpg",
    content:
      "This app can be your rewards buddy for credit cards optimisation.. Install and start using ⤵️",
    url: "https://x.com/nebula_world/status/1848710824044417415",
  },
];

const features = [
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
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [hasCheckedCards, setHasCheckedCards] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const {
    cardImagesData,
    isLoading: isLoadingCardImages,
    error: cardImagesError,
  } = useCardImagesData();

  const tweetsPerPage = isMobile ? 1 : isTablet ? 2 : 3;
  const totalPages = Math.ceil(tweets.length / tweetsPerPage);
  const visibleTweets = useMemo(() => {
    return tweets.slice(
      currentPage * tweetsPerPage,
      (currentPage + 1) * tweetsPerPage
    );
  }, [currentPage, tweetsPerPage]);

  useEffect(() => {
    if (cardImagesData.length > 0) {
      const horizontalCards = cardImagesData.filter(
        (card) => card.orientation === "horizontal"
      );
      const shuffled = [...horizontalCards].sort(() => Math.random() - 0.5);
      setCardImages(shuffled.slice(0, 3));
    }
  }, [cardImagesData]);

  useEffect(() => {
    const authenticated = isAuthenticated();
    if (!loading && authenticated && user?.uid && !hasCheckedCards) {
      const checkUserCards = async () => {
        try {
          const fetchedCards = await getCardsForUser(user.uid);
          if (fetchedCards.length === 0) {
            router.push("/my-cards");
          }
        } catch (error) {
          console.error("Error checking user cards:", error);
          setAlert({
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
      setAlert({
        open: true,
        message: "Sign-in successful! You can now use all features of the app.",
        severity: "success",
      });
      setHasCheckedCards(false);
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Hero Section
  const renderHeroSection = () => (
    <Box 
      sx={{ 
        bgcolor: "background.default", 
        py: { xs: 4, md: 6, lg: 8 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.75rem" },
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Maximize Your Rewards with the Right Credit Card
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "text.secondary",
                mb: 4,
                fontSize: { xs: "1.125rem", md: "1.5rem" },
              }}
            >
              Compare cards, calculate rewards, and find the perfect credit card
              for your spending habits.
            </Typography>
            {!loading && !isAuthenticated() && (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleSignIn(signInWithGoogle)}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                  sx={{
                    height: 48,
                    px: 4,
                    fontSize: "1.125rem",
                  }}
                >
                  Sign in with Google
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleSignIn(signInAnonymously)}
                  disabled={isLoading}
                  sx={{
                    height: 48,
                    px: 4,
                    fontSize: "1.125rem",
                  }}
                >
                  Continue Anonymously
                </Button>
              </Stack>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
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
                  elevation={4}
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
                  />
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // Features Section
  const renderFeaturesSection = () => (
    <Box sx={{ bgcolor: "background.paper", py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 4,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    color: "primary.main",
                    fontSize: "3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {React.cloneElement(feature.icon, { fontSize: "inherit" })}
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  align="center"
                  sx={{ fontWeight: "medium" }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
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
  );

  // Banks Section
  const renderBanksSection = () => (
    <Box sx={{ bgcolor: "background.default", py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Supported Banks
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {bankImagesData.map((bank) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={bank.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
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
                    src={bank.id}
                    alt={`${bank.bank.toUpperCase()} logo`}
                    width={80}
                    height={80}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Typography variant="subtitle2" align="center">
                  {bank.bank.toUpperCase()}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );

  // Testimonials Section
  const renderTestimonialsSection = () => (
    <Box sx={{ bgcolor: "background.default", py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Recommended by the X Community
        </Typography>
        <Box sx={{ position: "relative", px: { xs: 4, sm: 6, md: 8 } }}>
          <IconButton
            onClick={handlePrevPage}
            sx={{
              position: "absolute",
              left: { xs: -8, sm: -16, md: -24 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
          </IconButton>

          <Grid container spacing={3} justifyContent="center">
            {visibleTweets.map((tweet) => (
              <Grid item xs={12} sm={6} md={4} key={tweet.id}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: (theme) => theme.shadows[4],
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar src={tweet.avatar} alt={tweet.author} sx={{ mr: 2, width: 48, height: 48 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
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
                      href={tweet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      fullWidth
                      sx={{
                        mt: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                    >
                      View on <XIcon sx={{ fontSize: 16 }} />
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
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
            aria-label="Next page"
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );

  // Call to Action Section
  const renderCallToActionSection = () => (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        py: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Ready to Maximize Your Rewards?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              opacity: 0.9,
            }}
          >
            Start comparing cards and maximizing your rewards today.
          </Typography>
          {!isAuthenticated() && (
            <Button
              variant="contained"
              size="large"
              onClick={() => handleSignIn(signInWithGoogle)}
              sx={{
                mt: 4,
                bgcolor: "background.paper",
                color: "primary.main",
                fontSize: "1.125rem",
                py: 1.5,
                px: 4,
                "&:hover": {
                  bgcolor: "background.paper",
                  opacity: 0.9,
                },
              }}
            >
              Get Started Now
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );

  // App Store Section
  const renderAppStoreSection = () => (
  <Box sx={{ bgcolor: "background.paper", py: 8 }}>
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          }}
        >
          Get CCReward App on Your Device
        </Typography>
        <Typography
          variant="h5"
          sx={{
            maxWidth: "600px",
            mb: 6,
            color: "text.secondary",
          }}
        >
          Download the app to maximize your credit card rewards on the go!
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            mb: 4,
            width: "100%",
          }}
        >
          {/* App Store Button */}
          <Box
            component="a"
            href="https://apps.apple.com/in/app/ccreward/id6736835206"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              src={
                theme.palette.mode === "dark"
                  ? "d6909a96-9073-4189-84ea-54475d93ac00"
                  : "60ca24d3-0052-4177-4da7-ce7fc0d24a00"
              }
              alt="Download on the App Store"
              width={200}
              height={60}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Google Play Button */}
          <Box
            component="a"
            href="https://play.google.com/store/apps/details?id=app.ccreward"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              src="9a793092-57c3-41e6-15d3-9801d75ae900"
              alt="Get it on Google Play"
              width={200}
              height={60}
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  </Box>
);

  // Main Return with Alert
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      {renderHeroSection()}
      {renderFeaturesSection()}
      {renderBanksSection()}
      {renderTestimonialsSection()}
      {renderCallToActionSection()}
      {renderAppStoreSection()}
      {renderTestimonialsSection()}
      <Footer />
      
      {alert.open && (
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: (theme) => theme.zIndex.snackbar,
            maxWidth: "90%",
            width: "auto",
            boxShadow: (theme) => theme.shadows[8],
          }}
        >
          {alert.message}
        </Alert>
      )}
    </Box>
  );
}