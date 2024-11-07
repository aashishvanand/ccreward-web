const colorPalette = {
  light: {
    primary: {
      main: "#3A86FF",
      light: "#63A1FF",
      dark: "#2D6CCC",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FF006E",
      light: "#FF3D8C",
      dark: "#CC0058",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8F9FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#212529",
      secondary: "#6C757D",
    },
    success: {
      main: "#38B000",
      light: "#5FCC29",
      dark: "#2D8D00",
    },
    error: {
      main: "#FF595E",
      light: "#FF7A7E",
      dark: "#CC474B",
    },
    warning: {
      main: "#FFCA3A",
      light: "#FFD56A",
      dark: "#CCA22E",
    },
    info: {
      main: "#8AC926",
      light: "#A4D454",
      dark: "#6EA11E",
    },
  },
  dark: {
    primary: {
      main: "#4CC9F0",
      light: "#70D4F3",
      dark: "#3CA1C0",
      contrastText: "#000000",
    },
    secondary: {
      main: "#F72585",
      light: "#F85A9F",
      dark: "#C51E6A",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#E0E0E0",
      secondary: "#A0A0A0",
    },
    success: {
      main: "#4CAF50",
      light: "#6FBF73",
      dark: "#3D8C40",
    },
    error: {
      main: "#F44336",
      light: "#F6685E",
      dark: "#C3352B",
    },
    warning: {
      main: "#FFA726",
      light: "#FFB851",
      dark: "#CC851E",
    },
    info: {
      main: "#29B6F6",
      light: "#53C4F7",
      dark: "#2191C5",
    },
  },
  // For bank-specific colors
  banks: {
    HDFC: "#004C8F",
    ICICI: "#B02A30",
    SBI: "#22409A",
    Axis: "#800000",
    AMEX: "#006FCF",
    YESBank: "#00518F",
    SC: "#0072AA",
    Kotak: "#ED1C24",
    IDFCFirst: "#9C1D26",
    HSBC: "#EE3524",
    OneCard: "#000000",
    RBL: "#21317D",
    IndusInd: "#98272A",
    IDBI: "#00836C",
    Federal: "#F7A800",
    BOB: "#F15A29",
    AU: "#ec691f",
  },
};

module.exports = colorPalette;