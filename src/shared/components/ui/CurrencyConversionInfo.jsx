import { Paper, Typography, Box, Chip } from "@mui/material";
import {
  CurrencyExchange as CurrencyExchangeIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { getCurrencySymbol } from "@/core/utils/currency";
import PropTypes from "prop-types";

const CurrencyConversionInfo = ({ currencyConversion }) => {
  if (!currencyConversion) return null;

  const {
    inputCurrency,
    inputAmount,
    nativeCurrency,
    nativeAmount,
    exchangeRate,
    rateDate,
    disclaimer,
  } = currencyConversion;

  const inputSymbol = getCurrencySymbol(inputCurrency);
  const nativeSymbol = getCurrencySymbol(nativeCurrency);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        mt: 1,
        borderColor: "info.main",
        borderStyle: "dashed",
        bgcolor: "action.hover",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <CurrencyExchangeIcon fontSize="small" color="info" />
        <Typography variant="subtitle2" color="info.main">
          Currency Conversion
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          flexWrap: "wrap",
          mb: 1,
        }}
      >
        <Chip
          label={`${inputSymbol}${inputAmount.toLocaleString()} ${inputCurrency}`}
          variant="outlined"
          size="small"
        />
        <Typography variant="body2" color="text.secondary">
          =
        </Typography>
        <Chip
          label={`${nativeSymbol}${nativeAmount.toLocaleString()} ${nativeCurrency}`}
          color="primary"
          size="small"
        />
      </Box>

      <Typography variant="caption" color="text.secondary" display="block">
        Rate: 1 {inputCurrency} = {nativeSymbol}
        {exchangeRate} {nativeCurrency} (as of {rateDate})
      </Typography>

      {disclaimer && (
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, mt: 1 }}>
          <InfoIcon
            sx={{ fontSize: 14, mt: 0.3, color: "text.disabled" }}
          />
          <Typography variant="caption" color="text.disabled">
            {disclaimer}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

CurrencyConversionInfo.propTypes = {
  currencyConversion: PropTypes.shape({
    inputCurrency: PropTypes.string.isRequired,
    inputAmount: PropTypes.number.isRequired,
    nativeCurrency: PropTypes.string.isRequired,
    nativeAmount: PropTypes.number.isRequired,
    exchangeRate: PropTypes.number.isRequired,
    rateDate: PropTypes.string.isRequired,
    rateProvider: PropTypes.string,
    disclaimer: PropTypes.string,
  }),
};

export default CurrencyConversionInfo;
