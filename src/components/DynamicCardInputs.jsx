import React, { useEffect, useRef } from "react";
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
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import _ from "lodash";

const DynamicCardInputs = ({
  cardConfig,
  onChange,
  currentInputs,
  selectedMcc,
}) => {
  const dynamicInputs = Array.isArray(cardConfig)
    ? cardConfig
    : cardConfig?.questions || [];
  const prevInputsRef = useRef(dynamicInputs);

  useEffect(() => {
    if (!_.isEqual(dynamicInputs, prevInputsRef.current)) {
      Object.keys(currentInputs).forEach((key) => {
        onChange(key, undefined);
      });
      prevInputsRef.current = dynamicInputs;
    }
  }, [dynamicInputs, currentInputs, onChange]);

  const handleInputChange = (inputName, value) => {
    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    }
    onChange(inputName, value);
  };

  const shouldDisplayQuestion = (input) => {
    if (!input.dependsOn) return true;
    const { question: dependentQuestion, value: dependentValue } =
      input.dependsOn;

    if (!(dependentQuestion in currentInputs)) return false;

    const currentValue = currentInputs[dependentQuestion];

    if (typeof dependentValue === "boolean") {
      return currentValue === dependentValue;
    } else {
      return String(currentValue) === String(dependentValue);
    }
  };

  const isInputApplicable = (input) => {
    if (!input.applicableMCCs || input.applicableMCCs.length === 0) {
      return true;
    }
    return selectedMcc && input.applicableMCCs.includes(selectedMcc.mcc);
  };

  const renderInput = (input) => {
    if (!isInputApplicable(input) || !shouldDisplayQuestion(input)) {
      return null;
    }

    switch (input.type) {
      case "radio":
        return (
          <FormControl
            key={input.name}
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
              value={String(currentInputs[input.name] ?? input.value)}
              onChange={(e) =>
                handleInputChange(input.name, e.target.value)
              }
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
          <FormControl key={input.name} fullWidth sx={{ mt: 2 }}>
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
              value={currentInputs[input.name] ?? input.value}
              onChange={(e) =>
                handleInputChange(input.name, e.target.value)
              }
              displayEmpty
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {input.options.map((option, optionIndex) => (
                <MenuItem key={optionIndex} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case "checkbox":
        return (
          <FormControl
            key={input.name}
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
                      checked={Boolean(currentInputs[input.name] === option.value)}
                      onChange={(e) => {
                        handleInputChange(
                          input.name,
                          e.target.checked ? option.value : null
                        );
                      }}
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
  };

  return (
    <>
      {dynamicInputs.map((input) => renderInput(input))}
    </>
  );
};

export default DynamicCardInputs;