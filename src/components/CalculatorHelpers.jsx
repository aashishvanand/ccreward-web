import { calculateAmexRewards } from "../utils/amexRewards";
import { calculateICICIRewards } from "../utils/iciciRewards";
import { calculateHDFCRewards } from "../utils/hdfcRewards";
import { calculateHSBCRewards } from "../utils/hsbcRewards";
import { calculateAxisRewards } from "../utils/axisRewards";
import { calculateIDFCFirstRewards } from "../utils/idfcfirstRewards";
import { calculateOneCardRewards } from "../utils/onecardRewards";
import { calculateSCRewards } from "../utils/scRewards";
import { calculateSBIRewards } from "../utils/sbiRewards";
import { calculateYESRewards } from "../utils/yesRewards";
import { calculateKotakRewards } from "../utils/kotakRewards";
import { calculateIndusIndRewards } from "../utils/indusindRewards";
import { calculateCanaraRewards } from "@/utils/canaraRewards";
import { calculateRBLRewards } from "@/utils/rblRewards";
import { calculateDBSRewards } from "@/utils/dbsRewards";
import { calculateBOBRewards } from "@/utils/bobRewards";
import { calculateIDBIRewards } from "@/utils/idbiRewards";
import { calculateAURewards } from "@/utils/auRewards";

export const calculateRewards = (
  selectedBank,
  selectedCard,
  selectedMcc,
  spentAmount,
  additionalInputs
) => {
  const amount = parseFloat(spentAmount);
  const mcc = selectedMcc ? selectedMcc.mcc : null;

  let result;

  switch (selectedBank) {
    case "AMEX":
      result = calculateAmexRewards(
        selectedCard,
        amount,
        mcc,
        additionalInputs
      );
      break;
    case "ICICI":
      result = calculateICICIRewards(
        selectedCard,
        amount,
        mcc,
        additionalInputs
      );
      break;
    case "HDFC":
      result = calculateHDFCRewards(
        selectedCard,
        amount,
        mcc,
        additionalInputs
      );
      break;
    case "HSBC":
      result = calculateHSBCRewards(
        selectedCard,
        amount,
        mcc,
        additionalInputs
      );
      break;
    case "Axis":
      result = calculateAxisRewards(
        selectedCard,
        amount,
        mcc,
        additionalInputs
      );
      break;
    case "IDFCFirst":
      result = calculateIDFCFirstRewards(
        selectedCard,
        amount,
        mcc,
        additionalInputs
      );
      break;
    case "OneCard":
      result = calculateOneCardRewards(
        selectedCard,
        amount,
        mcc,
        additionalInputs
      );
      break;
    case "SBI":
      result = calculateSBIRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "SC":
      result = calculateSCRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "YesBank":
      result = calculateYESRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "Kotak":
      result = calculateKotakRewards(
        selectedCard,
        amount,
        mcc,
        additionalInputs
      );
      break;
    case "IndusInd":
      result = calculateIndusIndRewards(
        selectedCard,
        amount,
        mcc,
        additionalInputs
      );
      break;
    case "Canara":
      result = calculateCanaraRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "RBL":
      result = calculateRBLRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "IDBI":
      result = calculateIDBIRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "DBS":
      result = calculateDBSRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "BOB":
      result = calculateBOBRewards(selectedCard, amount, mcc, additionalInputs);
      break;
    case "AU":
      result = calculateAURewards(selectedCard, amount, mcc, additionalInputs);
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
      return import("../utils/amexRewards").then(
        (module) => module.amexCardRewards[card]
      );
    case "ICICI":
      return import("../utils/iciciRewards").then(
        (module) => module.iciciCardRewards[card]
      );
    case "HDFC":
      return import("../utils/hdfcRewards").then(
        (module) => module.hdfcCardRewards[card]
      );
    case "HSBC":
      return import("../utils/hsbcRewards").then(
        (module) => module.hsbcCardRewards[card]
      );
    case "Axis":
      return import("../utils/axisRewards").then(
        (module) => module.axisCardRewards[card]
      );
    case "IDFCFirst":
      return import("../utils/idfcfirstRewards").then(
        (module) => module.idfcFirstCardRewards[card]
      );
    case "OneCard":
      return import("../utils/onecardRewards").then(
        (module) => module.oneCardRewards[card]
      );
    case "SBI":
      return import("../utils/sbiRewards").then(
        (module) => module.sbiCardRewards[card]
      );
    case "SC":
      return import("../utils/scRewards").then(
        (module) => module.scCardRewards[card]
      );
    case "YesBank":
      return import("../utils/yesRewards").then(
        (module) => module.yesCardRewards[card]
      );
    case "Kotak":
      return import("../utils/kotakRewards").then(
        (module) => module.kotakCardRewards[card]
      );
    case "IndusInd":
      return import("../utils/indusindRewards").then(
        (module) => module.indusIndCardRewards[card]
      );
    case "Canara":
      return import("../utils/canaraRewards").then(
        (module) => module.canaraCardRewards[card]
      );
      case "RBL":
    return import("../utils/rblRewards").then(
      (module) => module.rblCardRewards[card]
    );
    case "IDBI":
    return import("../utils/idbiRewards").then(
      (module) => module.idbiCardRewards[card]
    );
    case "DBS":
    return import("../utils/dbsRewards").then(
      (module) => module.dbsCardRewards[card]
    );
    case "BOB":
      return import("../utils/bobRewards").then(
        (module) => module.bobCardRewards[card]
      );
    case "AU":
      return import("../utils/auRewards").then(
        (module) => module.auBankCards[card]
      );
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

  if (
    !spentAmount ||
    isNaN(parseFloat(spentAmount)) ||
    parseFloat(spentAmount) <= 0
  ) {
    errors.spentAmount = "Please enter a valid spent amount";
  }

  return Object.keys(errors).length === 0 ? null : errors;
};
