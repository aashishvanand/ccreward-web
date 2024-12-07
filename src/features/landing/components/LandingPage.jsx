import { useState, useEffect, useMemo } from "react";
import { Box, Alert, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../core/providers/AuthContext";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getCardsForUser } from "../../../core/services/firebaseUtils";
import useCardImagesData from "../../../core/hooks/useCardImagesData";
import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";
import HeroSection from "./HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import BankSection from "./sections/BankSection";
import CallToActionSection from "./sections/CallToActionSection";
import AppStoreSection from "./sections/AppStoreSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import MobileAppPromotion from "./MobileAppPromotion";
import TopCardsSection from "./sections/TopCardsSection";
import { tweets } from "../../../shared/constants/testimonials";
import { detectDevice } from "../../../core/utils/deviceUtils";
import TopSearchs from "./sections/TopSearchs";
import StatsSection from "./sections/StatsSection";

const MobileView = ({
  deviceInfo,
  visibleTweets,
  handlePrevPage,
  handleNextPage,
  isMobile,
  theme,
  alert,
  setAlert,
}) => {
  if (!deviceInfo) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Main Content with higher z-index */}
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            // add some backdrop or slight opacity to ensure text legibility
            backdropFilter: "blur(2px)",
          }}
        >
          <Container maxWidth="lg" sx={{ pt: { xs: 4, sm: 6 }, pb: 3 }}>
            <Typography
              variant="h2"
              align="center"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem" },
                fontWeight: "bold",
                mb: 2,
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
              }}
            >
              Download our app for the best credit card rewards experience
            </Typography>
          </Container>

          <Box component="section">
            <MobileAppPromotion isAndroid={Boolean(deviceInfo.isAndroid)} />
          </Box>

          <Box component="section">
            <FeaturesSection />
          </Box>

          <Box component="section" sx={{ bgcolor: "background.paper" }}>
            <StatsSection />
          </Box>

          <Box component="section" sx={{ bgcolor: "background.default" }}>
            <TopCardsSection />
          </Box>

          <Box sx={{ bgcolor: "background.paper" }}>
            <TopSearchs />
          </Box>

          <Box component="section" sx={{ bgcolor: "background.default" }}>
            <BankSection />
          </Box>

          <Box component="section" sx={{ bgcolor: "background.paper" }}>
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
    </Box>
  );
};

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
  setAlert,
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      position: "relative",
    }}
  >
    <Box className="absolute inset-0 z-0 overflow-hidden"></Box>
    {/* Main Content with higher z-index */}
    <Box className="relative z-10">
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

      <Box sx={{ bgcolor: "background.default" }}>
        <FeaturesSection />
      </Box>

      <Box sx={{ bgcolor: "background.paper" }}>
        <StatsSection />
      </Box>

      <Box sx={{ bgcolor: "background.default" }}>
        <TopCardsSection />
      </Box>

      <Box sx={{ bgcolor: "background.paper" }}>
        <TopSearchs />
      </Box>

      <Box sx={{ bgcolor: "background.default" }}>
        <BankSection />
      </Box>

      <CallToActionSection
        isAuthenticated={isAuthenticated}
        handleSignIn={handleSignIn}
        signInWithGoogle={signInWithGoogle}
      />

      <Box sx={{ bgcolor: "background.default" }}>
        <AppStoreSection isMobile={isMobile} theme={theme} />
      </Box>

      <Box sx={{ bgcolor: "background.paper" }}>
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
  </Box>
);

const LandingPage = () => {
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
    isTablet: false,
  });

  const { cardImagesData } = useCardImagesData();

  const tweetsPerPage = isMobile ? 1 : isTablet ? 2 : 3;
  const totalPages = Math.ceil(tweets.length / tweetsPerPage);

  const visibleTweets = useMemo(
    () =>
      tweets.slice(
        currentPage * tweetsPerPage,
        (currentPage + 1) * tweetsPerPage
      ),
    [currentPage, tweetsPerPage]
  );

  useEffect(() => {
    const initialDeviceInfo = detectDevice();
    setDeviceInfo(initialDeviceInfo);

    const handleResize = () => {
      const updatedDeviceInfo = detectDevice();
      setDeviceInfo(updatedDeviceInfo);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobileDevice = Boolean(
    deviceInfo?.isMobile || deviceInfo?.isAndroid || deviceInfo?.isIOS
  );

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
      if (error.code === "auth/popup-closed-by-user") {
        setAlert({
          open: false,
          message: "",
          severity: "info",
        });
      } else if (error.code === "auth/cancelled-popup-request") {
        setAlert({
          open: true,
          message:
            "Another sign-in window is already open. Please close it and try again.",
          severity: "warning",
        });
      } else if (error.code === "auth/popup-blocked") {
        setAlert({
          open: true,
          message:
            "Pop-up was blocked by your browser. Please enable pop-ups and try again.",
          severity: "warning",
        });
      } else {
        setAlert({
          open: true,
          message: "Failed to sign in. Please try again.",
          severity: "error",
        });
      }
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

  const commonProps = {
    visibleTweets,
    handlePrevPage,
    handleNextPage,
    isMobile,
    theme,
    alert,
    setAlert,
    deviceInfo,
  };

  return isMobileDevice ? (
    <MobileView {...commonProps} />
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
