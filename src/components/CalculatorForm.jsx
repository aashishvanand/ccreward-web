import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Button, Box } from '@mui/material';
import { mccList } from "../data/mccData";
import { bankData } from "../data/bankData";
import DynamicCardInputs from './DynamicCardInputs';

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
  getCardConfig
}) => {
  const [cardConfig, setCardConfig] = useState(null);

  useEffect(() => {
    if (selectedBank && selectedCard) {
      getCardConfig(selectedBank, selectedCard).then(config => {
        setCardConfig(config);
      });
    } else {
      setCardConfig(null);
    }
  }, [selectedBank, selectedCard, getCardConfig]);

  const isCalculateDisabled = !selectedBank || !selectedCard || !spentAmount || parseFloat(spentAmount) <= 0;

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
        options={mccList}
        getOptionLabel={(option) => `${option.mcc} - ${option.name}`}
        renderInput={(params) => (
          <TextField {...params} label="Search MCC (Optional)" margin="normal" />
        )}
        onChange={(event, newValue) => onMccChange(newValue)}
        value={selectedMcc}
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