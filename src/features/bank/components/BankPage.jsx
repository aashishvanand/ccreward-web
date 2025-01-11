"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";
import TopCardsGrid from "../../top-cards/components/TopCardsGrid";
import { useAuth } from "../../../core/providers/AuthContext";
import useCardImagesData from "../../../core/hooks/useCardImagesData";

const BankPage = ({ bank, cards }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { user, signInWithGoogle } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { cardImagesData } = useCardImagesData();

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
      console.error("Error signing in:", error);
      setAlert({
        open: true,
        message: "Failed to sign in. Please try again.",
        severity: "error",
      });
    }
  };

  const bankCards = getCardsWithImages();

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
            />
          </Box>
        ) : (
          <Alert severity="info">No cards found for this bank.</Alert>
        )}
      </Container>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        slots={{
          backdrop: "div",
        }}
      >
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

export default BankPage;