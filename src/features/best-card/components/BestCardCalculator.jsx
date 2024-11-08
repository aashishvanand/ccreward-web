import  { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Container,
  Autocomplete,
  List,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";
import { useAuth } from "../../../core/providers/AuthContext";
import { getCardsForUser } from "../../../core/services/firebaseUtils";
import Confetti from "react-confetti";
import { CardListRenderer } from "./CardListRenderer";
import DynamicCardInputs from "../../../shared/components/ui/DynamicCardInputs";
import {
  fetchBestCardQuestions,
  calculateBestCard,
  fetchMCC,
} from "../../../core/services/api";
import _ from "lodash";

const BestCardCalculator = () => {
  const theme = useTheme();
  const [userCards, setUserCards] = useState([]);
  const [selectedMcc, setSelectedMcc] = useState(null);
  const [spentAmount, setSpentAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCardListLoading, setIsCardListLoading] = useState(true);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [mccOptions, setMccOptions] = useState([]);
  const { user } = useAuth();
  const [advancedMode, setAdvancedMode] = useState(false);
  const [cardQuestions, setCardQuestions] = useState([]);
  const [additionalInputs, setAdditionalInputs] = useState({});
  const [sortMethod, setSortMethod] = useState("points");
  const [lastCalculationParams, setLastCalculationParams] = useState(null);
  const [mccInputValue, setMccInputValue] = useState("");
  const [pointsRanking, setPointsRanking] = useState([]);
  const [valueRanking, setValueRanking] = useState([]);
  const [isLoadingMcc, setIsLoadingMcc] = useState(false);

  const currentRanking = sortMethod === "points" ? pointsRanking : valueRanking;

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
          setAlert({
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

  const debouncedFetchMCC = useCallback(
    _.debounce(async (value) => {
      if (value && value.length >= 2) {
        setIsLoadingMcc(true);
        try {
          const mccData = await fetchMCC(value);
          setMccOptions(mccData || []);
        } catch (error) {
          console.error("Error fetching MCC data:", error);
          setMccOptions([]);
          setAlert({
            open: true,
            message: "Error fetching MCC data. Please try again.",
            severity: "error",
          });
        } finally {
          setIsLoadingMcc(false);
        }
      } else {
        setMccOptions([]);
      }
    }, 300),
    []
  );

  const fetchCardQuestions = async (cards) => {
    try {
      const cardsData = cards.map((card) => ({
        bank: card.bank,
        cardName: card.cardName,
      }));
      const questions = await fetchBestCardQuestions(cardsData);
      setCardQuestions(questions);
    } catch (error) {
      console.error("Error fetching card questions:", error);
      setAlert({
        open: true,
        message: "Error fetching card questions. Please try again.",
        severity: "error",
      });
      setCardQuestions([]);
    }
  };

  const handleMccInputChange = (event, newValue) => {
    setMccInputValue(newValue);
    debouncedFetchMCC(newValue);
  };

  const handleCalculate = useCallback(async () => {
    if (!spentAmount || parseFloat(spentAmount) <= 0) {
      setAlert({
        open: true,
        message: "Please enter a valid spent amount",
        severity: "error",
      });
      return;
    }

    const answers = {};
    const cards = userCards
      .filter((card) => card.bank && card.cardName)
      .map((card) => {
        const cardKey = `${card.bank} - ${card.cardName}`;
        const cardAnswers = additionalInputs[cardKey] || {};

        if (Object.keys(cardAnswers).length > 0) {
          const nonEmptyAnswers = Object.entries(cardAnswers).reduce(
            (acc, [key, value]) => {
              if (value !== null && value !== undefined && value !== "") {
                acc[key] = value;
              }
              return acc;
            },
            {}
          );

          if (Object.keys(nonEmptyAnswers).length > 0) {
            answers[cardKey] = nonEmptyAnswers;
          }
        }

        return { bank: card.bank, cardName: card.cardName };
      });

    const calculationParams = {
      cards,
      mcc: selectedMcc ? selectedMcc.mcc : null,
      amount: parseFloat(spentAmount),
      answers,
    };

    if (
      JSON.stringify(calculationParams) ===
      JSON.stringify(lastCalculationParams)
    ) {
      setAlert({
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
      setPointsRanking(response.rankingByPoints);
      setValueRanking(response.rankingByValueINR);
      setIsCalculated(true);
      setLastCalculationParams(calculationParams);

      if (!hasCalculated) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        setHasCalculated(true);
      }
    } catch (error) {
      console.error("Error in calculateBestCard:", error);
      handleCalculationError(error);
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

  const handleCalculationError = (error) => {
    if (error.message.includes("too many requests")) {
      setAlert({
        open: true,
        message: error.message,
        severity: "warning",
      });
    } else {
      setAlert({
        open: true,
        message: "Error calculating best card. Please try again.",
        severity: "error",
      });
    }
  };

  const handleSortMethodChange = (event, newMethod) => {
    if (newMethod !== null) {
      setSortMethod(newMethod);
    }
  };

  const handleImageError = (cardId) => {
    setFailedImages((prev) => ({
      ...prev,
      [cardId]: true,
    }));
  };

  const handleAdditionalInputChange = useCallback(
    (cardKey, inputKey, value) => {
      setAdditionalInputs((prevInputs) => ({
        ...prevInputs,
        [cardKey]: {
          ...(prevInputs[cardKey] || {}),
          [inputKey]: value,
        },
      }));
    },
    []
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        {showConfetti && <Confetti />}
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.75rem", sm: "2.125rem" },
          }}
        >
          Know Your Best Card
        </Typography>

        <Stack spacing={3}>
          <Autocomplete
            options={mccOptions}
            value={selectedMcc}
            onChange={(event, newValue) => setSelectedMcc(newValue)}
            inputValue={mccInputValue}
            onInputChange={handleMccInputChange}
            getOptionLabel={(option) => `${option.mcc} - ${option.name}`}
            loading={isLoadingMcc}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Merchant or MCC (Optional)"
                fullWidth
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingMcc ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography variant="body1">
                    {option.mcc} - {option.name}
                  </Typography>
                  {option.knownMerchants?.length > 0 && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      Known merchants: {option.knownMerchants.join(", ")}
                    </Typography>
                  )}
                </Box>
              </li>
            )}
            filterOptions={(options) => options} // Disable client-side filtering
            noOptionsText={
              mccInputValue.length < 2
                ? "Type at least 2 characters to search"
                : "No options found"
            }
          />

          <TextField
            fullWidth
            label="Enter spent amount (INR)"
            type="number"
            value={spentAmount}
            onChange={(e) => setSpentAmount(e.target.value)}
            required
          />

          <Accordion
            expanded={advancedMode}
            onChange={(event, isExpanded) => setAdvancedMode(isExpanded)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Advanced Mode</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {cardQuestions.length === 0 ? (
                <Typography>No additional questions available.</Typography>
              ) : (
                Object.entries(
                  _.groupBy(cardQuestions, (q) => `${q.bank}-${q.cardName}`)
                ).map(([cardKey, questions]) => (
                  <Box key={cardKey} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {cardKey.replace("-", " - ")}
                    </Typography>
                    <DynamicCardInputs
                      cardConfig={questions}
                      onChange={(inputKey, value) =>
                        handleAdditionalInputChange(
                          cardKey.replace("-", " - "),
                          inputKey,
                          value
                        )
                      }
                      currentInputs={
                        additionalInputs[cardKey.replace("-", " - ")] || {}
                      }
                      selectedMcc={selectedMcc}
                    />
                    <Divider sx={{ my: 2 }} />
                  </Box>
                ))
              )}
            </AccordionDetails>
          </Accordion>

          <Button
            variant="contained"
            onClick={handleCalculate}
            disabled={!spentAmount || parseFloat(spentAmount) <= 0 || isLoading}
            sx={{ height: 48 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Calculate Best Card"
            )}
          </Button>

          {isCalculated && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <ToggleButtonGroup
                value={sortMethod}
                exclusive
                onChange={handleSortMethodChange}
                aria-label="sort method"
              >
                <ToggleButton value="points" aria-label="sort by points">
                  Ranking by Points/Cashback
                </ToggleButton>
                <ToggleButton
                  value="cashbackValue"
                  aria-label="sort by cashback value"
                >
                  Ranking by Value (INR)
                  <Tooltip title="For comparison purposes, we assume 1 mile = ₹1">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}

          <List sx={{ width: "100%" }}>
            <CardListRenderer
              isCardListLoading={isCardListLoading}
              isCalculated={isCalculated}
              cardRewards={currentRanking}
              userCards={userCards}
              failedImages={failedImages}
              handleImageError={handleImageError}
            />
          </List>
        </Stack>
      </Container>
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
};

export default BestCardCalculator;
