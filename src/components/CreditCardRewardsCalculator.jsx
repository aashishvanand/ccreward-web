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
  useMediaQuery,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { mccList } from '../data/mccData';
import { bankData } from '../data/bankData';
import { cardRewards } from '../data/cardRewards';
import Confetti from 'react-confetti';
import MissingBankCardForm from './MissingBankCardForm';

const DEBUG_MODE = true;

const debugLog = (...args) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

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
  const [cappedRewardPoints, setCappedRewardPoints] = useState(0);
  const [appliedCapping, setAppliedCapping] = useState(null);
  const [spendType, setSpendType] = useState('local');
  const [showInternationalOption, setShowInternationalOption] = useState(false);

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

  useEffect(() => {
    if (selectedCard) {
      const cardReward = cardRewards[selectedCard];
      setShowInternationalOption(!!cardReward?.internationalRate);
    } else {
      setShowInternationalOption(false);
    }
  }, [selectedCard]);

  const handleSpendTypeChange = (event) => {
    setSpendType(event.target.value);
  };

  const calculateRewards = () => {
    debugLog("Calculation started");
    debugLog("Selected Bank:", selectedBank);
    debugLog("Selected Card:", selectedCard);
    debugLog("Selected MCC:", selectedMcc);
    debugLog("Spent Amount:", spentAmount);
  
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
      debugLog("Error: Bank or card not selected");
      setToastMessage("Please select both a bank and a card.");
      setToastOpen(true);
      return;
    }

    if (!spentAmount) {
      debugLog("Error: Spent amount not entered");
      setToastMessage("Please enter the spent amount.");
      setToastOpen(true);
      return;
    }

  const normalizedCardName = selectedCard.trim();
  const fullCardName = `${selectedBank} ${normalizedCardName}`.trim();
  
  debugLog("Normalized Card Name:", normalizedCardName);
  debugLog("Full Card Name:", fullCardName);

    const cardReward = cardRewards[selectedCard];
    if (!cardReward) {
      debugLog("Error: Card reward structure not found");
      debugLog("Available card rewards:", Object.keys(cardRewards));
      setCalculationPerformed(false);
      setToastMessage("Card reward structure not found");
      setToastOpen(true);
      return;
    }
  
    debugLog("Card Reward Structure:", cardReward);
  
    const amount = parseFloat(spentAmount);
    let rate = cardReward.defaultRate;
    debugLog("Default Rate:", rate);
  
    if (spendType === 'international' && cardReward.internationalRate) {
      rate = cardReward.internationalRate;
      debugLog("International Rate Applied:", rate);
    } else if (selectedMcc && cardReward.mccRates && cardReward.mccRates[selectedMcc.mcc]) {
      rate = cardReward.mccRates[selectedMcc.mcc];
      debugLog("MCC-specific Rate:", rate);
    }
  
    let points = Math.floor(amount * rate);
    let cappedPoints = points;
    let appliedCap = null;
    debugLog("Calculated Points:", points);
  
    // Apply category-specific capping if available
    if (cardReward.capping && cardReward.capping.categories && selectedMcc) {
      debugLog("Checking for capping category");
      const mccName = selectedMcc.name.toLowerCase();
      const cappingCategories = cardReward.capping.categories;
        
      const matchingCategory = Object.keys(cappingCategories).find(cat => 
        mccName.includes(cat.toLowerCase())
      );
    
      if (matchingCategory) {
        debugLog("Capping category found:", matchingCategory);
        const { points: catPoints, maxSpent: catMaxSpent } = cappingCategories[matchingCategory];
        const cappedAmount = Math.min(amount, catMaxSpent);
        cappedPoints = Math.min(points, catPoints, Math.floor(cappedAmount * rate));
          
        if (cappedPoints < points) {
          appliedCap = {
            category: matchingCategory,
            maxPoints: catPoints,
            maxSpent: catMaxSpent
          };
          debugLog("Capping applied:", appliedCap);
        }
      } else {
        debugLog("No matching capping category found");
      }
    } else {
      debugLog("No capping structure or MCC selected");
    }
  
    debugLog("Final Capped Points:", cappedPoints);
  
    let rewardText = "";
  
    switch (selectedCard) {
      case "HDFC Swiggy":
        rewardText = `₹${cappedPoints} Cashback`;
        break;
      case "Axis Atlas":
        rewardText = rate === 0 ? "No EDGE Miles for this transaction" : `${cappedPoints} EDGE Miles`;
        break;
      case "Axis Vistara":
        rewardText = rate === 0 ? "No CV Points for this transaction" : `${cappedPoints} CV Points`;
        break;
      case "Emeralde Private":
        rewardText = `${cappedPoints} ICICI Reward Points`;
        break;
      case "Cashback":
        if (rate === 0) {
          rewardText = "No cashback for this transaction";
        } else {
          const cashback = (cappedPoints / 100).toFixed(2);
          rewardText = `₹${cashback} Cashback`;
        }
        break;
      default:
        rewardText = `${cappedPoints} Reward Points`;
    }
  
    debugLog("Reward Text:", rewardText);
  
    setRewardPoints(points);
    setCappedRewardPoints(cappedPoints);
    setAppliedCapping(appliedCap);
    setCalculationPerformed(true);
  
    if (cappedPoints > 0 && firstSuccessfulSearch) {
      setShowConfetti(true);
      setFirstSuccessfulSearch(false);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  
    const result = {
      rewardText,
      uncappedPoints: points,
      cappedPoints,
      appliedCap
    };
    debugLog("Calculation Result:", result);
    return result;
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

        {showInternationalOption && (
          <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
            <FormLabel component="legend">Spend Type</FormLabel>
            <RadioGroup
              aria-label="spend-type"
              name="spend-type"
              value={spendType}
              onChange={handleSpendTypeChange}
              row
            >
              <FormControlLabel value="local" control={<Radio />} label="Local" />
              <FormControlLabel value="international" control={<Radio />} label="International" />
            </RadioGroup>
          </FormControl>
        )}

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
  {cappedRewardPoints > 0 ? (
    <>
      🎉 {cappedRewardPoints} Reward Points {appliedCapping ? '(Capped)' : ''} 🎉
      {appliedCapping && appliedCapping.category && (
        <Typography variant="body2" color="textSecondary">
          {`${appliedCapping.category} cap applied: Max ${appliedCapping.maxPoints} points or ₹${appliedCapping.maxSpent.toFixed(2)} spent`}
        </Typography>
      )}
      {rewardPoints !== cappedRewardPoints && (
        <Typography variant="body2" color="textSecondary">
          (Uncapped: {rewardPoints} points)
        </Typography>
      )}
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