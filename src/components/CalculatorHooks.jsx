import { useState, useCallback } from "react";

export const useCardSelection = () => {
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedMcc, setSelectedMcc] = useState(null);
  const [spentAmount, setSpentAmount] = useState("");
  const [additionalInputs, setAdditionalInputs] = useState({});

  const handleBankChange = useCallback((newBank) => {
    setSelectedBank(newBank);
    setSelectedCard("");
    setAdditionalInputs({});
  }, []);

  const handleCardChange = useCallback((newCard) => {
    setSelectedCard(newCard);
    setAdditionalInputs({});
  }, []);

  const handleMccChange = useCallback((newMcc) => {
    setSelectedMcc(newMcc);
  }, []);

  const handleSpentAmountChange = useCallback((newAmount) => {
    setSpentAmount(newAmount);
  }, []);

  const handleAdditionalInputChange = useCallback((key, value) => {
    setAdditionalInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetAllFields = useCallback(() => {
    setSelectedBank("");
    setSelectedCard("");
    setSelectedMcc(null);
    setSpentAmount("");
    setAdditionalInputs({});
  }, []);

  return {
    selectedBank,
    selectedCard,
    selectedMcc,
    spentAmount,
    additionalInputs,
    handleBankChange,
    handleCardChange,
    handleMccChange,
    handleSpentAmountChange,
    handleAdditionalInputChange,
    resetAllFields,
  };
};
export const useRewardCalculation = (
  selectedBank,
  selectedCard,
  selectedMcc,
  spentAmount,
  additionalInputs
) => {
  const [calculationResult, setCalculationResult] = useState(null);
  const [calculationPerformed, setCalculationPerformed] = useState(false);

  const clearForm = useCallback(() => {
    setCalculationResult(null);
    setCalculationPerformed(false);
  }, []);

  return {
    calculationResult,
    calculationPerformed,
    clearForm,
  };
};
