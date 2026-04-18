// src/features/bank/components/BankPage.jsx - Enhanced with Analytics
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Typography,
  Alert,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import TopCardsGrid from "../../top-cards/components/TopCardsGrid";
import { useAuth } from "@/core/providers/AuthContext";
import SignInDialog from "@/shared/components/auth/SignInDialog";
import useCardImagesData from "@/core/hooks/useCardImagesData";
import { motion } from "framer-motion";

// Add analytics imports
import {
  useAnalytics,
  usePagePerformance,
  useEngagementTracking,
  useJourneyTracking,
  useComponentAnalytics,
} from "@/core/hooks";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const BankPage = ({ bank, cards }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { user, signInWithGoogle, signInWithApple } = useAuth();

  // Analytics hooks
  const {
    trackButtonClick,
    trackFeatureUsage,
    trackConversion,
    trackNavigation,
    trackEvent,
  } = useAnalytics();
  const { recordCustomMetric } = usePagePerformance("bank-page");
  const { trackCustomEngagement } = useEngagementTracking();
  const { trackJourneyStep, trackJourneyCompletion } = useJourneyTracking();
  const { trackComponentError, trackComponentInteraction } =
    useComponentAnalytics("BankPage");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { cardImagesData } = useCardImagesData();

  // Track page load and bank-specific analytics
  useEffect(() => {
    trackFeatureUsage("bank_page_loaded", {
      bank_name: bank,
      cards_count: cards?.length || 0,
      user_authenticated: !!user,
      device_type: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
    });

    trackJourneyStep("bank_page_accessed", {
      bank_name: bank,
      source: "navigation",
      cards_available: cards?.length || 0,
    });

    recordCustomMetric("page_load_time", performance.now());
    recordCustomMetric("bank_cards_count", cards?.length || 0);

    // Track bank popularity
    trackEvent("bank_page_visit", {
      bank_name: bank,
      cards_available: cards?.length || 0,
      visit_timestamp: new Date().toISOString(),
    });
  }, [
    bank,
    cards,
    trackFeatureUsage,
    trackJourneyStep,
    trackEvent,
    recordCustomMetric,
    user,
    isMobile,
    isTablet,
  ]);

  // Track card images loading
  useEffect(() => {
    if (cardImagesData?.length > 0) {
      const bankCardsWithImages = getCardsWithImages();
      const imagesLoadedCount = bankCardsWithImages.filter(
        (card) => card.image
      ).length;

      trackEvent("bank_card_images_loaded", {
        bank_name: bank,
        total_cards: cards?.length || 0,
        images_loaded: imagesLoadedCount,
        images_missing: (cards?.length || 0) - imagesLoadedCount,
      });

      recordCustomMetric("card_images_loaded", imagesLoadedCount);
    }
  }, [cardImagesData, bank, cards, trackEvent, recordCustomMetric]);

  const getCardsWithImages = () => {
    return cards.map((cardName) => {
      const cardImage = cardImagesData?.find(
        (img) =>
          img.bank.toLowerCase() === bank.toLowerCase() &&
          img.cardName.toLowerCase() === cardName.toLowerCase()
      );
      return {
        bank,
        cardName,
        image: cardImage?.id,
        orientation: cardImage?.orientation,
      };
    });
  };

  // Enhanced card click handler with analytics
  const handleCardClick = (bank, cardName) => {
    trackButtonClick("bank_page_card_click", {
      bank_name: bank,
      card_name: cardName,
      user_authenticated: !!user,
      device_type: isMobile ? "mobile" : "desktop",
      source: "bank_page",
    });

    trackCustomEngagement("card_selection_interaction", {
      bank: bank,
      card: cardName,
    });

    if (user) {
      trackJourneyStep("card_selected_authenticated", {
        bank_name: bank,
        card_name: cardName,
        destination: "calculator",
      });

      trackNavigation(
        `/calculator?bank=${bank}&card=${cardName}`,
        "card_selection"
      );
      router.push(`/calculator?bank=${bank}&card=${cardName}`);

      trackConversion("bank_page_to_calculator", 1);
    } else {
      trackJourneyStep("card_selected_unauthenticated", {
        bank_name: bank,
        card_name: cardName,
        action_required: "sign_in",
      });

      trackEvent("sign_in_required_from_bank_page", {
        bank_name: bank,
        card_name: cardName,
        source: "bank_page",
      });

      setSelectedCard({ bank, cardName });
      setOpenDialog(true);
    }
  };

  // Enhanced dialog handlers with analytics
  const handleCloseDialog = () => {
    trackButtonClick("sign_in_dialog_close", {
      bank_name: bank,
      selected_card: selectedCard
        ? `${selectedCard.bank} ${selectedCard.cardName}`
        : "none",
      action: "dismiss",
    });

    trackJourneyStep("sign_in_dialog_dismissed", {
      bank_name: bank,
      selected_card: selectedCard?.cardName,
    });

    setOpenDialog(false);
    setSelectedCard(null);
  };

  const handleSignInWith = async (signInMethod, methodName) => {
    trackButtonClick("sign_in_from_bank_page", {
      method: methodName,
      bank_name: bank,
      selected_card: selectedCard
        ? `${selectedCard.bank} ${selectedCard.cardName}`
        : "none",
      source: "bank_page_dialog",
    });

    const startTime = performance.now();

    try {
      await signInMethod();

      const signInDuration = performance.now() - startTime;

      trackConversion("bank_page_sign_in", 1);
      trackJourneyCompletion("sign_in_success_bank_page", {
        method: methodName,
        bank_name: bank,
        selected_card: selectedCard?.cardName,
        sign_in_duration: Math.round(signInDuration),
      });

      trackEvent("sign_in_success_bank_page", {
        method: methodName,
        bank_name: bank,
        selected_card: selectedCard
          ? `${selectedCard.bank} ${selectedCard.cardName}`
          : "none",
        sign_in_duration: Math.round(signInDuration),
      });

      recordCustomMetric("sign_in_duration", Math.round(signInDuration));

      if (selectedCard) {
        trackNavigation(
          `/calculator?bank=${selectedCard.bank}&card=${selectedCard.cardName}`,
          "post_signin_redirect"
        );
        router.push(
          `/calculator?bank=${selectedCard.bank}&card=${selectedCard.cardName}`
        );
      }
    } catch (error) {
      const signInDuration = performance.now() - startTime;

      trackComponentError("sign_in_failed_bank_page", {
        method: methodName,
        bank_name: bank,
        selected_card: selectedCard
          ? `${selectedCard.bank} ${selectedCard.cardName}`
          : "none",
        error_message: error.message,
        sign_in_duration: Math.round(signInDuration),
      });

      setAlert({
        open: true,
        message: "Failed to sign in. Please try again.",
        severity: "error",
      });
    }
  };

  // Track card grid interactions
  const handleCardGridInteraction = (interactionType, cardData = {}) => {
    trackComponentInteraction("bank_card_grid_interaction", {
      interaction_type: interactionType,
      bank_name: bank,
      ...cardData,
    });
  };

  // Track scroll engagement
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );

      if (scrollPercent > 0 && scrollPercent % 25 === 0) {
        trackCustomEngagement("bank_page_scroll", {
          scroll_percentage: scrollPercent,
          bank_name: bank,
          cards_count: cards?.length || 0,
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [bank, cards, trackCustomEngagement]);

  // Track page exit
  useEffect(() => {
    return () => {
      trackJourneyStep("bank_page_exit", {
        bank_name: bank,
        time_on_page: performance.now(),
      });
    };
  }, [bank, trackJourneyStep]);

  const bankCards = getCardsWithImages();

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />

        <Container component="main" sx={{ py: 4, flexGrow: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 4,
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
            }}
          >
            {bank} Credit Cards
          </Typography>

          {bankCards.length > 0 ? (
            <Box sx={{ width: "100%" }}>
              <TopCardsGrid
                cards={bankCards}
                isMobile={isMobile}
                isTablet={isTablet}
                handleCardClick={handleCardClick}
                theme={theme}
                onInteraction={handleCardGridInteraction}
              />
            </Box>
          ) : (
            <Alert severity="info">No cards found for this bank.</Alert>
          )}
        </Container>

        <SignInDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onGoogleSignIn={() => handleSignInWith(signInWithGoogle, 'google')}
          onAppleSignIn={() => handleSignInWith(signInWithApple, 'apple')}
          title="Sign In Required"
          message="Please sign in to calculate your rewards."
          onCancel={handleCloseDialog}
        />

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

        <Footer />
      </Box>
    </motion.div>
  );
};

export default BankPage;
