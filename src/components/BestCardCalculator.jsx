import React, { useState, useEffect, useCallback } from "react";
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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../app/providers/AuthContext";
import { getCardsForUser } from "../utils/firebaseUtils";
import ReactConfetti from "react-confetti";
import { renderCardList } from "./CardListRenderer";
import DynamicCardInputs from "./DynamicCardInputs";
import { useAppTheme } from "./ThemeRegistry";
import { fetchBestCardQuestions, calculateBestCard, fetchMCC } from "../utils/api";
import _ from "lodash";

const BestCardCalculator = () => {
  const { theme } = useAppTheme();
  const [userCards, setUserCards] = useState([]);
  const [selectedMcc, setSelectedMcc] = useState(null);
  const [spentAmount, setSpentAmount] = useState("");
  const [cardRewards, setCardRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCardListLoading, setIsCardListLoading] = useState(true);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [mccOptions, setMccOptions] = useState([]);
  const { user } = useAuth();
  const [advancedMode, setAdvancedMode] = useState(false);
  const [cardQuestions, setCardQuestions] = useState({});
  const [additionalInputs, setAdditionalInputs] = useState({});
  const [sortMethod, setSortMethod] = useState("points");
  const [lastCalculationParams, setLastCalculationParams] = useState(null);
  const [mccInputValue, setMccInputValue] = useState("");

  useEffect(() => {
    const fetchUserCards = async () => {
      if (user) {
        try {
          setIsCardListLoading(true);
          const fetchedCards = await getCardsForUser(user.uid);
          setUserCards(fetchedCards);
          await fetchCardQuestions(fetchedCards);
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

  const fetchCardQuestions = async (cards) => {
    try {
      const cardsData = cards.map((card) => ({
        bank: card.bank,
        cardName: card.cardName,
      }));
      console.log("Sending cards data:", cardsData);
      const questions = await fetchBestCardQuestions(cardsData);
      console.log("Received questions:", questions);
      setCardQuestions(Array.isArray(questions) ? questions : []);
    } catch (error) {
      console.error("Error fetching card questions:", error);
      setSnackbar({
        open: true,
        message: "Error fetching card questions. Please try again.",
        severity: "error",
      });
      setCardQuestions([]);
    }
  };

  const debouncedFetchMCC = useCallback(
    _.debounce(async (value) => {
      if (value) {
        try {
          const mccData = await fetchMCC(value);
          console.log("Fetched MCC data:", mccData);
          setMccOptions(mccData);
        } catch (error) {
          console.error("Error fetching MCC data:", error);
          setMccOptions([]);
        }
      } else {
        setMccOptions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchMCC(mccInputValue);
    return () => debouncedFetchMCC.cancel();
  }, [mccInputValue, debouncedFetchMCC]);

  const handleMccInputChange = (event, newInputValue) => {
    setMccInputValue(newInputValue);
  };

  const handleCalculate = useCallback(async () => {
    if (!spentAmount || parseFloat(spentAmount) <= 0) {
      setSnackbar({
        open: true,
        message: "Please enter a valid spent amount",
        severity: "error",
      });
      return;
    }

    const calculationParams = {
      cards: userCards.map((card) => ({
        bank: card.bank,
        cardName: card.cardName,
      })),
      mcc: selectedMcc ? selectedMcc.mcc : null,
      amount: parseFloat(spentAmount),
      answers: additionalInputs,
    };

    if (
      JSON.stringify(calculationParams) ===
      JSON.stringify(lastCalculationParams)
    ) {
      setSnackbar({
        open: true,
        message:
          "Calculation parameters haven't changed. No need to recalculate.",
        severity: "info",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await calculateBestCard(calculationParams);
      setCardRewards(response.rankingByPoints);
      setIsCalculated(true);
      setLastCalculationParams(calculationParams);

      if (!hasCalculated) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        setHasCalculated(true);
      }
    } catch (error) {
      console.error("Error calculating rewards:", error);
      setSnackbar({
        open: true,
        message: "Error calculating rewards. Please try again.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    spentAmount,
    userCards,
    selectedMcc,
    additionalInputs,
    lastCalculationParams,
    hasCalculated,
  ]);

  const renderAdvancedModeContent = () => {
    if (!Array.isArray(cardQuestions) || cardQuestions.length === 0) {
      return <Typography>No additional questions available for your cards.</Typography>;
    }

    const groupedQuestions = cardQuestions.reduce((acc, question) => {
      const key = `${question.bank} - ${question.cardName}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(question);
      return acc;
    }, {});

    return Object.entries(groupedQuestions).map(([cardKey, questions], index) => (
      <Box key={cardKey} sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{cardKey}</Typography>
        {questions.map((question, qIndex) => (
          <Box key={qIndex} sx={{ mb: 2 }}>
            <DynamicCardInputs
              cardConfig={{ dynamicInputs: [question] }}
              onChange={(inputKey, value) =>
                handleAdditionalInputChange(cardKey, inputKey, value)
              }
              currentInputs={additionalInputs[cardKey] || {}}
              selectedMcc={selectedMcc}
            />
          </Box>
        ))}
        {index < Object.entries(groupedQuestions).length - 1 && (
          <Divider sx={{ my: 2 }} />
        )}
      </Box>
    ));
  };

  const handleSortMethodChange = (event, newMethod) => {
    if (newMethod !== null) {
      setSortMethod(newMethod);
      sortRewards(newMethod);
    }
  };

  const sortRewards = useCallback(
    (method) => {
      const sortedRewards = [...cardRewards].sort((a, b) => {
        if (method === "points") {
          return (b.points || b.cashback || 0) - (a.points || a.cashback || 0);
        } else {
          return (
            (b.cashbackValue?.cashValue || b.cashback || 0) -
            (a.cashbackValue?.cashValue || a.cashback || 0)
          );
        }
      });
      setCardRewards(sortedRewards);
    },
    [cardRewards]
  );

  useEffect(() => {
    if (cardRewards.length > 0) {
      sortRewards(sortMethod);
    }
  }, [sortMethod, cardRewards, sortRewards]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleImageError = (cardId) => {
    setFailedImages((prevFailedImages) => ({
      ...prevFailedImages,
      [cardId]: true,
    }));
  };

  const handleAdditionalInputChange = (cardKey, inputKey, value) => {
    setAdditionalInputs((prevInputs) => ({
      ...prevInputs,
      [cardKey]: {
        ...(prevInputs[cardKey] || {}),
        [inputKey]: value,
      },
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
                <span style={{ fontSize: "0.8em", color: "gray" }}>
                  {" "}
                  (e.g., {option.knownMerchants.join(", ")})
                </span>
              )}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Merchant or MCC (Optional)"
              margin="normal"
              fullWidth
            />
          )}
          onInputChange={handleMccInputChange}
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
        <Accordion
          expanded={advancedMode}
          onChange={() => setAdvancedMode(!advancedMode)}
          sx={{
            mt: 2,
            mb: 2,
            backgroundColor: theme.palette.background.paper,
            "& .MuiAccordionSummary-root": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.grey[200]
                  : theme.palette.grey[800],
              color: theme.palette.text.primary,
            },
            "& .MuiAccordionSummary-expandIconWrapper": {
              color: theme.palette.text.secondary,
            },
            "& .MuiAccordionDetails-root": {
              backgroundColor: theme.palette.background.paper,
              borderTop: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Advanced Mode</Typography>
          </AccordionSummary>
          <AccordionDetails>{renderAdvancedModeContent()}</AccordionDetails>
        </Accordion>
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
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Calculate Best Card"
            )}
          </Button>
        </Box>
        {isCalculated && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <ToggleButtonGroup
              value={sortMethod}
              exclusive
              onChange={handleSortMethodChange}
              aria-label="sort method"
            >
              <ToggleButton value="points" aria-label="sort by points">
                Sort by Points/Cashback
              </ToggleButton>
              <ToggleButton
                value="cashbackValue"
                aria-label="sort by cashback value"
              >
                Sort by Cashback INR
                <Tooltip
                  title="For comparison purposes, we assume 1 mile = ₹1"
                  arrow
                >
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
        <List sx={{ width: "100%" }}>
          {renderCardList(
            isCardListLoading,
            isCalculated,
            cardRewards,
            userCards,
            failedImages,
            handleImageError
          )}
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