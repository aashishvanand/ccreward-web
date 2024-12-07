import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  useTheme,
  useScrollTrigger,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useAuth } from "../../../core/providers/AuthContext";
import {
  getCardsForUser,
  addCardForUser,
  deleteCardForUser,
} from "../../../core/services/firebaseUtils";
import { notifyCardUpdate } from "../../../core/utils/events";
import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";
import CardList from "./CardList";
import AddCardDialog from "./AddCardDialog";
import { Share as ShareIcon } from "@mui/icons-material";
import PortfolioShare from "./PortfolioShare";
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Divider,
} from "@mui/material";
import ShareDialog from "./ShareDialog";

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
  const portfolioRef = useRef(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleShare = async (platform) => {
    setIsGeneratingImage(true);
    try {
      if (platform === "generate") {
        // Use generateAndShare but with a special 'generate' flag
        // that only generates without sharing
        await portfolioRef.current?.generateAndShare("preview");
      } else {
        await portfolioRef.current?.generateAndShare(platform);
      }
    } catch (error) {
      console.error("Error handling share action:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const { user, isAuthenticated, loading, isNewUser, markUserAsNotNew } =
    useAuth();

  // Add scroll trigger for FAB animation
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

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
          <Typography color="text.secondary">
            Click the + button below to add your first card
          </Typography>
        </Paper>
      );
    }

    return (
      <>
        {cards.length === 1 && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: theme.palette.info.light,
              color: theme.palette.info.contrastText,
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
        )}
        {cards.length > 0 && (
          <PortfolioShare ref={portfolioRef} cards={cards} />
        )}
        <CardList cards={cards} onDeleteCard={handleDeleteCard} />
      </>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container
        sx={{
          py: 4,
          flexGrow: 1,
          // Add bottom padding to prevent FAB from covering content
          pb: { xs: 10, sm: 12 },
        }}
        maxWidth="lg"
      >
        <Stack spacing={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
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
          </Box>

          {renderContent()}
        </Stack>
      </Container>

      {/* Floating Action Button */}
      <SpeedDial
        ariaLabel="Card Actions"
        sx={{
          position: "fixed",
          bottom: { xs: 80, sm: 100 },
          right: { xs: 16, sm: 24 },
        }}
        icon={<SpeedDialIcon openIcon={<AddIcon />} />}
      >
        <SpeedDialAction
          key="add"
          icon={<AddIcon />}
          tooltipTitle="Add New Card"
          onClick={() => setIsAddCardDialogOpen(true)}
        />
        {cards.length > 0 && (
          <SpeedDialAction
            key="share"
            icon={<ShareIcon />}
            tooltipTitle="Share Collection"
            onClick={() => setShareDialogOpen(true)}
          />
        )}
      </SpeedDial>

      <AddCardDialog
        open={isAddCardDialogOpen}
        onClose={() => setIsAddCardDialogOpen(false)}
        onAddCard={handleAddCard}
      />

      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        onShare={handleShare}
        isGenerating={isGeneratingImage}
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
