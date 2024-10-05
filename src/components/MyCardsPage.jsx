import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useAuth } from "../app/providers/AuthContext";
import {
  getCardsForUser,
  addCardForUser,
  deleteCardForUser,
} from "../utils/firebaseUtils";
import { notifyCardUpdate } from "../utils/events";
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
  const { user, isAuthenticated, loading, isNewUser, markUserAsNotNew } =
    useAuth();

  useEffect(() => {
    const fetchCards = async () => {
      if (loading) return;
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }
      await fetchUserCards();
    };
    fetchCards();
  }, [isAuthenticated, user, loading]);

  const fetchUserCards = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    try {
      const fetchedCards = await getCardsForUser(user.uid);
      setCards(fetchedCards);
    } catch (error) {
      console.error("Error fetching cards:", error);
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
      notifyCardUpdate();
      showSnackbar("Card added successfully", "success");
      if (isNewUser) {
        markUserAsNotNew();
      }
    } catch (error) {
      console.error("Error adding card:", error);
      showSnackbar("Failed to add card. Please try again.", "error");
    }
  };

  const handleDeleteCard = async (bank, cardName) => {
    try {
      const cardKey = `${bank}_${cardName}`;
      await deleteCardForUser(user.uid, cardKey);
      // Update the local state immediately
      setCards((prevCards) =>
        prevCards.filter(
          (card) => card.bank !== bank || card.cardName !== cardName
        )
      );
      notifyCardUpdate();
      showSnackbar("Card deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting card:", error);
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
      <Container sx={{ py: 4, flexGrow: 1 }} maxWidth="lg">
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
        {cards.length === 0 ? (
          <Typography variant="h6" sx={{ mb: 4, textAlign: "center" }}>
            Welcome! Let&apos;s start by adding your first credit card.
          </Typography>
        ) : cards.length === 1 ? (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: "info.light",
              color: "info.contrastText",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Great start! You&apos;ve added your first card.
            </Typography>
            <Typography>
              Add one more card to use our &quot;Best Card&quot; feature and
              start comparing rewards!
            </Typography>
          </Paper>
        ) : null}
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
