import { useState, useEffect, useMemo } from "react";
import { Box, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../core/providers/AuthContext";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getCardsForUser } from "../../../core/services/firebaseUtils";
import useCardImagesData from "../../../core/hooks/useCardImagesData";
import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import BankSection from "../components/sections/BankSection";
import CallToActionSection from "../components/sections/CallToActionSection";
import AppStoreSection from "../components/sections/AppStoreSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import { tweets } from "../../../shared/constants/testimonials";

const LandingPage = () => {
  const router = useRouter();
  const {
    signInWithGoogle,
    signInAnonymously,
    user,
    isAuthenticated,
    loading,
    isNewUser,
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
  const [error, setError] = useState(null);

  const { cardImagesData, isLoading: isLoadingCardImages } =
    useCardImagesData();

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <HeroSection
        cardImages={cardImages}
        isMobile={isMobile}
        isTablet={isTablet}
        isLargeScreen={isLargeScreen}
        handleSignIn={handleSignIn}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated()}
        loading={loading}
        signInWithGoogle={signInWithGoogle}
        signInAnonymously={signInAnonymously}
      />

      <FeaturesSection />
      <BankSection />

      <CallToActionSection
        isAuthenticated={isAuthenticated()}
        handleSignIn={handleSignIn}
        signInWithGoogle={signInWithGoogle}
      />

      <AppStoreSection isMobile={isMobile} theme={theme} />

      <TestimonialsSection
        visibleTweets={visibleTweets}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        isMobile={isMobile}
      />

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
};

export default LandingPage;
