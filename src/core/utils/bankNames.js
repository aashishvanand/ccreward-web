// Human-readable bank names for UI labels. Data keys are compact codes
// ("idfcfirst", "YesBank", "TrustBank"); keyed here by lowercase code.
const BANK_DISPLAY_NAMES = {
  // India
  amex: "Amex",
  au: "AU",
  axis: "Axis",
  bandhan: "Bandhan",
  bob: "BOB",
  canara: "Canara",
  csb: "CSB",
  cub: "CUB",
  dbs: "DBS",
  dcb: "DCB",
  equitas: "Equitas",
  federal: "Federal",
  hdfc: "HDFC",
  hsbc: "HSBC",
  icici: "ICICI",
  idbi: "IDBI",
  idfcfirst: "IDFC First",
  indusind: "IndusInd",
  iob: "IOB",
  kotak: "Kotak",
  kvb: "KVB",
  onecard: "OneCard",
  pnb: "PNB",
  rbl: "RBL",
  sbi: "SBI",
  sbm: "SBM",
  sc: "Standard Chartered",
  union: "Union Bank",
  unity: "Unity",
  utkarsh: "Utkarsh",
  yesbank: "Yes Bank",
  // Singapore
  boc: "Bank of China",
  cimb: "CIMB",
  citi: "Citi",
  dcs: "DCS",
  gxs: "GXS",
  maribank: "MariBank",
  maybank: "Maybank",
  ocbc: "OCBC",
  posb: "POSB",
  trustbank: "Trust Bank",
  uob: "UOB",
};

/**
 * Display name for a bank code, e.g. "idfcfirst" -> "IDFC First".
 * Unknown codes fall back to the code as given.
 */
export function bankDisplayName(code) {
  if (!code) return "";
  return BANK_DISPLAY_NAMES[String(code).toLowerCase()] || code;
}
