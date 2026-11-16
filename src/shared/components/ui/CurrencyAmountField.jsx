"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Typography,
  ListSubheader,
} from "@mui/material";
import { Clear, KeyboardArrowDown } from "@mui/icons-material";
import PropTypes from "prop-types";
import {
  SUPPORTED_CURRENCIES,
  getCurrencySymbol,
  getCurrencyName,
  getNativeCurrency,
} from "@/core/utils/currency";
import { useRegion } from "@/core/providers/RegionContext";

const CurrencyAmountField = ({
  currency,
  onCurrencyChange,
  amount,
  onAmountChange,
  disabled = false,
}) => {
  const { region } = useRegion();
  const nativeCurrency = getNativeCurrency(region);
  // Validation feedback only appears once the user has left the field, never
  // on page load or while they are typing.
  const [touched, setTouched] = useState(false);
  const isInvalid = touched && !disabled && !(Number(amount) >= 1);

  // Native currency first, then the rest alphabetically
  const sortedCurrencies = [
    nativeCurrency,
    ...SUPPORTED_CURRENCIES.filter((c) => c !== nativeCurrency).sort(),
  ];

  return (
    <Box sx={{ display: "flex", gap: 0, alignItems: "flex-start" }}>
      {/* Currency selector — ~20% width */}
      <Select
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        disabled={disabled}
        IconComponent={KeyboardArrowDown}
        renderValue={(val) => (
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, whiteSpace: "nowrap" }}
          >
            {getCurrencySymbol(val)} {val}
          </Typography>
        )}
        sx={{
          minWidth: 110,
          maxWidth: 130,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          "& .MuiOutlinedInput-notchedOutline": {
            borderRight: 0,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderRight: 0,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderRight: 0,
          },
        }}
      >
        <ListSubheader sx={{ lineHeight: "32px" }}>
          Default
        </ListSubheader>
        <MenuItem value={nativeCurrency}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 28 }}>
              {getCurrencySymbol(nativeCurrency)}
            </Typography>
            <Typography variant="body2">
              {nativeCurrency} - {getCurrencyName(nativeCurrency)}
            </Typography>
          </Box>
        </MenuItem>
        <ListSubheader sx={{ lineHeight: "32px" }}>
          Other currencies
        </ListSubheader>
        {sortedCurrencies
          .filter((c) => c !== nativeCurrency)
          .map((code) => (
            <MenuItem key={code} value={code}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, minWidth: 28 }}
                >
                  {getCurrencySymbol(code)}
                </Typography>
                <Typography variant="body2">
                  {code} - {getCurrencyName(code)}
                </Typography>
              </Box>
            </MenuItem>
          ))}
      </Select>

      {/* Amount input — fills remaining ~80% */}
      <TextField
        fullWidth
        label="Spent Amount"
        type="number"
        value={amount}
        onChange={(e) => {
          // Allow an empty field while editing (clamping to 1 made the value
          // impossible to clear with backspace).
          if (e.target.value === "") {
            onAmountChange("");
            return;
          }
          const value = Math.max(1, Number(e.target.value));
          onAmountChange(value.toString());
        }}
        onBlur={() => setTouched(true)}
        required
        disabled={disabled}
        // MUI sets aria-invalid from `error` and only links the helper text via
        // aria-describedby while it is rendered, so screen readers hear the
        // same error, at the same time, as sighted users see it.
        error={isInvalid}
        helperText={isInvalid ? "Error: enter an amount of 1 or more." : undefined}
        slotProps={{
          input: {
            endAdornment: amount && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear spent amount"
                  onClick={() => onAmountChange("")}
                  edge="end"
                  size="small"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
            inputProps: {
              min: 1,
              step: 1,
            },
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
        }}
      />
    </Box>
  );
};

CurrencyAmountField.propTypes = {
  currency: PropTypes.string.isRequired,
  onCurrencyChange: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default CurrencyAmountField;
