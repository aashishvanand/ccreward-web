"use client";

import { useState, useCallback } from "react";
import { getNativeCurrency } from "@/core/utils/currency";
import { useRegion } from "@/core/providers/RegionContext";

export const useCardSelection = () => {
  const { region } = useRegion();
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedMcc, setSelectedMcc] = useState(null);
  const [spentAmount, setSpentAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(getNativeCurrency(region));
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

  const handleCurrencyChange = useCallback((newCurrency) => {
    setSelectedCurrency(newCurrency);
  }, []);

  const handleAdditionalInputChange = useCallback((key, value) => {
    setAdditionalInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetAllFields = useCallback(() => {
    setSelectedBank("");
    setSelectedCard("");
    setSelectedMcc(null);
    setSpentAmount("");
    setSelectedCurrency(getNativeCurrency(region));
    setAdditionalInputs({});
  }, [region]);

  return {
    selectedBank,
    selectedCard,
    selectedMcc,
    spentAmount,
    selectedCurrency,
    additionalInputs,
    handleBankChange,
    handleCardChange,
    handleMccChange,
    handleSpentAmountChange,
    handleCurrencyChange,
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
