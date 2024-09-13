import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Checkbox,
  Box,
  Tooltip,
  IconButton,
  FormGroup,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const DynamicCardInputs = ({
  cardConfig,
  onChange,
  currentInputs,
  selectedMcc,
}) => {
  const dynamicInputs =
    typeof cardConfig.dynamicInputs === "function"
      ? cardConfig.dynamicInputs(currentInputs, onChange, selectedMcc?.mcc)
      : cardConfig.dynamicInputs;

      if (!dynamicInputs || dynamicInputs.length === 0) {
        return null;
      }

  return (
    <>
      {dynamicInputs.map((input, index) => {
        switch (input.type) {
          case "radio":
            return (
              <FormControl
                key={index}
                component="fieldset"
                sx={{ mt: 2, width: "100%" }}
              >
                <Box display="flex" alignItems="center">
                  <FormLabel component="legend">{input.label}</FormLabel>
                  {input.helperText && (
                    <Tooltip title={input.helperText}>
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <RadioGroup
                  aria-label={input.name}
                  name={input.name}
                  value={String(currentInputs[input.name])}
                  onChange={(e) => input.onChange(e.target.value)}
                  row
                >
                  {input.options.map((option, optionIndex) => (
                    <FormControlLabel
                      key={optionIndex}
                      value={String(option.value)}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            );
          case "select":
            return (
              <FormControl key={index} fullWidth sx={{ mt: 2 }}>
                <Box display="flex" alignItems="center">
                  <FormLabel component="legend">{input.label}</FormLabel>
                  {input.helperText && (
                    <Tooltip title={input.helperText}>
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Select
                  value={currentInputs[input.name] || ""}
                  onChange={(e) => input.onChange(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {Array.isArray(input.options)
                    ? input.options.map((option, optionIndex) => (
                        <MenuItem key={optionIndex} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))
                    : typeof input.options === "function"
                    ? input
                        .options(currentInputs)
                        .map((option, optionIndex) => (
                          <MenuItem key={optionIndex} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))
                    : null}
                </Select>
              </FormControl>
            );
          case "checkbox":
            return (
              <FormControl
                key={index}
                component="fieldset"
                sx={{ mt: 2, width: "100%" }}
              >
                <Box display="flex" alignItems="center">
                  <FormLabel component="legend">{input.label}</FormLabel>
                  {input.helperText && (
                    <Tooltip title={input.helperText}>
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <FormGroup>
                  {input.options.map((option, optionIndex) => (
                    <FormControlLabel
                      key={optionIndex}
                      control={
                        <Checkbox
                          checked={currentInputs[input.name]?.includes(
                            option.value
                          )}
                          onChange={(e) => {
                            const selectedValues =
                              currentInputs[input.name] || [];
                            if (e.target.checked) {
                              if (
                                selectedValues.length <
                                (input.maxSelect || Infinity)
                              ) {
                                onChange(input.name, [
                                  ...selectedValues,
                                  option.value,
                                ]);
                              }
                            } else {
                              onChange(
                                input.name,
                                selectedValues.filter((v) => v !== option.value)
                              );
                            }
                          }}
                          disabled={
                            !currentInputs[input.name]?.includes(
                              option.value
                            ) &&
                            currentInputs[input.name]?.length >=
                              (input.maxSelect || Infinity)
                          }
                        />
                      }
                      label={option.label}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default DynamicCardInputs;
