import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  Link,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  CreditCard,
  Add as AddIcon,
  Delete as DeleteIcon,
  Brightness4,
  Brightness7,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/providers/AuthContext";
import { useAppTheme } from "../components/ThemeRegistry";
import { bankData } from "../data/bankData";
import {
  addCardForUser,
  getCardsForUser,
  deleteCardForUser,
} from "../utils/firebaseUtils";
import ExportedImage from "next-image-export-optimizer";

function MyCardsPage() {
  const { mode, toggleTheme, theme } = useAppTheme();
  const [cards, setCards] = useState([]);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({ bank: "", cardName: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [cardOrientations, setCardOrientations] = useState({});
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [failedImages, setFailedImages] = useState({});

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
      console.error("No user available");
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
      console.error("Error fetching cards:", error);
      showSnackbar("Error fetching cards. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = async () => {
    try {
      const cardData = {
        bank: newCard.bank,
        cardName: newCard.cardName,
      };
  
      // Check if the card already exists
      const existingCards = await getCardsForUser(user.uid);
      const isDuplicate = existingCards.some(
        card => card.bank === cardData.bank && card.cardName === cardData.cardName
      );
  
      if (isDuplicate) {
        showSnackbar("This card is already in your collection.", "info");
        setIsAddCardDialogOpen(false);
        setNewCard({ bank: "", cardName: "" });
        return;
      }
  
      await addCardForUser(user.uid, cardData);
      await fetchUserCards();
      setIsAddCardDialogOpen(false);
      setNewCard({ bank: "", cardName: "" });
      showSnackbar("Card added successfully", "success");
    } catch (error) {
      console.error("Error adding card:", error);
      showSnackbar("Error adding card. Please try again later.", "error");
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCardForUser(user.uid, cardId);
      await fetchUserCards();
      showSnackbar("Card deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting card:", error);
      showSnackbar("Error deleting card. Please try again later.", "error");
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleImageError = (cardId, imagePath) => {
    console.log(`Image not found: ${imagePath}`);
    setFailedImages(prev => ({ ...prev, [cardId]: true }));
    setCardOrientations(prev => ({ ...prev, [cardId]: 'horizontal' }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      showSnackbar("Error logging out. Please try again.", "error");
    }
  };

  const getRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);
  
  const getBankColor = (bankName) => {
    const bankColors = {
      HDFC: '#004C8F',
      ICICI: '#B02A30',
      SBI: '#22409A',
      Axis: '#800000',
      AMEX: '#006FCF',
      YESBank: "#00518F",
      SC: "#0072AA",
      Kotak: "#ED1C24",
      SBI: "#00B5EF",
      IDFCFirst: "#9C1D26",
      AMEX: "#016FD0",
      HSBC: "#EE3524",
      OneCard: "#000000",
      RBL: "#21317D",
      IndusInd :"#98272A",
      IDBI:"#00836C",
      Federal:"#F7A800",
      BOB: "#F15A29",
      AU: "#ec691f",
    };
    return bankColors[bankName] || getRandomColor();
  };

  const getCardImagePath = (bank, cardName) => {
    const formattedCardName = cardName.replace(/\s+/g, '_').toLowerCase();
    return `/card-images/${bank}/${bank.toLowerCase()}_${formattedCardName}.webp`;
  };


  const handleImageLoad = (cardId, width, height) => {
    setCardOrientations(prev => ({
      ...prev,
      [cardId]: width / height > 1 ? 'horizontal' : 'vertical'
    }));
  };

  const renderCard = (card, isHorizontal) => {
    const startColor = getBankColor(card.bank);
    const endColor = getRandomColor();
    const imagePath = getCardImagePath(card.bank, card.cardName);
    const hasFailedImage = failedImages[card.id];

    return (
      <Grid item key={card.id} xs={12} sm={6} md={3}>
        <Card 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            '&:hover .deleteIcon': { opacity: 1 },
          }}
        >
          <CardMedia
            component="div"
            sx={{
              paddingTop: isHorizontal ? '63.4%' : '158.5%',
              position: 'relative',
              background: `linear-gradient(45deg, ${startColor}, ${endColor})`,
            }}
          >
            {!hasFailedImage && (
              <ExportedImage
                src={imagePath}
                alt={`${card.bank} ${card.cardName}`}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw"
                onLoad={(e) => {
                  const img = e.target;
                  handleImageLoad(card.id, img.naturalWidth, img.naturalHeight);
                }}
                onError={() => handleImageError(card.id, imagePath)}
              />
            )}
          </CardMedia>
          <CardContent sx={{ flexGrow: 1, p: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="subtitle1" component="h2">{card.bank}</Typography>
            <Typography variant="body2">{card.cardName}</Typography>
          </CardContent>
          <IconButton 
            className="deleteIcon"
            sx={{ 
              position: 'absolute', 
              top: 4, 
              right: 4, 
              opacity: 0,
              transition: 'opacity 0.3s',
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
              padding: '4px',
            }}
            onClick={() => handleDeleteCard(card.id)}
          >
            <DeleteIcon sx={{ color: 'white', fontSize: '1rem' }} />
          </IconButton>
        </Card>
      </Grid>
    );
  };

  const renderCardList = () => {
    const horizontalCards = cards.filter(card => cardOrientations[card.id] !== 'vertical');
    const verticalCards = cards.filter(card => cardOrientations[card.id] === 'vertical');

    return (
      <>
        <Grid container spacing={2}>
          {horizontalCards.map(card => renderCard(card, true))}
        </Grid>
        {verticalCards.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 4 }}>
            {verticalCards.map(card => renderCard(card, false))}
          </Grid>
        )}
      </>
    );
  };

  const renderHeader = () => (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <CreditCard sx={{ mr: 1 }} />
          CCReward
        </Typography>
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        <Button
          color="inherit"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{ ml: 2 }}
        >
          Logout
        </Button>
        <Avatar
          src={user?.photoURL || ""}
          alt={user?.displayName || "User"}
          sx={{ ml: 2, width: 40, height: 40 }}
        />
      </Toolbar>
    </AppBar>
  );

  const renderAddCardDialog = () => (
    <Dialog
      open={isAddCardDialogOpen}
      onClose={() => setIsAddCardDialogOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Add New Card</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Bank"
          value={newCard.bank}
          onChange={(e) => setNewCard({ ...newCard, bank: e.target.value })}
          fullWidth
          margin="normal"
        >
          {Object.keys(bankData).map((bank) => (
            <MenuItem key={bank} value={bank}>{bank}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Card Name"
          value={newCard.cardName}
          onChange={(e) => setNewCard({ ...newCard, cardName: e.target.value })}
          fullWidth
          margin="normal"
          disabled={!newCard.bank}
        >
          {newCard.bank && bankData[newCard.bank].map((card) => (
            <MenuItem key={card} value={card}>{card}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsAddCardDialogOpen(false)}>Cancel</Button>
        <Button
          onClick={handleAddCard}
          color="primary"
          variant="contained"
          disabled={!newCard.bank || !newCard.cardName}
        >
          Add Card
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderFooter = () => (
    <Box component="footer" sx={{ py: 3, px: 2, mt: "auto", backgroundColor: "background.paper" }}>
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary" align="center">
          © 2024 CCReward. All rights reserved.
          <Link color="inherit" href="#" sx={{ ml: 2 }}>Terms of Service</Link>
          <Link color="inherit" href="#" sx={{ ml: 2 }}>Privacy</Link>
        </Typography>
      </Container>
    </Box>
  );

  if (isLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {renderHeader()}
      <Container sx={{ py: 4 }} maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">My Cards</Typography>
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
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            You haven&apos;t added any cards yet. Click &quot;Add New Card&quot; to get started!
          </Typography>
        ) : renderCardList()}
      </Container>
      {renderAddCardDialog()}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {renderFooter()}
    </Box>
  );
}

export default MyCardsPage;