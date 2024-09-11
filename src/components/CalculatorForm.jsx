import { useState, useEffect } from "react";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
import { mccList } from "../data/mccData";
import { bankData } from "../data/bankData";
import DynamicCardInputs from "./DynamicCardInputs";

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
  getCardConfig,
}) => {
  const [cardConfig, setCardConfig] = useState(null);
  const [mccOptions, setMccOptions] = useState(mccList);

  useEffect(() => {
    if (selectedBank && selectedCard) {
      getCardConfig(selectedBank, selectedCard).then((config) => {
        setCardConfig(config);
      });
    } else {
      setCardConfig(null);
    }
  }, [selectedBank, selectedCard, getCardConfig]);

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

  const isCalculateDisabled =
    !selectedBank ||
    !selectedCard ||
    !spentAmount ||
    parseFloat(spentAmount) <= 0;

  return (
    <>
      <Autocomplete
        fullWidth
        options={Object.keys(bankData)}
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
        options={selectedBank ? bankData[selectedBank] : []}
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
          />
        )}
        onInputChange={handleMccSearch}
        onChange={(event, newValue) => onMccChange(newValue)}
        value={selectedMcc}
        filterOptions={(x) => x}
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

      {cardConfig && (
        <DynamicCardInputs
          cardConfig={cardConfig}
          onChange={onAdditionalInputChange}
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
