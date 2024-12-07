import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../core/providers/AuthContext";
import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";
import useCardImagesData from "../../../core/hooks/useCardImagesData";
import useCardCategories, {
  getCardsForCategory,
} from "../../../core/hooks/useCardCategories";
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

const categories = [
  "Education",
  "Entertainment",
  "Food & Dining",
  "Government/Tax",
  "Groceries",
  "Healthcare & Medical",
  "Insurance",
  "International Spends",
  "Jwellery",
  "Offline Shopping",
  "Online Shopping",
  "Petrol",
  "Travel & Transportation",
  "Utility Bill",
  "Wallet Loading",
];

const TopCardsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { user, signInWithGoogle } = useAuth();
  const [category, setCategory] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { cardImagesData, isLoading: isLoadingCardImages } =
    useCardImagesData();
  const {
    categories: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCardCategories();
  const [isValidating, setIsValidating] = useState(false);
  const searchParams = useSearchParams();

  // Validate category helper function
  const isValidCategory = (cat) => categories.includes(cat);

  // Handle URL category parameter
  useEffect(() => {
    const validateAndSetCategory = async () => {
      setIsValidating(true);
      try {
        const categoryFromUrl = searchParams.get("category");
        if (categoryFromUrl) {
          const decodedCategory = decodeURIComponent(categoryFromUrl);

          if (isValidCategory(decodedCategory)) {
            setCategory(decodedCategory);
          } else {
            setAlert({
              open: true,
              message: "Invalid category specified. Showing all categories.",
              severity: "warning",
            });
            router.push("/top-cards", undefined, { shallow: true });
          }
        }
      } catch (error) {
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
  }, [searchParams, router]);

  // Update URL when category changes
  useEffect(() => {
    if (!isValidating) {
      if (category) {
        router.push(
          `/top-cards?category=${encodeURIComponent(category)}`,
          undefined,
          { shallow: true }
        );
      } else {
        router.push("/top-cards", undefined, { shallow: true });
      }
    }
  }, [category, router, isValidating]);

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
    if (isValidCategory(newCategory)) {
      setCategory(newCategory);
    } else {
      setAlert({
        open: true,
        message: "Invalid category selected.",
        severity: "error",
      });
    }
  };

  const handleCardClick = (bank, cardName) => {
    if (user) {
      router.push(`/calculator?bank=${bank}&card=${cardName}`);
    } else {
      setSelectedCard({ bank, cardName });
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCard(null);
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      if (selectedCard) {
        router.push(
          `/calculator?bank=${selectedCard.bank}&card=${selectedCard.cardName}`
        );
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Failed to sign in. Please try again.",
        severity: "error",
      });
    }
  };

  const isLoading = isLoadingCategories || isLoadingCardImages || isValidating;
  const categoryCards = category ? getCardsWithImages(category) : [];

  if (categoriesError) {
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
  );
};

export default TopCardsPage;
