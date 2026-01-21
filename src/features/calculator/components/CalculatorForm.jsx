import { useState, useEffect, useCallback, useRef } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Stack,
  useTheme,
  InputAdornment,
  Alert,
  IconButton,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import DynamicCardInputs from "../../../shared/components/ui/DynamicCardInputs";
import {
  fetchBanks,
  fetchCards,
  fetchMCC,
  fetchCardQuestions,
} from "../../../core/services/api";
import _ from "lodash";
import PropTypes from "prop-types";
import { useSearchParams } from "next/navigation";
import { useRegion } from "../../../core/providers/RegionContext";
import { getCurrencySymbol } from "../../../core/utils";

const CalculatorForm = ({
  selectedBank,
  selectedCard,
  selectedMcc,
  spentAmount,
  additionalInputs,
  onBankChange,
  onCardChange,
  onMccChange,
  onSpentAmountChange,
  onAdditionalInputChange,
  onCalculate,
  onClear,
  onError,
  isCalculating = false,
}) => {
  const theme = useTheme();
  const { region, isInitialized } = useRegion(); // Add isInitialized from RegionContext
  const isFirstRender = useRef(true);
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [mccOptions, setMccOptions] = useState([]);
  const [cardQuestions, setCardQuestions] = useState(null);
  const [mccInputValue, setMccInputValue] = useState("");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isLoadingMcc, setIsLoadingMcc] = useState(false);
  const searchParams = useSearchParams();
  const [isValidating, setIsValidating] = useState(false);
  const [regionError, setRegionError] = useState(false); // Add this state to track region initialization errors

  const handleRegionChange = useCallback(async () => {
    // Reset all form states
    onBankChange("");
    onCardChange("");
    setCards([]);
    setCardQuestions(null);
    setMccOptions([]);
    setMccInputValue("");

    // Only try to load banks if region is initialized
    if (isInitialized) {
      try {
        setIsLoadingBanks(true);
        const fetchedBanks = await fetchBanks();
        setBanks(fetchedBanks);
        setRegionError(false); // Clear any previous region errors
      } catch (error) {
        console.error("Error fetching banks after region change:", error);
        if (error.message?.includes("Region not initialized")) {
          setRegionError(true);
        } else {
          onError?.(
            "Failed to load banks for the new region. Please try again."
          );
        }
      } finally {
        setIsLoadingBanks(false);
      }
    }
  }, [onBankChange, onCardChange, onError, isInitialized]);

  // Effect to load banks - now respects region initialization
  useEffect(() => {
    if (isInitialized) {
      loadBanks();
    }
  }, [region, isInitialized]);

  // Effect for selected bank - now respects region initialization
  useEffect(() => {
    if (isInitialized && selectedBank) {
      loadCards();
    } else {
      setCards([]);
    }
  }, [selectedBank, isInitialized]);

  // Effect for selected card - now respects region initialization
  useEffect(() => {
    if (isInitialized && selectedBank && selectedCard) {
      loadCardQuestions();
    } else {
      setCardQuestions(null);
    }
  }, [selectedBank, selectedCard, isInitialized]);

  // URL parameter handling - now respects region initialization
  useEffect(() => {
    const validateAndSetBankCard = async () => {
      const bank = searchParams.get("bank");
      const card = searchParams.get("card");

      if (!bank || !card || !isInitialized) return;
      if (selectedBank && selectedCard) return; // Don't revalidate if already set

      setIsValidating(true);
      try {
        // Fetch valid cards for the bank
        const validCards = await fetchCards(bank);

        // Check if the provided card exists for this bank
        const isValidCard = validCards.includes(card);

        if (isValidCard) {
          onBankChange(bank);
          onCardChange(card);
        } else {
          onError?.("Invalid bank or card combination. Please try again.");
          // Clear invalid params from URL without refresh
          const url = new URL(window.location.href);
          url.searchParams.delete("bank");
          url.searchParams.delete("card");
          window.history.replaceState({}, "", url);
        }
      } catch (error) {
        console.error("Error validating bank and card:", error);
        if (error.message?.includes("Region not initialized")) {
          setRegionError(true);
        } else {
          onError?.("Error validating card details. Please try again.");
        }
      } finally {
        setIsValidating(false);
      }
    };

    validateAndSetBankCard();
  }, [
    searchParams,
    selectedBank,
    selectedCard,
    onBankChange,
    onCardChange,
    onError,
    isInitialized,
  ]);

  // Event handler for region changes
  useEffect(() => {
    // Skip the first render to prevent unnecessary initial load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Trigger region change handling
    handleRegionChange();
  }, [region, handleRegionChange]);

  const loadBanks = async () => {
    if (!isInitialized) return; // Skip if region not initialized

    setIsLoadingBanks(true);
    try {
      const fetchedBanks = await fetchBanks();
      setBanks(fetchedBanks);
      setRegionError(false); // Clear any previous region errors
    } catch (error) {
      console.error("Error fetching banks:", error);
      if (error.message?.includes("Region not initialized")) {
        setRegionError(true);
      } else {
        onError?.("Failed to load banks. Please try again.");
      }
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const loadCards = async () => {
    if (!isInitialized) return; // Skip if region not initialized

    setIsLoadingCards(true);
    try {
      const fetchedCards = await fetchCards(selectedBank);
      setCards(fetchedCards);
      setRegionError(false); // Clear any previous region errors
    } catch (error) {
      console.error("Error fetching cards:", error);
      if (error.message?.includes("Region not initialized")) {
        setRegionError(true);
      } else {
        onError?.("Failed to load cards. Please try again.");
      }
    } finally {
      setIsLoadingCards(false);
    }
  };

  const loadCardQuestions = async () => {
    if (!isInitialized) return; // Skip if region not initialized

    setIsLoadingQuestions(true);
    try {
      const questions = await fetchCardQuestions(selectedBank, selectedCard);
      setCardQuestions(questions);
      setRegionError(false); // Clear any previous region errors
    } catch (error) {
      handleQuestionsFetchError(error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleQuestionsFetchError = (error) => {
    if (error.message?.includes("Region not initialized")) {
      setRegionError(true);
    } else if (error.message?.includes("too many requests")) {
      onError?.(error.message, "warning");
    } else {
      console.error("Error fetching card questions:", error);
      setCardQuestions(null);
      onError?.(
        error.response?.data?.error ||
          error.message ||
          "An error occurred while fetching card questions."
      );
    }
  };

  const getCurrencySymbol = () => {
    switch (region) {
      case "SG":
        return "S$";
      case "IN":
        return "₹";
      default:
        return "$";
    }
  };

  const debouncedFetchMCC = useCallback(
    _.debounce(async (value) => {
      if (!isInitialized) return; // Skip if region not initialized

      if (value && value.length >= 2) {
        setIsLoadingMcc(true);
        try {
          const mccData = await fetchMCC(value);
          setMccOptions(mccData || []);
          setRegionError(false); // Clear any previous region errors
        } catch (error) {
          console.error("Error fetching MCC data:", error);
          if (error.message?.includes("Region not initialized")) {
            setRegionError(true);
          } else {
            setMccOptions([]);
            onError?.("Failed to load MCC data. Please try again.");
          }
        } finally {
          setIsLoadingMcc(false);
        }
      } else {
        setMccOptions([]);
      }
    }, 300),
    [onError, isInitialized]
  );

  const handleMccInputChange = (event, newValue) => {
    setMccInputValue(newValue);
    if (isInitialized) {
      debouncedFetchMCC(newValue);
    }
  };

  const isCalculateDisabled =
    !isInitialized ||
    regionError ||
    !selectedBank ||
    !selectedCard ||
    !spentAmount ||
    parseFloat(spentAmount) <= 0 ||
    isLoadingQuestions ||
    isCalculating;

  // Show loading state when region is not initialized
  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 4,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Initializing region settings...{" "}
          {JSON.stringify({ region, isInitialized })}
        </Typography>
      </Box>
    );
  }

  // Show error when region initialization failed
  if (regionError) {
    return (
      <Alert
        severity="error"
        sx={{ my: 2 }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        }
      >
        Region settings not properly initialized. Please refresh the page to try
        again.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Autocomplete
        fullWidth
        options={banks}
        value={selectedBank}
        onChange={(event, newValue) => onBankChange(newValue)}
        loading={isLoadingBanks}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a bank"
            required
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoadingBanks && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />
      <Autocomplete
        fullWidth
        options={cards}
        value={selectedCard}
        onChange={(event, newValue) => onCardChange(newValue)}
        disabled={!selectedBank || isLoadingCards}
        loading={isLoadingCards}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a card"
            required
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoadingCards && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />
      <Autocomplete
        fullWidth
        options={mccOptions}
        value={selectedMcc}
        onChange={(event, newValue) => onMccChange(newValue)}
        inputValue={mccInputValue}
        onInputChange={handleMccInputChange}
        loading={isLoadingMcc}
        getOptionLabel={(option) => `${option.mcc} - ${option.name}`}
        renderOption={(props, option) => (
          <li {...props}>
            <Box>
              <Typography variant="body1">
                {option.mcc} - {option.name}
              </Typography>
              {option.knownMerchants?.length > 0 && (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Known merchants: {option.knownMerchants.join(", ")}
                </Typography>
              )}
            </Box>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search MCC, Merchant Category, or Known Merchants"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoadingMcc && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
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
        label="Spent Amount"
        type="number"
        value={spentAmount}
        onChange={(e) => {
          // Prevent negative numbers and ensure minimum of 1
          const value = Math.max(1, Number(e.target.value));
          onSpentAmountChange(value.toString());
        }}
        required
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                {getCurrencySymbol(region)}
              </InputAdornment>
            ),
            endAdornment: spentAmount && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear spent amount"
                  onClick={() => onSpentAmountChange("")}
                  edge="end"
                  size="small"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
            inputProps: {
              min: 1,
              step: 1,
            },
          },
        }}
      />
      {isLoadingQuestions ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        cardQuestions && (
          <DynamicCardInputs
            cardConfig={cardQuestions}
            onChange={onAdditionalInputChange}
            currentInputs={additionalInputs}
            selectedMcc={selectedMcc}
          />
        )
      )}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={onCalculate}
          disabled={isCalculateDisabled}
          sx={{ flex: 1, height: 48 }}
        >
          {isCalculating ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Calculate"
          )}
        </Button>
        <Button
          variant="outlined"
          onClick={onClear}
          sx={{ flex: 1, height: 48 }}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
};

CalculatorForm.propTypes = {
  selectedBank: PropTypes.string,
  selectedCard: PropTypes.string,
  selectedMcc: PropTypes.shape({
    mcc: PropTypes.string,
    name: PropTypes.string,
  }),
  spentAmount: PropTypes.string,
  additionalInputs: PropTypes.object,
  onBankChange: PropTypes.func.isRequired,
  onCardChange: PropTypes.func.isRequired,
  onMccChange: PropTypes.func.isRequired,
  onSpentAmountChange: PropTypes.func.isRequired,
  onAdditionalInputChange: PropTypes.func.isRequired,
  onCalculate: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onError: PropTypes.func,
  isCalculating: PropTypes.bool,
};

export default CalculatorForm;
