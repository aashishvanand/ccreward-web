"use client";
// src/features/top-cards/components/TopCardsPage.jsx - Enhanced with Analytics
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/core/providers/AuthContext";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import useCardImagesData from "@/core/hooks/useCardImagesData";
import useCardCategories, {
  getCardsForCategory,
} from "@/core/hooks/useCardCategories";
import TopCardsGrid from "./TopCardsGrid";
import {
  Box,
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useRegion } from "@/core/providers/RegionContext";
import { motion } from "framer-motion";

// Add analytics imports
import {
  useAnalytics,
  usePagePerformance,
  useEngagementTracking,
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

const categories = [
  "Education",
  "Entertainment",
  "Food & Dining",
  "Government/Tax",
  "Groceries",
  "Healthcare & Medical",
  "Insurance",
  "International Spends",
  "Jewellery",
  "Offline Shopping",
  "Online Shopping",
  "Petrol",
  "Travel & Transportation",
  "Utility Bill",
  "Wallet Loading",
];

const TopCardsPage = ({ initialCategories, initialCardImages }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { user, signInWithGoogle } = useAuth();

  // Analytics hooks
  const { trackButtonClick, trackFeatureUsage, trackEvent, trackNavigation } =
    useAnalytics();
  const { recordCustomMetric } = usePagePerformance("top-cards");
  const { trackCustomEngagement } = useEngagementTracking();
  const { trackComponentError } = useComponentAnalytics("TopCardsPage");

  const [category, setCategory] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { cardImagesData, isLoading: isLoadingCardImages } =
    useCardImagesData(initialCardImages);
  const {
    categories: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCardCategories(initialCategories);
  const [isValidating, setIsValidating] = useState(false);
  const searchParams = useSearchParams();

  // Track page load
  useEffect(() => {
    trackFeatureUsage("top_cards_page_loaded", {
      user_authenticated: !!user,
      device_type: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
    });

    recordCustomMetric("page_load_time", performance.now());
  }, [trackFeatureUsage, recordCustomMetric, user, isMobile, isTablet]);

  // Validate category helper function
  const isValidCategory = (cat) => categories.includes(cat);

  // Handle URL category parameter with analytics
  useEffect(() => {
    const validateAndSetCategory = async () => {
      setIsValidating(true);
      try {
        const categoryFromUrl = searchParams.get("category");
        if (categoryFromUrl) {
          const decodedCategory = decodeURIComponent(categoryFromUrl);

          trackEvent("category_url_parameter_detected", {
            category: decodedCategory,
            is_valid: isValidCategory(decodedCategory),
          });

          if (isValidCategory(decodedCategory)) {
            setCategory(decodedCategory);

            trackEvent("category_set_from_url", {
              category: decodedCategory,
            });
          } else {
            trackComponentError("invalid_category_in_url", {
              invalid_category: decodedCategory,
              valid_categories: categories,
            });

            setAlert({
              open: true,
              message: "Invalid category specified. Showing all categories.",
              severity: "warning",
            });
            router.push("/top-cards", undefined, { shallow: true });
          }
        }
      } catch (error) {
        trackComponentError("category_validation_error", {
          error_message: error.message,
        });

        console.error("Error validating category:", error);
        setAlert({
          open: true,
          message: "Error processing category. Please try again.",
          severity: "error",
        });
      } finally {
        setIsValidating(false);
      }
    };

    validateAndSetCategory();
  }, [searchParams, router, trackEvent, trackComponentError]);

  // Update URL when category changes
  useEffect(() => {
    if (!isValidating) {
      if (category) {
        trackNavigation(
          `/top-cards?category=${encodeURIComponent(category)}`,
          "category_filter"
        );
        router.push(
          `/top-cards?category=${encodeURIComponent(category)}`,
          undefined,
          { shallow: true }
        );
      } else {
        router.push("/top-cards", undefined, { shallow: true });
      }
    }
  }, [category, router, isValidating, trackNavigation]);

  const getCardsWithImages = (categoryName) => {
    if (!categoriesData) return [];
    const categoryCards = getCardsForCategory(categoryName, categoriesData);
    return categoryCards.map((card) => {
      const cardImage = cardImagesData.find(
        (img) =>
          img.bank.toLowerCase() === card.bank.toLowerCase() &&
          img.cardName.toLowerCase() === card.cardName.toLowerCase()
      );
      return {
        ...card,
        image: cardImage?.id,
        orientation: cardImage?.orientation,
      };
    });
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;

    trackButtonClick("category_dropdown_change", {
      old_category: category,
      new_category: newCategory,
      category_valid: isValidCategory(newCategory),
    });

    trackCustomEngagement("category_selection", {
      category: newCategory,
      source: "dropdown",
    });

    if (isValidCategory(newCategory)) {
      setCategory(newCategory);

      // Track category analytics
      if (categoriesData && categoriesData[newCategory]) {
        const categoryCards = getCardsForCategory(newCategory, categoriesData);
        trackEvent("category_selected", {
          category: newCategory,
          cards_available: categoryCards.length,
          selection_method: "dropdown",
        });
      }
    } else {
      trackComponentError("invalid_category_selected", {
        invalid_category: newCategory,
      });

      setAlert({
        open: true,
        message: "Invalid category selected.",
        severity: "error",
      });
    }
  };

  const handleCardClick = (bank, cardName) => {
    trackButtonClick("card_click_from_top_cards", {
      bank,
      card_name: cardName,
      category: category || "all",
      user_authenticated: !!user,
      device_type: isMobile ? "mobile" : "desktop",
    });

    if (user) {
      trackNavigation(
        `/calculator?bank=${bank}&card=${cardName}`,
        "card_selection"
      );
      router.push(`/calculator?bank=${bank}&card=${cardName}`);
    } else {
      trackEvent("sign_in_required_for_card", {
        bank,
        card_name: cardName,
        source: "top_cards_page",
      });

      setSelectedCard({ bank, cardName });
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    trackButtonClick("sign_in_dialog_close", {
      selected_card: selectedCard
        ? `${selectedCard.bank} ${selectedCard.cardName}`
        : "none",
    });

    setOpenDialog(false);
    setSelectedCard(null);
  };

  const handleSignIn = async () => {
    trackButtonClick("sign_in_from_top_cards", {
      selected_card: selectedCard
        ? `${selectedCard.bank} ${selectedCard.cardName}`
        : "none",
      category: category || "all",
    });

    try {
      await signInWithGoogle();

      if (selectedCard) {
        trackNavigation(
          `/calculator?bank=${selectedCard.bank}&card=${selectedCard.cardName}`,
          "post_signin_redirect"
        );
        router.push(
          `/calculator?bank=${selectedCard.bank}&card=${selectedCard.cardName}`
        );
      }

      trackEvent("sign_in_success_top_cards", {
        selected_card: selectedCard
          ? `${selectedCard.bank} ${selectedCard.cardName}`
          : "none",
      });
    } catch (error) {
      trackComponentError("sign_in_failed_top_cards", {
        error_message: error.message,
        selected_card: selectedCard
          ? `${selectedCard.bank} ${selectedCard.cardName}`
          : "none",
      });

      setAlert({
        open: true,
        message: "Failed to sign in. Please try again.",
        severity: "error",
      });
    }
  };

  const isLoading = isLoadingCategories || isLoadingCardImages || isValidating;
  const categoryCards = category ? getCardsWithImages(category) : [];

  // Track category performance
  useEffect(() => {
    if (category && categoryCards.length > 0) {
      recordCustomMetric("category_cards_loaded", categoryCards.length);

      trackEvent("category_cards_displayed", {
        category,
        cards_count: categoryCards.length,
        load_time: performance.now(),
      });
    }
  }, [category, categoryCards.length, recordCustomMetric, trackEvent]);

  // Track scroll engagement
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );

      if (scrollPercent > 0 && scrollPercent % 25 === 0) {
        trackCustomEngagement("page_scroll", {
          scroll_percentage: scrollPercent,
          category: category || "all",
          cards_visible: categoryCards.length,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [category, categoryCards.length, trackCustomEngagement]);

  if (categoriesError) {
    trackComponentError("categories_load_error", {
      error_message: categoriesError.message,
    });

    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <Container component="main" sx={{ py: 4, flexGrow: 1 }}>
          <Alert severity="error">
            Error loading categories. Please try again later.
          </Alert>
        </Container>
        <Footer />
      </Box>
    );
  }

  const { region, regionName } = useRegion(); // Get region name

  const getSeoMetadata = () => {
    let title = "Top Credit Cards - CCReward";
    let description = "Discover the best credit cards for your spending needs.";

    if (category) {
      const regionText = regionName ? `in ${regionName}` : "";
      title = `Top ${category} Credit Cards ${regionText} - CCReward`;
      description = `Discover the best credit cards for ${category} spending ${regionText}. Compare rewards and benefits.`;
    } else {
      const regionText = regionName ? `in ${regionName}` : "";
      title = `Top Credit Cards ${regionText} - CCReward`;
      description = `Discover the best credit cards ${regionText}. Compare rewards across categories like Shopping, Travel, and Dining.`;
    }

    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
      </>
    );
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {getSeoMetadata()}
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
            Top Cards by Category
          </Typography>

          <Select
            value={category}
            onChange={handleCategoryChange}
            displayEmpty
            fullWidth
            sx={{ mb: 4 }}
          >
            <MenuItem value="" disabled>
              Select a payment category
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {category && categoryCards.length > 0 && (
                <>
                  <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
                    Top Cards for {category}
                  </Typography>

                  <Box sx={{ width: "100%" }}>
                    <TopCardsGrid
                      cards={categoryCards}
                      isMobile={isMobile}
                      isTablet={isTablet}
                      handleCardClick={handleCardClick}
                      theme={theme}
                    />
                  </Box>
                </>
              )}

              {category && categoryCards.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No cards found for this category.
                </Alert>
              )}
            </>
          )}
        </Container>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Sign In Required</DialogTitle>
          <DialogContent>
            <Typography>Please sign in to calculate your rewards.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSignIn} variant="contained">
              Sign In with Google
            </Button>
          </DialogActions>
        </Dialog>

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

export default TopCardsPage;
