"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
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
  AppBar,
  Toolbar,
  Link,
  CircularProgress
} from "@mui/material";
import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  CreditCard as CreditCardIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useAppTheme } from './ThemeRegistry';
import { useAuth } from '../app/providers/AuthContext';
import { db } from '../../firebase';
import { getCardsForUser } from "../utils/firebaseUtils";
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { mccList } from "../data/mccData";
import { bankData } from "../data/bankData";
import Confetti from "react-confetti";
import MissingBankCardForm from "./MissingBankCardForm";
import DynamicCardInputs from "./DynamicCardInputs";
import IncorrectRewardReportForm from "./IncorrectRewardReportForm";
import {
  iciciCardRewards,
  calculateICICIRewards,
  getCardInputs as getICICICardInputs,
} from "../utils/iciciRewards";
import {
  hdfcCardRewards,
  calculateHDFCRewards,
  getCardInputs as getHDFCCardInputs,
} from "../utils/hdfcRewards";
import {
  axisCardRewards,
  calculateAxisRewards,
  getCardInputs as getAxisCardInputs,
} from "../utils/axisRewards";
import {
  idfcFirstCardRewards,
  calculateIDFCFirstRewards,
  getCardInputs as getIDFCFirstCardInputs,
} from "../utils/idfcfirstRewards";

import {
  oneCardRewards,
  calculateOneCardRewards,
  getCardInputs as getOneCardCardInputs,
} from "../utils/onecardRewards";
import {
  scCardRewards,
  calculateSCRewards,
  getCardInputs as getSCCardInputs,
} from "../utils/scRewards";
// import { indusIndCardRewards, calculateIndusIndRewards, getCardInputs as getIndusIndCardInputs } from "../utils/indusindRewards";
// import { kotakCardRewards, calculateKotakRewards, getCardInputs as getKotakCardInputs } from "../utils/kotakRewards";
// import { rblCardRewards, calculateRBLRewards, getCardInputs as getRBLCardInputs } from "../utils/rblRewards";
import {
  sbiCardRewards,
  calculateSBIRewards,
  getCardInputs as getSBICardInputs,
} from "../utils/sbiRewards";
// import { auCardRewards, calculateAURewards, getCardInputs as getAUCardInputs } from "../utils/auRewards";
// import { bobCardRewards, calculateBOBRewards, getCardInputs as getBOBCardInputs } from "../utils/bobRewards";
// import { federalCardRewards, calculateFederalRewards, getCardInputs as getFederalCardInputs } from "../utils/federalRewards";
// import { hsbcCardRewards, calculateHSBCRewards, getCardInputs as getHSBCCardInputs } from "../utils/hsbcRewards";
// import { idbiCardRewards, calculateIDBIRewards, getCardInputs as getIDBICardInputs } from "../utils/idbiRewards";
// import { yesCardRewards, calculateYesRewards, getCardInputs as getYesCardInputs } from "../utils/yesRewards";
import {
  amexCardRewards,
  calculateAmexRewards,
  getCardInputs as getAmexCardInputs,
} from "../utils/amexRewards";

const DEBUG_MODE = true;

const debugLog = (...args) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

