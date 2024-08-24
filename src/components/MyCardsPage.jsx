import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/providers/AuthContext";
import {
  getCardsForUser,
  addCardForUser,
  deleteCardForUser,
} from "../utils/firebaseUtils";
import Header from "./Header";
import CardList from "./CardList";
import AddCardDialog from "./AddCardDialog";
import Footer from "./Footer";

function MyCardsPage() {
  const [cards, setCards] = useState([]);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      if (loading) return;
      if (!isAuthenticated()) {
        router.push("/");
      } else {
        await fetchUserCards();
      }
    };
    checkAuth();
  }, [isAuthenticated, router, user, loading]);

  const fetchUserCards = async () => {
    if (!user) {
      showSnackbar(
        "Authentication error. Please try logging in again.",
        "error"
      );
      setIsLoading(false);
      return;
    }
    try {
      const fetchedCards = await getCardsForUser(user.uid);
      setCards(fetchedCards);
    } catch (error) {
      showSnackbar("Error fetching cards. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = async (newCard) => {
    try {
      const existingCards = await getCardsForUser(user.uid);
      const isDuplicate = existingCards.some(
        (card) =>
          card.bank === newCard.bank && card.cardName === newCard.cardName
      );
      if (isDuplicate) {
        showSnackbar("This card is already in your collection.", "info");
        return;
      }
      await addCardForUser(user.uid, newCard);
      await fetchUserCards();
      showSnackbar("Card added successfully", "success");
    } catch (error) {
      showSnackbar("Error adding card. Please try again later.", "error");
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCardForUser(user.uid, cardId);
      await fetchUserCards();
      showSnackbar("Card deleted successfully", "success");
    } catch (error) {
      showSnackbar("Error deleting card. Please try again later.", "error");
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  if (isLoading || loading) {
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
      <Container sx={{ py: 4 }} maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1">
            My Cards
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddCardDialogOpen(true)}
          >
            Add New Card
          </Button>
        </Box>
        <CardList cards={cards} onDeleteCard={handleDeleteCard} />
      </Container>
      <AddCardDialog
        open={isAddCardDialogOpen}
        onClose={() => setIsAddCardDialogOpen(false)}
        onAddCard={handleAddCard}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default MyCardsPage;
