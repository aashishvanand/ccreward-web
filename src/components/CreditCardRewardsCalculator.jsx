'use client';
import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Autocomplete,
  Snackbar,
  Alert,
  useMediaQuery
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { mccList } from '../data/mccData';
import { bankData } from '../data/bankData';
import { cardRewards } from '../data/cardRewards';
import Confetti from 'react-confetti';
import MissingBankCardForm from './MissingBankCardForm';

const CreditCardRewardsCalculator = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedMcc, setSelectedMcc] = useState(null);
  const [spentAmount, setSpentAmount] = useState("");
  const [rewardPoints, setRewardPoints] = useState(0);
  const [filteredCards, setFilteredCards] = useState([]);
  const [calculationPerformed, setCalculationPerformed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [firstSuccessfulSearch, setFirstSuccessfulSearch] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [bankError, setBankError] = useState(false);
  const [cardError, setCardError] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [missingFormOpen, setMissingFormOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#303030',
            paper: mode === 'light' ? '#ffffff' : '#424242',
          },
        },
        shape: {
          borderRadius: 12,
        },
      }),
    [mode],
  );

  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };


  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // Set initial dimensions
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedBank) {
      setFilteredCards(bankData[selectedBank] || []);
    } else {
      setFilteredCards([]);
    }
  }, [selectedBank]);

  const calculateRewards = () => {
    let isError = false;
    setBankError(false);
    setCardError(false);

    if (!selectedBank) {
      setBankError(true);
      isError = true;
    }
    if (!selectedCard) {
      setCardError(true);
      isError = true;
    }

    if (isError) {
      setToastMessage("Please select both a bank and a card.");
      setToastOpen(true);
      return;
    }

    if (!spentAmount) {
      setToastMessage("Please enter the spent amount.");
      setToastOpen(true);
      return;
    }

    const cardReward = cardRewards[selectedCard];
    if (!cardReward) {
      setCalculationPerformed(false);
      setToastMessage("Card reward structure not found");
      setToastOpen(true);
      return;
    }

    let rate = cardReward.defaultRate;
    if (selectedMcc && cardReward.mccRates && cardReward.mccRates[selectedMcc.mcc] !== undefined) {
      rate = cardReward.mccRates[selectedMcc.mcc];
    }

    const amount = parseFloat(spentAmount);
    let points = Math.floor(amount * rate);
    let rewardText = "";

    switch (selectedCard) {
      case "HDFC Swiggy":
        rewardText = `₹${points} Cashback`;
        break;
      case "Axis Atlas":
        rewardText = rate === 0 ? "No EDGE Points for this transaction" : `${points} EDGE Points`;
        break;
      case "Axis Vistara":
        rewardText = rate === 0 ? "No CV Points for this transaction" : `${points} CV Points`;
        break;
      case "Emeralde Private":
        rewardText = `${points} ICICI Reward Points`;
        break;
      case "Cashback":
        if (rate === 0) {
          rewardText = "No cashback for this transaction";
        } else {
          const cashback = (points / 100).toFixed(2);
          rewardText = `₹${cashback} Cashback`;
        }
        break;
      default:
        rewardText = `${points} Reward Points`;
    }

    setRewardPoints(points);
    setCalculationPerformed(true);

    if (points > 0 && firstSuccessfulSearch) {
      setShowConfetti(true);
      setFirstSuccessfulSearch(false);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    return rewardText;
  };

  const clearForm = () => {
    setSelectedBank("");
    setSelectedCard("");
    setSelectedMcc(null);
    setSpentAmount("");
    setRewardPoints(0);
    setCalculationPerformed(false);
    setFirstSuccessfulSearch(true);
    setBankError(false);
    setCardError(false);
  };

  const findMatchingBank = (inputValue) => {
    const lowerInput = inputValue.toLowerCase();
    return Object.keys(bankData).find(bank => bank.toLowerCase() === lowerInput);
  };

  const findMatchingCard = (inputValue) => {
    const lowerInput = inputValue.toLowerCase();
    return filteredCards.find(card => card.toLowerCase() === lowerInput);
  };

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const handleMissingFormOpen = () => {
    setMissingFormOpen(true);
  };

  const handleMissingFormClose = () => {
    setMissingFormOpen(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleFormSubmitSuccess = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}
        />
      )}
      <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', borderRadius: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
            <Typography component="h1" variant="h4" fontWeight="bold" color="primary">
              Rewards Calculator
            </Typography>
            <IconButton onClick={toggleColorMode} color="inherit" sx={{ ml: 2 }}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          
          <Autocomplete
            fullWidth
            options={Object.keys(bankData)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Select a bank" 
                margin="normal" 
                variant="outlined" 
                error={bankError}
                helperText={bankError ? "Bank selection is required" : ""}
              />
            )}
            value={selectedBank}
            onChange={(event, newValue) => {
              setSelectedBank(newValue);
              setSelectedCard("");
              setBankError(false);
            }}
            onInputChange={(event, newInputValue) => {
              const matchedBank = findMatchingBank(newInputValue);
              if (matchedBank) {
                setSelectedBank(matchedBank);
                setBankError(false);
              }
            }}
            freeSolo
          />

          <Autocomplete
            fullWidth
            options={filteredCards}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Select a card" 
                margin="normal" 
                variant="outlined" 
                error={cardError}
                helperText={cardError ? "Card selection is required" : ""}
              />
            )}
            value={selectedCard}
            onChange={(event, newValue) => {
              setSelectedCard(newValue);
              setCardError(false);
            }}
            onInputChange={(event, newInputValue) => {
              const matchedCard = findMatchingCard(newInputValue);
              if (matchedCard) {
                setSelectedCard(matchedCard);
                setCardError(false);
              }
            }}
            disabled={!selectedBank}
            freeSolo
          />
          
          <Autocomplete
            fullWidth
            options={mccList}
            getOptionLabel={(option) => `${option.mcc} - ${option.name}`}
            renderInput={(params) => <TextField {...params} label="Search MCC" margin="normal" variant="outlined" />}
            onChange={(event, newValue) => {
              setSelectedMcc(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.mcc === value.mcc}
            value={selectedMcc}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Enter spent amount (INR)"
            type="number"
            value={spentAmount}
            onChange={(e) => setSpentAmount(e.target.value)}
            variant="outlined"
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 3, mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateRewards}
              sx={{ py: 1.5, fontSize: '1.1rem', flex: 1, mr: 1 }}
            >
              Calculate Rewards
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={clearForm}
              sx={{ py: 1.5, fontSize: '1.1rem', flex: 1, ml: 1 }}
            >
              Clear
            </Button>
          </Box>

          <Button
            variant="text"
            color="primary"
            onClick={handleMissingFormOpen}
            sx={{ mt: 2 }}
          >
            Bank or Card Missing?
          </Button>

          {calculationPerformed && (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                mt: 2, 
                width: '100%', 
                bgcolor: rewardPoints > 0 ? 'success.light' : 'error.light',
                borderRadius: 2
              }}
            >
              <Typography variant="h5" align="center" color="textPrimary" fontWeight="bold">
                {rewardPoints > 0 ? (
                  <>
                    🎉 {rewardPoints} Reward Points 🎉
                  </>
                ) : (
                  <>
                    😢 No rewards earned 😢
                  </>
                )}
              </Typography>
            </Paper>
          )}
        </Paper>
      </Container>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <MissingBankCardForm 
        open={missingFormOpen} 
        onClose={handleMissingFormClose} 
        onSubmitSuccess={handleFormSubmitSuccess}
      />
    </ThemeProvider>
  );
};

export default CreditCardRewardsCalculator;