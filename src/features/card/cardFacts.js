// Public card facts (fees, lounges, ...) for signed-out card pages, built on the server from
// cardSummary_<region>.json (ccreward-api scripts/generate_card_summary.ts). Reward rates and
// the calculator stay behind sign-in.

const UNLIMITED = 999;

const PERIODS = [
  ["daily", "a day"],
  ["weekly", "a week"],
  ["monthly", "a month"],
  ["quarterly", "a quarter"],
  ["halfYearly", "every 6 months"],
  ["annual", "a year"],
  ["transaction", "per transaction"],
];

function formatMoney(amount, region) {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat(region === "sg" ? "en-SG" : "en-IN", {
    style: "currency",
    currency: region === "sg" ? "SGD" : "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// { quarterly: 2 } -> "2 a quarter"; 999 -> "Unlimited"; { annual: 0 } -> "None"
function formatAccess(access) {
  if (!access) return null;
  const found = PERIODS.find(([key]) => typeof access[key] === "number");
  if (!found) return null;
  const n = access[found[0]];
  if (n === 0) return "None";
  if (n >= UNLIMITED) return "Unlimited";
  return `${n} ${found[1]}`;
}

/**
 * Returns [{ label, value }] for the facts that are known, in display order.
 * summary: one row of cardSummary_<region>.json, or undefined.
 */
export function buildCardFacts(summary, region) {
  if (!summary) return [];
  const facts = [];
  const add = (label, value) => value != null && facts.push({ label, value });

  add("Joining fee", summary.joiningFee != null ? formatMoney(summary.joiningFee, region) : null);
  add("Annual fee", summary.annualFee != null ? formatMoney(summary.annualFee, region) : null);
  add("Domestic airport lounges", formatAccess(summary.lounge?.domestic));
  add("International airport lounges", formatAccess(summary.lounge?.international));
  add("Railway lounges", formatAccess(summary.railwayLounge));
  add("Golf", formatAccess(summary.golf));
  add(
    "Foreign currency markup",
    summary.foreignTransactionFee != null
      ? summary.foreignTransactionFee === 0
        ? "Nil"
        : `${summary.foreignTransactionFee}%`
      : null
  );
  add(
    "Minimum income",
    summary.incomeRequirement ? `${formatMoney(summary.incomeRequirement, region)} a year` : null
  );
  add(
    "Segment",
    summary.marketSegment && summary.marketSegment !== "NA" ? summary.marketSegment : null
  );
  return facts;
}

export function findCardSummary(summaries, bank, cardName) {
  return summaries.find((s) => s.bank === bank && s.cardName === cardName);
}
