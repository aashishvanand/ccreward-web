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
import Confetti from 'react-confetti';
import MissingBankCardForm from './MissingBankCardForm';
import { iciciCardRewards, calculateICICIRewards } from '../utils/iciciRewards';
import { hdfcCardRewards, calculateHDFCRewards } from '../utils/hdfcRewards';
import { axisCardRewards, calculateAxisRewards } from '../utils/axisRewards';
import { auCardRewards, calculateAURewards } from '../utils/auRewards';
import { bobCardRewards, calculateBOBRewards } from '../utils/bobRewards';
import { federalCardRewards, calculateFederalRewards } from '../utils/federalRewards';
import { hsbcCardRewards, calculateHSBCRewards } from '../utils/hsbcRewards';
import { idbiCardRewards, calculateIDBIRewards } from '../utils/idbiRewards';
import { idfcFirstCardRewards, calculateIDFCFirstRewards } from '../utils/idfcfirstRewards';
import { indusIndCardRewards, calculateIndusIndRewards } from '../utils/indusindRewards';
import { kotakCardRewards, calculateKotakRewards } from '../utils/kotakRewards';
import { oneCardRewards, calculateOneCardRewards } from '../utils/onecardRewards';
import { rblCardRewards, calculateRBLRewards } from '../utils/rblRewards';
import { sbiCardRewards, calculateSBIRewards } from '../utils/sbiRewards';
import { scCardRewards, calculateSCRewards } from '../utils/scRewards';
import { yesCardRewards, calculateYesRewards } from '../utils/yesRewards';
import DynamicCardInputs from './DynamicCardInputs';

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
  const [calculationResult, setCalculationResult] = useState(null);
  const [additionalInputs, setAdditionalInputs] = useState({
    isPrimeMember: false,
    isFlipkartPlusMember: false,
    isInternational: false,
    isBirthday: false,
    isTravelEdgePortal: false,
    isSpiceJet: false,
    isAirtelApp: false,
    isSamsungTransaction: false,
    isShoppersStopExclusive: false,
    isLICPremium: false,
    isFreechargeTransaction: false,
  });

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
    if (selectedCard && selectedBank) {
      let cardReward;
      switch (selectedBank) {
        case "ICICI":
          cardReward = iciciCardRewards[selectedCard];
          break;
        case "HDFC":
          cardReward = hdfcCardRewards[selectedCard];
          break;
        case "Axis":
          cardReward = axisCardRewards[selectedCard];
          break;
        case "AU":
          cardReward = auCardRewards[selectedCard];
          break;
        case "BOB":
          cardReward = bobCardRewards[selectedCard];
          break;
        case "Federal Bank":
          cardReward = federalCardRewards[selectedCard];
          break;
        case "HSBC":
          cardReward = hsbcCardRewards[selectedCard];
          break;
        case "IDBI":
          cardReward = idbiCardRewards[selectedCard];
          break;
        case "IDFC First":
          cardReward = idfcFirstCardRewards[selectedCard];
          break;
        case "IndusInd":
          cardReward = indusIndCardRewards[selectedCard];
          break;
        case "Kotak":
          cardReward = kotakCardRewards[selectedCard];
          break;
        case "OneCard":
          cardReward = oneCardRewards[selectedCard];
          break;
        case "RBL":
          cardReward = rblCardRewards[selectedCard];
          break;
        case "SBI":
          cardReward = sbiCardRewards[selectedCard];
          break;
        case "SC":
          cardReward = scCardRewards[selectedCard];
          break;
        case "Yes Bank":
          cardReward = yesCardRewards[selectedCard];
          break;
        default:
          cardReward = null;
      }
      setShowInternationalOption(!!cardReward?.internationalRate);
      
      // You can add more logic here to set other card-specific options
      setAdditionalInputs(prevInputs => ({
        ...prevInputs,
        isPrimeMember: cardReward?.amazonPrimeRate ? false : undefined
      }));
    } else {
      setShowInternationalOption(false);
      setAdditionalInputs({});
    }
  }, [selectedCard, selectedBank]);

  const handleSpendTypeChange = (event) => {
    setSpendType(event.target.value);
  };

  const getCardConfig = (bank, card) => {
    switch (bank) {
      case "ICICI":
        return iciciCardRewards[card];
      case "HDFC":
        return hdfcCardRewards[card];
      case "Axis":
        return axisCardRewards[card];
      case "AU":
        return auCardRewards[card];
      case "BOB":
        return bobCardRewards[card];
      case "Federal Bank":
        return federalCardRewards[card];
      case "HSBC":
        return hsbcCardRewards[card];
      case "IDBI":
        return idbiCardRewards[card];
      case "IDFC First":
        return idfcFirstCardRewards[card];
      case "IndusInd":
        return indusIndCardRewards[card];
      case "Kotak":
        return kotakCardRewards[card];
      case "OneCard":
        return oneCardRewards[card];
      case "RBL":
        return rblCardRewards[card];
      case "SBI":
        return sbiCardRewards[card];
      case "SC":
        return scCardRewards[card];
      case "Yes Bank":
        return yesCardRewards[card];
      default:
        return null;
    }
  };

  const calculateRewards = () => {
    debugLog("Calculation started");
    debugLog("Selected Bank:", selectedBank);
    debugLog("Selected Card:", selectedCard);
    debugLog("Selected MCC:", selectedMcc);
    debugLog("Spent Amount:", spentAmount);
  
    // Error checking
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
  
    const amount = parseFloat(spentAmount);
    const mcc = selectedMcc ? selectedMcc.mcc : null;
    const additionalParams = {
      isPrimeMember: additionalInputs.isPrimeMember,
      isFlipkartPlusMember: additionalInputs.isFlipkartPlusMember,
      isInternational: additionalInputs.isInternational,
      isBirthday: additionalInputs.isBirthday,
      isTravelEdgePortal: additionalInputs.isTravelEdgePortal,
      isSpiceJet: additionalInputs.isSpiceJet,
      isAirtelApp: additionalInputs.isAirtelApp,
      isSamsungTransaction: additionalInputs.isSamsungTransaction,
      isShoppersStopExclusive: additionalInputs.isShoppersStopExclusive,
      isLICPremium: additionalInputs.isLICPremium,
      isFreechargeTransaction: additionalInputs.isFreechargeTransaction,
    };

  
    let result;
  
    switch (selectedBank) {
      case "ICICI":
        result = calculateICICIRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "HDFC":
        result = calculateHDFCRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "Axis":
        result = calculateAxisRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "AU":
        result = calculateAURewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "BOB":
        result = calculateBOBRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "Federal":
        result = calculateFederalRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "HSBC":
        result = calculateHSBCRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "IDBI":
        result = calculateIDBIRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "IDFC First":
        result = calculateIDFCFirstRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "IndusInd":
        result = calculateIndusIndRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "Kotak":
        result = calculateKotakRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "OneCard":
        result = calculateOneCardRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "RBL":
        result = calculateRBLRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "SBI":
        result = calculateSBIRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "SC":
        result = calculateSCRewards(selectedCard, amount, mcc, additionalParams);
        break;
      case "Yes Bank":
        result = calculateYesRewards(selectedCard, amount, mcc, additionalParams);
        break;
      default:
        debugLog("Error: Unknown bank selected");
        setToastMessage("Unknown bank selected");
        setToastOpen(true);
        return;
    }
  
    if (result) {
      debugLog("Calculation Result:", result);
      setRewardPoints(result.uncappedPoints);
      setCappedRewardPoints(result.points);
      setAppliedCapping(result.appliedCap);
      setCalculationResult(result);
      setCalculationPerformed(true);
  
      if (result.points > 0 && firstSuccessfulSearch) {
        setShowConfetti(true);
        setFirstSuccessfulSearch(false);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } else {
      debugLog("Error: Calculation failed");
      setToastMessage("Failed to calculate rewards. Please try again.");
      setToastOpen(true);
    }
  
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

  const handleAdditionalInputChange = (key, value) => {
    setAdditionalInputs(prev => ({ ...prev, [key]: value }));
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
            Credit Cards Rewards Calculator
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

{selectedCard && (
  <DynamicCardInputs
  cardConfig={getCardConfig(selectedBank, selectedCard)}
    onChange={handleAdditionalInputChange}
    currentInputs={additionalInputs}
    selectedMcc={selectedMcc}
  />
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

        {calculationPerformed && calculationResult && (
  <Paper 
    elevation={3} 
    sx={{ 
      p: 3, 
      mt: 2, 
      width: '100%', 
      bgcolor: calculationResult.points > 0 ? 'success.light' : 'error.light',
      borderRadius: 2
    }}
  >
    <Typography variant="h5" align="center" color="textPrimary" fontWeight="bold">
      {calculationResult.points > 0 ? (
        <>
          🎉 {calculationResult.rewardText} 🎉
          {calculationResult.appliedCap && (
            <Typography variant="body2" color="textSecondary">
              {`${calculationResult.appliedCap.category} cap applied: Max ${calculationResult.appliedCap.maxPoints} points or ₹${calculationResult.appliedCap.maxSpent.toFixed(2)} spent`}
            </Typography>
          )}
          {calculationResult.uncappedPoints && calculationResult.uncappedPoints !== calculationResult.points && (
            <Typography variant="body2" color="textSecondary">
              (Uncapped: {calculationResult.uncappedPoints} points)
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