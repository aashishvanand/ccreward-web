import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Container,
  Autocomplete,
  List,
  Snackbar,
  Alert,
} from '@mui/material';
import { calculateRewards } from './CalculatorHelpers';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from "../app/providers/AuthContext";
import { getCardsForUser } from "../utils/firebaseUtils";
import { mccList } from "../data/mccData";
import ReactConfetti from 'react-confetti';
import { searchMcc } from "../utils/searchUtils";
import { renderCardList } from './CardListRenderer';

const BestCardCalculator = () => {
  const [userCards, setUserCards] = useState([]);
  const [selectedMcc, setSelectedMcc] = useState(null);
  const [spentAmount, setSpentAmount] = useState('');
  const [cardRewards, setCardRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCardListLoading, setIsCardListLoading] = useState(true);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [mccOptions, setMccOptions] = useState(mccList);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserCards = async () => {
      if (user) {
        try {
          setIsCardListLoading(true);
          const fetchedCards = await getCardsForUser(user.uid);
          setUserCards(fetchedCards);
        } catch (error) {
          console.error("Error fetching user cards:", error);
          setSnackbar({
            open: true,
            message: "Error fetching user cards. Please try again.",
            severity: "error",
          });
        } finally {
          setIsCardListLoading(false);
        }
      }
    };

    fetchUserCards();
    setHasCalculated(false);
  }, [user]);

  const handleMccSearch = (event, value) => {
    if (!value) {
      setMccOptions(mccList);
    } else {
      const filteredOptions = searchMcc(value, mccList);
      setMccOptions(filteredOptions);
    }
  };

  const handleCalculate = async () => {
    if (!spentAmount || parseFloat(spentAmount) <= 0) {
      setSnackbar({
        open: true,
        message: "Please enter a valid spent amount",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);
    const rewards = await Promise.all(
      userCards.map(async (card) => {
        const result = await calculateRewards(
          card.bank,
          card.cardName,
          selectedMcc,
          spentAmount,
          {}
        );
        return { ...card, ...result };
      })
    );

    const sortedRewards = rewards.sort((a, b) => {
      const aValue = a.points || a.cashback || a.miles || 0;
      const bValue = b.points || b.cashback || b.miles || 0;
      return bValue - aValue;
    });

    setCardRewards(sortedRewards);
    setIsLoading(false);
    setIsCalculated(true);
    
    if (!hasCalculated) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      setHasCalculated(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleImageError = (cardId) => {
    setFailedImages(prevFailedImages => ({
      ...prevFailedImages,
      [cardId]: true
    }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        {showConfetti && <ReactConfetti />}
        <Typography variant="h4" gutterBottom>
          Know Your Best Card
        </Typography>
        <Autocomplete
          options={mccOptions}
          getOptionLabel={(option) => `${option.mcc} - ${option.name}`}
          renderOption={(props, option) => (
            <li {...props}>
              {option.mcc} - {option.name}
              {option.knownMerchants.length > 0 && (
                <span style={{ fontSize: '0.8em', color: 'gray' }}>
                  {' '}(e.g., {option.knownMerchants.join(', ')})
                </span>
              )}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Search MCC or Merchant" margin="normal" fullWidth />
          )}
          onInputChange={handleMccSearch}
          onChange={(event, newValue) => setSelectedMcc(newValue)}
          value={selectedMcc}
          filterOptions={(x) => x}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Enter spent amount (INR)"
          type="number"
          value={spentAmount}
          onChange={(e) => setSpentAmount(e.target.value)}
          required
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            mt: 2,
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleCalculate}
            disabled={!spentAmount || parseFloat(spentAmount) <= 0 || isLoading}
            sx={{ width: "100%" }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Calculate Best Card"}
          </Button>
        </Box>
        <List sx={{ width: '100%' }}>
          {renderCardList(isCardListLoading, isCalculated, cardRewards, userCards, failedImages, handleImageError)}
        </List>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Footer />
    </Box>
  );
};

export default BestCardCalculator;