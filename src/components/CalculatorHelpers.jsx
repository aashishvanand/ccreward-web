import { calculateAmexRewards } from "../utils/amexRewards";
import { calculateICICIRewards } from "../utils/iciciRewards";
import { calculateHDFCRewards } from "../utils/hdfcRewards";
import { calculateHSBCRewards } from "../utils/hsbcRewards";
import { calculateAxisRewards } from "../utils/axisRewards";
import { calculateIDFCFirstRewards } from "../utils/idfcfirstRewards";
import { calculateOneCardRewards } from "../utils/onecardRewards";
import { calculateSCRewards } from "../utils/scRewards";
import { calculateSBIRewards } from "../utils/sbiRewards";

export const calculateRewards = (selectedBank, selectedCard, selectedMcc, spentAmount, additionalInputs) => {
  const amount = parseFloat(spentAmount);
  const mcc = selectedMcc ? selectedMcc.mcc : null;

  let result;

  switch (selectedBank) {
    case "AMEX":
      result = calculateAmexRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "ICICI":
      result = calculateICICIRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "HDFC":
      result = calculateHDFCRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "HSBC":
      result = calculateHSBCRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "Axis":
      result = calculateAxisRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "IDFCFirst":
      result = calculateIDFCFirstRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "OneCard":
      result = calculateOneCardRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "SBI":
      result = calculateSBIRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "SC":
      result = calculateSCRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    default:
      console.error("Unknown bank selected:", selectedBank);
      return null;
  }

  return result;
};

export const formatRewardText = (result) => {
  if (result.points > 0) {
    return `You earned ${result.points} points!`;
  } else if (result.cashback > 0) {
    return `You earned ₹${result.cashback.toFixed(2)} cashback!`;
  } else if (result.miles > 0) {
    return `You earned ${result.miles} miles!`;
  } else {
    return "No rewards earned for this transaction.";
  }
};

export const getCardConfig = (bank, card) => {
  switch (bank) {
    case "AMEX":
      return import("../utils/amexRewards").then(module => module.amexCardRewards[card]);
    case "ICICI":
      return import("../utils/iciciRewards").then(module => module.iciciCardRewards[card]);
    case "HDFC":
      return import("../utils/hdfcRewards").then(module => module.hdfcCardRewards[card]);
    case "HSBC":
      return import("../utils/hsbcRewards").then(module => module.hsbcCardRewards[card]);
    case "Axis":
      return import("../utils/axisRewards").then(module => module.axisCardRewards[card]);
    case "IDFCFirst":
      return import("../utils/idfcfirstRewards").then(module => module.idfcFirstCardRewards[card]);
    case "OneCard":
      return import("../utils/onecardRewards").then(module => module.oneCardRewards[card]);
    case "SBI":
      return import("../utils/sbiRewards").then(module => module.sbiCardRewards[card]);
    case "SC":
      return import("../utils/scRewards").then(module => module.scCardRewards[card]);
    default:
      console.error("Unknown bank selected:", bank);
      return Promise.resolve(null);
  }
};

export const validateInputs = (selectedBank, selectedCard, spentAmount) => {
  let errors = {};

  if (!selectedBank) {
    errors.bank = "Please select a bank";
  }

  if (!selectedCard) {
    errors.card = "Please select a card";
  }

  if (!spentAmount || isNaN(parseFloat(spentAmount)) || parseFloat(spentAmount) <= 0) {
    errors.spentAmount = "Please enter a valid spent amount";
  }

  return Object.keys(errors).length === 0 ? null : errors;
};