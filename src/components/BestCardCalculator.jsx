import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { calculateRewards, getCardConfig } from "./CalculatorHelpers";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../app/providers/AuthContext";
import { getCardsForUser } from "../utils/firebaseUtils";
import { mccList } from "../data/mccData";
import ReactConfetti from "react-confetti";
import { renderCardList } from "./CardListRenderer";
import DynamicCardInputs from "./DynamicCardInputs";
import { useAppTheme } from "./ThemeRegistry";

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
  const [mccOptions, setMccOptions] = useState(mccList);
  const { user } = useAuth();
  const [sortMethod, setSortMethod] = useState("default");
  const [advancedMode, setAdvancedMode] = useState(false);
  const [cardConfigs, setCardConfigs] = useState({});
  const [additionalInputs, setAdditionalInputs] = useState({});

  useEffect(() => {
    const fetchUserCards = async () => {
      if (user) {
        try {
          setIsCardListLoading(true);
          const fetchedCards = await getCardsForUser(user.uid);
          setUserCards(fetchedCards);
          await fetchCardConfigs(fetchedCards);
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
      const searchTerm = value.toLowerCase();
      const filteredOptions = mccList.filter(
        (option) =>
          option.mcc.toLowerCase().includes(searchTerm) ||
          option.name.toLowerCase().includes(searchTerm) ||
          option.knownMerchants.some((merchant) =>
            merchant.toLowerCase().includes(searchTerm)
          )
      );
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
          additionalInputs[`${card.bank}-${card.cardName}`] || {}
        );
        return { ...card, ...result };
      })
    );

    sortRewards(rewards, sortMethod);

    setIsLoading(false);
    setIsCalculated(true);

    if (!hasCalculated) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      setHasCalculated(true);
    }
  };

  const fetchCardConfigs = async (cards) => {
    const configs = {};
    for (const card of cards) {
      try {
        const config = await getCardConfig(card.bank, card.cardName);
        if (config) {
          configs[`${card.bank}-${card.cardName}`] = config;
        }
      } catch (error) {
        console.error(
          `Error fetching config for ${card.bank} ${card.cardName}:`,
          error
        );
      }
    }
    setCardConfigs(configs);
  };

  const renderAdvancedModeContent = () => {
    const cardsWithQuestions = Object.entries(cardConfigs).filter(
      ([_, config]) => {
        if (!config || typeof config.dynamicInputs !== 'function') {
          return false;
        }
        const inputs = config.dynamicInputs({}, () => {}, selectedMcc?.mcc);
        return inputs && inputs.length > 0;
      }
    );

    if (cardsWithQuestions.length === 0) {
      return <Typography>No additional questions available for your cards and the selected MCC.</Typography>;
    }

    return cardsWithQuestions.map(([cardKey, config]) => {
      const dynamicInputs = config.dynamicInputs({}, () => {}, selectedMcc?.mcc);
      if (!dynamicInputs || dynamicInputs.length === 0) {
        return null;
      }

      return (
        <Box key={cardKey} sx={{ mb: 2 }}>
          <Typography variant="h6">{cardKey}</Typography>
          <DynamicCardInputs
            cardConfig={config}
            onChange={(inputKey, value) =>
              handleAdditionalInputChange(cardKey, inputKey, value)
            }
            currentInputs={additionalInputs[cardKey] || {}}
            selectedMcc={selectedMcc}
          />
        </Box>
      );
    }).filter(Boolean);
  };

  const sortRewards = (rewards, method) => {
    let sortedRewards = rewards.map((reward) => ({
      ...reward,
      displayValue: calculateDisplayValue(reward, method),
      sortValue: calculateSortValue(reward, method),
    }));

    sortedRewards.sort((a, b) => b.sortValue - a.sortValue);
    setCardRewards(sortedRewards);
  };

  const calculateDisplayValue = (reward, method) => {
    if (!reward.cardType) {
      console.log("Card type is missing for reward:", reward);
      return "Card type missing";
    }

    if (method === "default") {
      switch (reward.cardType) {
        case "points":
          return `${reward.points} points`;
        case "miles":
          return `${reward.miles} miles`;
        case "cashback":
          return `₹${reward.cashback.toFixed(2)}`;
        case "hybrid":
          return reward.points
            ? `${reward.points} points`
            : `₹${reward.cashback.toFixed(2)}`;
        default:
          return "No rewards";
      }
    } else {
      // cashback value sort
      switch (reward.cardType) {
        case "points":
          if (reward.cashbackValue?.cashValue) {
            return `₹${reward.cashbackValue.cashValue.toFixed(2)} value`;
          } else if (reward.cashbackValue?.airMiles) {
            return `${reward.cashbackValue.airMiles} miles`;
          }
          return `${reward.points} points`;
        case "miles":
          return `${reward.miles} miles`;
        case "cashback":
          return `₹${reward.cashback.toFixed(2)} cashback`;
        case "hybrid":
          if (reward.points) {
            if (reward.cashbackValue?.cashValue) {
              return `₹${reward.cashbackValue.cashValue.toFixed(2)} value`;
            } else if (reward.cashbackValue?.airMiles) {
              return `${reward.cashbackValue.airMiles} miles`;
            }
            return `${reward.points} points`;
          }
          return `₹${reward.cashback.toFixed(2)} cashback`;
        default:
          return "No rewards";
      }
    }
  };

  const calculateSortValue = (reward, method) => {
    if (!reward.cardType) {
      console.log("Card type is missing for reward:", reward);
      return 0;
    }

    if (method === "default") {
      switch (reward.cardType) {
        case "points":
        case "miles":
          return reward.points || reward.miles || 0;
        case "cashback":
        case "hybrid":
          return reward.cashback || reward.points || 0;
        default:
          return 0;
      }
    } else {
      // cashback value sort
      switch (reward.cardType) {
        case "points":
          return (
            reward.cashbackValue?.cashValue ||
            reward.cashbackValue?.airMiles ||
            reward.points ||
            0
          );
        case "miles":
          return reward.miles || 0;
        case "hybrid":
          if (reward.points) {
            return (
              reward.cashbackValue?.cashValue ||
              reward.cashbackValue?.airMiles ||
              reward.points ||
              0
            );
          }
          return reward.cashback || 0;
        case "cashback":
          return reward.cashback || 0;
        default:
          return 0;
      }
    }
  };

  const handleSortMethodChange = (event, newMethod) => {
    if (newMethod !== null) {
      setSortMethod(newMethod);
      sortRewards(cardRewards, newMethod);
    }
  };

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
              <ToggleButton value="default" aria-label="sort by default">
                Sort by Points
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
