import React, { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import DynamicCardInputs from "./DynamicCardInputs";
import {
  fetchBanks,
  fetchCards,
  fetchMCC,
  fetchCardQuestions,
} from "../utils/api";
import _ from "lodash";

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
  isEmbedded = false,
  tokenReady = true,
}) => {
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [mccOptions, setMccOptions] = useState([]);
  const [cardQuestions, setCardQuestions] = useState(null);
  const [mccInputValue, setMccInputValue] = useState("");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  useEffect(() => {
    if (tokenReady) {
      fetchBanks(isEmbedded).then(setBanks).catch(console.error);
    }
  }, [isEmbedded, tokenReady]);

  useEffect(() => {
    if (selectedBank && tokenReady) {
      fetchCards(selectedBank, isEmbedded).then(setCards).catch(console.error);
    } else {
      setCards([]);
    }
  }, [selectedBank, isEmbedded, tokenReady]);

  useEffect(() => {
    if (selectedBank && selectedCard && tokenReady) {
      setIsLoadingQuestions(true);
      fetchCardQuestions(selectedBank, selectedCard, isEmbedded)
        .then((response) => {
          setCardQuestions(response);
          setIsLoadingQuestions(false);
        })
        .catch((error) => {
          if (error.message.includes("too many requests")) {
            onError(error.message, "warning");
          } else {
            console.error("Error fetching card questions:", error);
            setCardQuestions(null);
            setIsLoadingQuestions(false);
            onError(
              error.response?.data?.error ||
                error.message ||
                "An error occurred while fetching card questions."
            );
          }
        });
    } else {
      setCardQuestions(null);
    }
  }, [selectedBank, selectedCard, isEmbedded, tokenReady, onError]);

  const debouncedFetchMCC = useCallback(
    _.debounce(async (value) => {
      if (value) {
        try {
          const mccData = await fetchMCC(value, isEmbedded);
          return mccData;
        } catch (error) {
          console.error("Error fetching MCC data:", error);
          return [];
        }
      } else {
        return [];
      }
    }, 300),
    [isEmbedded]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await debouncedFetchMCC(mccInputValue);
        setMccOptions(result || []); // Ensure we always set an array
      } catch (error) {
        console.error("Error fetching MCC data:", error);
        setMccOptions([]); // Set empty array in case of error
      }
    };

    if (mccInputValue) {
      fetchData();
    } else {
      setMccOptions([]); // Clear options if input is empty
    }
  }, [mccInputValue, debouncedFetchMCC]);

  const handleMccInputChange = (event, newInputValue) => {
    setMccInputValue(newInputValue);
  };

  const isCalculateDisabled =
    !selectedBank ||
    !selectedCard ||
    !spentAmount ||
    parseFloat(spentAmount) <= 0 ||
    isLoadingQuestions;

  const getOptionLabel = (option) => {
    if (typeof option === "string") return option;
    return `${option.mcc} - ${option.name}`;
  };

  const renderOption = (props, option) => {
    return (
      <li {...props} key={option.mcc}>
        <Box>
          <Typography variant="body1">
            {option.mcc} - {option.name}
          </Typography>
          {option.knownMerchants && option.knownMerchants.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Known merchants: {option.knownMerchants.join(", ")}
            </Typography>
          )}
        </Box>
      </li>
    );
  };

  const filterOptions = (options, { inputValue }) => {
    return options.filter((option) => {
      const matchMcc = option.mcc
        .toLowerCase()
        .includes(inputValue.toLowerCase());
      const matchName = option.name
        .toLowerCase()
        .includes(inputValue.toLowerCase());
      const matchMerchants = option.knownMerchants.some((merchant) =>
        merchant.toLowerCase().includes(inputValue.toLowerCase())
      );
      return matchMcc || matchName || matchMerchants;
    });
  };

  return (
    <>
      <Autocomplete
        fullWidth
        options={banks}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a bank"
            margin="normal"
            required
          />
        )}
        value={selectedBank}
        onChange={(event, newValue) => onBankChange(newValue)}
      />

      <Autocomplete
        fullWidth
        options={cards}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a card"
            margin="normal"
            required
          />
        )}
        value={selectedCard}
        onChange={(event, newValue) => onCardChange(newValue)}
        disabled={!selectedBank}
      />

      <Autocomplete
        fullWidth
        options={mccOptions}
        getOptionLabel={(option) => `${option.mcc} - ${option.name}`}
        renderOption={(props, option) => (
          <li {...props}>
            <Box>
              <Typography variant="body1">
                {option.mcc} - {option.name}
              </Typography>
              {option.knownMerchants && option.knownMerchants.length > 0 && (
                <Typography variant="body2" color="text.secondary">
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
            margin="normal"
          />
        )}
        onInputChange={handleMccInputChange}
        onChange={(event, newValue) => onMccChange(newValue)}
        value={selectedMcc}
        inputValue={mccInputValue}
        filterOptions={(options, { inputValue }) => {
          const filterValue = inputValue.toLowerCase();
          return options.filter(
            (option) =>
              option.mcc.toLowerCase().includes(filterValue) ||
              option.name.toLowerCase().includes(filterValue) ||
              (option.knownMerchants &&
                option.knownMerchants.some((merchant) =>
                  merchant.toLowerCase().includes(filterValue)
                ))
          );
        }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Enter spent amount (INR)"
        type="number"
        value={spentAmount}
        onChange={(e) => onSpentAmountChange(e.target.value)}
        required
      />

      {isLoadingQuestions ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
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
          onClick={onCalculate}
          sx={{ width: "48%" }}
          disabled={isCalculateDisabled}
        >
          Calculate
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClear}
          sx={{ width: "48%" }}
        >
          Clear
        </Button>
      </Box>
    </>
  );
};

export default CalculatorForm;
