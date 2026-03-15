import { TextField, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import {
  SUPPORTED_CURRENCIES,
  getCurrencySymbol,
  getCurrencyName,
  getNativeCurrency,
} from "@/core/utils/currency";
import { useRegion } from "@/core/providers/RegionContext";

const CurrencyPicker = ({ value, onChange, disabled = false }) => {
  const { region } = useRegion();
  const nativeCurrency = getNativeCurrency(region);

  // Put native currency first, then the rest alphabetically (excluding native)
  const sortedCurrencies = [
    nativeCurrency,
    ...SUPPORTED_CURRENCIES.filter((c) => c !== nativeCurrency).sort(),
  ];

  return (
    <TextField
      select
      fullWidth
      label="Currency"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {sortedCurrencies.map((code) => (
        <MenuItem key={code} value={code}>
          {getCurrencySymbol(code)} {code} - {getCurrencyName(code)}
          {code === nativeCurrency ? " (Default)" : ""}
        </MenuItem>
      ))}
    </TextField>
  );
};

CurrencyPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default CurrencyPicker;