function CreditCardRewardsCalculator() {
  const { mode, toggleTheme, theme } = useAppTheme();
  const { user, isAuthenticated, signInWithGoogle, loading, logout } = useAuth();
  const router = useRouter();
  const [selectedBank, setSelectedBank] = useState("");
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
  const [missingFormOpen, setMissingFormOpen] = useState(false);
  const [incorrectRewardReportOpen, setIncorrectRewardReportOpen] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [selectedCard, setSelectedCard] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [cappedRewardPoints, setCappedRewardPoints] = useState(0);
  const [appliedCapping, setAppliedCapping] = useState(null);
  const [spendType, setSpendType] = useState("local");
  const [showInternationalOption, setShowInternationalOption] = useState(false);
  const [userCards, setUserCards] = useState([]);
  const [isCardInCollection, setIsCardInCollection] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  
  // const { user, isAuthenticated, signInWithGoogle, loading, logout } = useAuth();
  // const router = useRouter();
  // const [selectedBank, setSelectedBank] = useState("");
  // const [selectedMcc, setSelectedMcc] = useState(null);
  // const [spentAmount, setSpentAmount] = useState("");
  // const [rewardPoints, setRewardPoints] = useState(0);
  // const [filteredCards, setFilteredCards] = useState([]);
  // const [calculationPerformed, setCalculationPerformed] = useState(false);
  // const [showConfetti, setShowConfetti] = useState(false);
  // const [firstSuccessfulSearch, setFirstSuccessfulSearch] = useState(true);
  // const [windowDimensions, setWindowDimensions] = useState({
  //   width: 0,
  //   height: 0,
  // });
  // const [bankError, setBankError] = useState(false);
  // const [cardError, setCardError] = useState(false);
  // const [missingFormOpen, setMissingFormOpen] = useState(false);
  // const [incorrectRewardReportOpen, setIncorrectRewardReportOpen] =
  //   useState(false);
  // const [calculationResult, setCalculationResult] = useState(null);
  // const [selectedCard, setSelectedCard] = useState("");
  // const [toastOpen, setToastOpen] = useState(false);
  // const [cards, setCards] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [toastMessage, setToastMessage] = useState("");
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState("");
  // const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  // const [cappedRewardPoints, setCappedRewardPoints] = useState(0);
  // const [appliedCapping, setAppliedCapping] = useState(null);
  // const [spendType, setSpendType] = useState("local");
  // const [showInternationalOption, setShowInternationalOption] = useState(false);
  // const [userCards, setUserCards] = useState([]);
  // const [isCardInCollection, setIsCardInCollection] = useState(false);
  // const [snackbar, setSnackbar] = useState({
  //   open: false,
  //   message: "",
  //   severity: "info",
  // });
  const [additionalInputs, setAdditionalInputs] = useState({
    isIndigoBooking: false,
    isInternational: false,
    isWeekday: false,
    isWeekend: false,
    isSmartBuy: false,
    isPrimeMember: false,
    isFlipkartPlusMember: false,
    isBirthday: false,
    isTravelEdgePortal: false,
    isSpiceJet: false,
    isSamsungTransaction: false,
    isShoppersStopTransaction: false,
    isLICPremium: false,
    isTopCategorySpend: false,
    selectedPacks: [],
    selectedEcommerce: "",
    isTataSpend: false,
    isUPI: false,
    isNeuPass: false,
    isNeuPassCategory: false,
    isUtilityOrShopping: false,
    isPaytmTransaction: false,
    isScanAndPay: false,
    smartbuyCategory: "",
  });

  const handleAdditionalInputChange = useCallback((key, value) => {
    setAdditionalInputs((prev) => {
      const newInputs = { ...prev };

      // Convert 'true' and 'false' strings to boolean
      if (value === "true") value = true;
      if (value === "false") value = false;

      // Handle special cases
      switch (key) {
        case "isShoppersStopTransaction":
          newInputs[key] = value;
          if (!value) newInputs.isWeekendTransaction = false;
          if (value) newInputs.isInternational = false;
          break;
        case "selectedPacks":
          // Ensure selectedPacks is always an array and limit to 2 selections
          newInputs[key] = Array.isArray(value) ? value.slice(0, 2) : [value];
          break;
        case "smartbuyCategory":
          // Handle smartbuy category selection
          newInputs[key] = value;
          newInputs.isSmartBuy = !!value;
          break;
        default:
          newInputs[key] = value;
      }

      return newInputs;
    });
  }, []);

  const MemoizedDynamicCardInputs = useMemo(
    () => React.memo(DynamicCardInputs),
    []
  );

  useEffect(() => {
    const fetchCards = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const fetchedCards = await getCardsForUser(user.uid);
          setUserCards(fetchedCards);
          setError(null);
        } catch (err) {
          console.error('Error fetching cards:', err);
          setError('Failed to fetch cards. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCards();
  }, [user]);

  useEffect(() => {
    if (selectedBank && selectedCard) {
      const cardExists = userCards.some(
        card => card.bank === selectedBank && card.cardName === selectedCard
      );
      setIsCardInCollection(cardExists);
    } else {
      setIsCardInCollection(false);
    }
  }, [selectedBank, selectedCard, userCards]);

  useEffect(() => {
    setAdditionalInputs({}); // Reset additional inputs when bank or card changes
  }, [selectedBank, selectedCard]);

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddToMyCards = async () => {
    if (!user) {
      try {
        await signInWithGoogle();
        // After successful sign-in, the user state will be updated
      } catch (error) {
        console.error("Error signing in:", error);
        showSnackbar("Failed to sign in. Please try again.", "error");
        return;
      }
    }

    // At this point, the user should be signed in
    if (user) {
      try {
        const cardData = {
          userId: user.uid,
          bank: selectedBank,
          cardName: selectedCard,
          createdAt: new Date()
        };

        await addDoc(collection(db, 'cards'), cardData);
        showSnackbar("Card added to your collection successfully!", "success");
      } catch (error) {
        console.error("Error adding card:", error);
        showSnackbar("Failed to add card. Please try again.", "error");
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
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
        case "AMEX":
          cardReward = amexCardRewards[selectedCard];
          break;
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

      setAdditionalInputs((prevInputs) => ({
        ...prevInputs,
        isPrimeMember: cardReward?.amazonPrimeRate ? false : undefined,
      }));
    } else {
      setShowInternationalOption(false);
      setAdditionalInputs({});
    }
  }, [selectedCard, selectedBank]);

  const getCardConfig = (bank, card) => {
    switch (bank) {
      case "AMEX":
        return amexCardRewards[card];
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

  const handleAddCard = () => {
    if (isAuthenticated) {
      // Logic to add the card to the user's account
      // This could involve making an API call to your backend
    } else {
      router.push("/signin");
    }
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

    const amount = parseFloat(spentAmount);
    const mcc = selectedMcc ? selectedMcc.mcc : null;
    const additionalParams = {
      ...additionalInputs,
    };

    let result;

    switch (selectedBank) {
      case "AMEX":
        result = calculateAmexRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "ICICI":
        result = calculateICICIRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "HDFC":
        result = calculateHDFCRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "Axis":
        result = calculateAxisRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "AU":
        result = calculateAURewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "BOB":
        result = calculateBOBRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "Federal":
        result = calculateFederalRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "HSBC":
        result = calculateHSBCRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "IDBI":
        result = calculateIDBIRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "IDFC First":
        result = calculateIDFCFirstRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "IndusInd":
        result = calculateIndusIndRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "Kotak":
        result = calculateKotakRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "OneCard":
        result = calculateOneCardRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "RBL":
        result = calculateRBLRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "SBI":
        result = calculateSBIRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "SC":
        result = calculateSCRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      case "Yes Bank":
        result = calculateYesRewards(
          selectedCard,
          amount,
          mcc,
          additionalParams
        );
        break;
      default:
        debugLog("Error: Unknown bank selected");
        setToastMessage("Unknown bank selected");
        setToastOpen(true);
        return;
    }

    if (result) {
      debugLog("Calculation Result:", result);
      setRewardPoints(result.points || 0);
      setCappedRewardPoints(result.cappedPoints || 0);
      setAppliedCapping(result.appliedCap);
      setCalculationResult(result);
      setCalculationPerformed(true);

      const hasReward =
        result.points > 0 || result.cashback > 0 || result.miles > 0;
      if (hasReward && firstSuccessfulSearch) {
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
    setCalculationResult(null);
  };

  const findMatchingBank = (inputValue) => {
    const lowerInput = inputValue.toLowerCase();
    return Object.keys(bankData).find(
      (bank) => bank.toLowerCase() === lowerInput
    );
  };

  const findMatchingCard = (inputValue) => {
    const lowerInput = inputValue.toLowerCase();
    return filteredCards.find((card) => card.toLowerCase() === lowerInput);
  };

  const handleMissingFormOpen = () => {
    setMissingFormOpen(true);
  };

  const handleMissingFormClose = () => {
    setMissingFormOpen(false);
  };

  const handleFormSubmitSuccess = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <CreditCardIcon sx={{ mr: 1 }} />
            CardCompare
          </Typography>
          <Button color="inherit" component={Link} href="/">
            Home
          </Button>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
  
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 1000 }}
        />
      )}
  
      <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={6}
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              <Autocomplete
                fullWidth
                options={Object.keys(bankData)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select a bank"
                    margin="normal"
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
                    error={cardError}
                    helperText={cardError ? "Card selection is required" : ""}
                  />
                )}
                value={selectedCard}
                onChange={(event, newValue) => {
                  setSelectedCard(newValue);
                  setCardError(false);
                }}
                disabled={!selectedBank}
                freeSolo
              />
  
              <Autocomplete
                fullWidth
                options={mccList}
                getOptionLabel={(option) => `${option.mcc} - ${option.name}`}
                renderInput={(params) => (
                  <TextField {...params} label="Search MCC" margin="normal" />
                )}
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
              />
  
              {selectedCard && selectedBank && (
                <MemoizedDynamicCardInputs
                  cardConfig={getCardConfig(selectedBank, selectedCard)}
                  onChange={handleAdditionalInputChange}
                  currentInputs={additionalInputs}
                  selectedMcc={selectedMcc}
                />
              )}
  
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={calculateRewards}
                  sx={{ width: "48%" }}
                >
                  Calculate
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={clearForm}
                  sx={{ width: "48%" }}
                >
                  Clear
                </Button>
              </Box>
  
              {calculationPerformed ? (
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setIncorrectRewardReportOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Report Incorrect Reward
                </Button>
              ) : (
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setMissingFormOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Bank or Card Missing?
                </Button>
              )}
  
              {calculationPerformed && calculationResult && (
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    mt: 2,
                    width: "100%",
                    bgcolor:
                      calculationResult.points > 0 ||
                      calculationResult.cashback > 0 ||
                      calculationResult.miles > 0
                        ? "success.light"
                        : "error.light",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    align="center"
                    color="textPrimary"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    <Typography
  variant="h6"
  align="center"
  color="textPrimary"
  fontWeight="bold"
  sx={{
    fontSize: { xs: "1rem", sm: "1.25rem" },
    whiteSpace: "normal",
    wordBreak: "break-word",
  }}
>
  {calculationResult.points > 0 ||
  calculationResult.cashback > 0 ||
  calculationResult.miles > 0 ? (
    <>
      🎉 {calculationResult.rewardText} 🎉
      {calculationResult.appliedCap && (
        <Typography variant="body2" color="textSecondary">
          {`${
            calculationResult.appliedCap.category
          } cap applied: Max ${
            calculationResult.appliedCap.maxPoints ||
            calculationResult.appliedCap.maxCashback ||
            calculationResult.appliedCap.maxMiles
          } ${
            calculationResult.points
              ? "points"
              : calculationResult.cashback
              ? "cashback"
              : "miles"
          }${
            calculationResult.appliedCap.maxSpent
              ? ` or ₹${calculationResult.appliedCap.maxSpent.toFixed(
                  2
                )} spent`
              : ""
          }`}
        </Typography>
      )}
      {calculationResult.uncappedPoints > 0 &&
        calculationResult.uncappedPoints !==
          calculationResult.points && (
          <Typography variant="body2" color="textSecondary">
            (Uncapped: {calculationResult.uncappedPoints} points)
          </Typography>
        )}
      {calculationResult.uncappedCashback > 0 &&
        calculationResult.uncappedCashback !==
          calculationResult.cashback && (
          <Typography variant="body2" color="textSecondary">
            (Uncapped: ₹
            {calculationResult.uncappedCashback.toFixed(2)}{" "}
            cashback)
          </Typography>
        )}
      {calculationResult.uncappedMiles > 0 &&
        calculationResult.uncappedMiles !==
          calculationResult.miles && (
          <Typography variant="body2" color="textSecondary">
            (Uncapped: {calculationResult.uncappedMiles} miles)
          </Typography>
        )}
    </>
  ) : (
    <>😢 No rewards earned 😢</>
  )}
</Typography>
                  </Typography>
                </Paper>
              )}
  
              {calculationPerformed && calculationResult && user && !isCardInCollection && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddToMyCards}
                  sx={{ mt: 2, width: '100%' }}
                >
                  {user ? "Add to My Cards" : "Sign In & Add to My Cards"}
                </Button>
              )}
            </>
          )}
        </Paper>
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
  
      <MissingBankCardForm
        open={missingFormOpen}
        onClose={() => setMissingFormOpen(false)}
        onSubmitSuccess={(message) => showSnackbar(message, "success")}
      />
  
      <IncorrectRewardReportForm
        open={incorrectRewardReportOpen}
        onClose={() => setIncorrectRewardReportOpen(false)}
        onSubmitSuccess={(message) => showSnackbar(message, "success")}
        formData={{
          bank: selectedBank,
          card: selectedCard,
          mcc: selectedMcc
            ? `${selectedMcc.mcc} - ${selectedMcc.name}`
            : "Not selected",
          spentAmount,
          additionalInputs,
          calculationResult,
        }}
      />
  
      <Box
        component="footer"
        sx={{ py: 3, px: 2, mt: "auto", backgroundColor: "background.paper" }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 CardCompare. All rights reserved.
            <Link color="inherit" href="#" sx={{ ml: 2 }}>
              Terms of Service
            </Link>
            <Link color="inherit" href="#" sx={{ ml: 2 }}>
              Privacy
            </Link>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
  
}

export default CreditCardRewardsCalculator;
