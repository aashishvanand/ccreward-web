import { useState, useEffect, useMemo } from "react";
import { Box, Alert, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../core/providers/AuthContext";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getCardsForUser } from "../../../core/services/firebaseUtils";
import useCardImagesData from "../../../core/hooks/useCardImagesData";
import { detectDevice } from "../../../core/utils/deviceUtils";
import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";
import HeroSection from "./HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import BankSection from "./sections/BankSection";
import CallToActionSection from "./sections/CallToActionSection";
import AppStoreSection from "./sections/AppStoreSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import MobileAppPromotion from "./MobileAppPromotion";
import { tweets } from "../../../shared/constants/testimonials";

const MobileView = ({
  deviceInfo,
  visibleTweets,
  handlePrevPage,
  handleNextPage,
  isMobile,
  theme,
  alert,
  setAlert
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <Header />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: "background.default",
        position: "relative",
        zIndex: 0
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem" },
            fontWeight: "bold",
            mb: 3
          }}
        >
          Get the CCReward App
        </Typography>
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontSize: { xs: "1.125rem", sm: "1.25rem" },
            color: "text.secondary",
            mb: 4
          }}
        >
          Download our app for the best credit card rewards experience
        </Typography>
      </Container>

      <MobileAppPromotion
        isAndroid={deviceInfo.isAndroid}
        androidScreenshots={[
          "f8cfbf48-0e82-4095-89d8-3dbbd9406700",
          "e89a3c45-b747-4fc5-ae82-9afbc7112800",
          "9c347c88-aff4-4d98-2e05-3b5271de9f00",
          "0f7a22f5-00aa-457d-212f-2490e22ea900"
        ]}
        iosScreenshots={[
          "439c672a-a623-4006-dbc0-147d773a6300",
          "5efcffce-4ba7-46ce-54ca-2803b2291c00",
          "f48ef214-901e-437d-5c5c-b7b8820e5900"
        ]}
      />

      <Box sx={{ bgcolor: 'background.paper' }}>
        <BankSection />
      </Box>

      <Box sx={{ bgcolor: 'background.default' }}>
        <FeaturesSection />
      </Box>

      <Box sx={{ bgcolor: 'background.default' }}>
        <TestimonialsSection
          visibleTweets={visibleTweets}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          isMobile={isMobile}
        />
      </Box>
    </Box>
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
          zIndex: theme.zIndex.snackbar,
          maxWidth: "90%",
          width: "auto",
          boxShadow: theme.shadows[8],
        }}
      >
        {alert.message}
      </Alert>
    )}
  </Box>
);

const DesktopView = ({
  cardImages,
  isMobile,
  isTablet,
  isLargeScreen,
  handleSignIn,
  isLoading,
  isAuthenticated,
  loading,
  signInWithGoogle,
  signInAnonymously,
  visibleTweets,
  handlePrevPage,
  handleNextPage,
  theme,
  alert,
  setAlert
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <Header />

    <HeroSection
      cardImages={cardImages}
      isMobile={isMobile}
      isTablet={isTablet}
      isLargeScreen={isLargeScreen}
      handleSignIn={handleSignIn}
      isLoading={isLoading}
      isAuthenticated={isAuthenticated}
      loading={loading}
      signInWithGoogle={signInWithGoogle}
      signInAnonymously={signInAnonymously}
    />

    <Box sx={{ bgcolor: 'background.default' }}>
      <FeaturesSection />
    </Box>

    <Box sx={{ bgcolor: 'background.paper' }}>
      <BankSection />
    </Box>

    <CallToActionSection
      isAuthenticated={isAuthenticated}
      handleSignIn={handleSignIn}
      signInWithGoogle={signInWithGoogle}
    />

    <Box sx={{ bgcolor: 'background.default' }}>
      <AppStoreSection isMobile={isMobile} theme={theme} />
    </Box>

    <Box sx={{ bgcolor: 'background.paper'}}>
      <TestimonialsSection
        visibleTweets={visibleTweets}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        isMobile={isMobile}
      />
    </Box>

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
          zIndex: theme.zIndex.snackbar,
          maxWidth: "90%",
          width: "auto",
          boxShadow: theme.shadows[8],
        }}
      >
        {alert.message}
      </Alert>
    )}
  </Box>
);

const LandingPage = () => {
  // All hooks at the top
  const router = useRouter();
  const {
    signInWithGoogle,
    signInAnonymously,
    user,
    isAuthenticated,
    loading,
  } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [cardImages, setCardImages] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [hasCheckedCards, setHasCheckedCards] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isAndroid: false,
    isIOS: false,
    isTablet: false
  });

  const { cardImagesData } = useCardImagesData();

  const tweetsPerPage = isMobile ? 1 : isTablet ? 2 : 3;
  const totalPages = Math.ceil(tweets.length / tweetsPerPage);

  const visibleTweets = useMemo(
    () => tweets.slice(
      currentPage * tweetsPerPage,
      (currentPage + 1) * tweetsPerPage
    ),
    [currentPage, tweetsPerPage]
  );

  // All useEffects
  useEffect(() => {
    setDeviceInfo(detectDevice());
  }, []);

  useEffect(() => {
    if (cardImagesData?.length > 0) {
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

  // Handlers
  const handleSignIn = async (signInMethod) => {
    setIsLoading(true);
    try {
      await signInMethod();
      setAlert({
        open: true,
        message: "Sign-in successful!",
        severity: "success",
      });
      setHasCheckedCards(false);
    } catch (error) {
      console.error("Error signing in:", error);
      setAlert({
        open: true,
        message: "Failed to sign in. Please try again.",
        severity: "error"
      });
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

  // Common props
  const commonProps = {
    visibleTweets,
    handlePrevPage,
    handleNextPage,
    isMobile,
    theme,
    alert,
    setAlert
  };

  // Render based on device type
  return deviceInfo.isAndroid || deviceInfo.isIOS ? (
    <MobileView
      {...commonProps}
      deviceInfo={deviceInfo}
    />
  ) : (
    <DesktopView
      {...commonProps}
      cardImages={cardImages}
      isTablet={isTablet}
      isLargeScreen={isLargeScreen}
      handleSignIn={handleSignIn}
      isLoading={isLoading}
      isAuthenticated={isAuthenticated()}
      loading={loading}
      signInWithGoogle={signInWithGoogle}
      signInAnonymously={signInAnonymously}
    />
  );
};

export default LandingPage;