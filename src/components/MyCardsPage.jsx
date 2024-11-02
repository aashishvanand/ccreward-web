import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  useTheme,
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
  const theme = useTheme();
  const [cards, setCards] = useState([]);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, loading, isNewUser, markUserAsNotNew } = useAuth();

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
      showAlert("Error fetching cards. Please try again later.", "error");
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
        showAlert("This card is already in your collection.", "info");
        return;
      }
      
      await addCardForUser(user.uid, newCard);
      await fetchUserCards();
      notifyCardUpdate();
      showAlert("Card added successfully", "success");
      
      if (isNewUser) {
        markUserAsNotNew();
      }
    } catch (error) {
      console.error("Error adding card:", error);
      showAlert("Failed to add card. Please try again.", "error");
    }
  };

  const handleDeleteCard = async (bank, cardName) => {
    try {
      const cardKey = `${bank}_${cardName}`;
      await deleteCardForUser(user.uid, cardKey);
      setCards((prevCards) =>
        prevCards.filter(
          (card) => card.bank !== bank || card.cardName !== cardName
        )
      );
      notifyCardUpdate();
      showAlert("Card deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting card:", error);
      showAlert("Error deleting card. Please try again later.", "error");
    }
  };

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const renderContent = () => {
    if (isLoading || loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (cards.length === 0) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "background.paper",
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Welcome! Let&apos;s start by adding your first credit card.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddCardDialogOpen(true)}
            sx={{ mt: 2 }}
          >
            Add Your First Card
          </Button>
        </Paper>
      );
    }

    if (cards.length === 1) {
      return (
        <>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: theme.vars.palette.info.softBg,
              color: theme.vars.palette.info.softColor,
              borderRadius: 2,
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
          <CardList cards={cards} onDeleteCard={handleDeleteCard} />
        </>
      );
    }

    return <CardList cards={cards} onDeleteCard={handleDeleteCard} />;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ py: 4, flexGrow: 1 }} maxWidth="lg">
        <Stack spacing={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.125rem" },
                fontWeight: "bold",
              }}
            >
              My Cards
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsAddCardDialogOpen(true)}
              sx={{
                height: 48,
                px: 3,
              }}
            >
              Add New Card
            </Button>
          </Box>

          {renderContent()}
        </Stack>
      </Container>

      <AddCardDialog
        open={isAddCardDialogOpen}
        onClose={() => setIsAddCardDialogOpen(false)}
        onAddCard={handleAddCard}
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
  );
}

export default MyCardsPage;