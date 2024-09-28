import React, { useEffect } from "react";
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

const DynamicCardInputs = ({
  cardConfig,
  onChange,
  currentInputs,
  selectedMcc,
}) => {
  const dynamicInputs = cardConfig.dynamicInputs;

  useEffect(() => {
    // Reset mutually exclusive inputs when component mounts or updates
    const mutuallyExclusiveInputs = dynamicInputs.filter(input => input.mutuallyExclusiveWith && input.mutuallyExclusiveWith.length > 0);
    mutuallyExclusiveInputs.forEach(input => {
      if (currentInputs[input.name] === true) {
        input.mutuallyExclusiveWith.forEach(exclusiveName => {
          if (currentInputs[exclusiveName] === true) {
            onChange(exclusiveName, false);
          }
        });
      }
    });
  }, [dynamicInputs, currentInputs, onChange]);

  const handleInputChange = (inputName, value) => {
    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    }

    // Handle mutually exclusive inputs
    const currentInput = dynamicInputs.find(input => input.name === inputName);
    if (currentInput && currentInput.mutuallyExclusiveWith && value === true) {
      currentInput.mutuallyExclusiveWith.forEach(exclusiveName => {
        onChange(exclusiveName, false);
      });
    }

    onChange(inputName, value);
  };

  // Function to check if a question should be displayed based on dependsOn
  const shouldDisplayQuestion = (question) => {
    if (!question.dependsOn) return true;
    const { question: dependentQuestion, value: dependentValue } = question.dependsOn;
    return currentInputs[dependentQuestion] === dependentValue;
  };

  return (
    <>
      {dynamicInputs.map((input, index) => {
        if (input.applicableMCCs && input.applicableMCCs.length > 0 && selectedMcc) {
          if (!input.applicableMCCs.includes(selectedMcc.mcc)) {
            return null;
          }
        }

        // Check if the question should be displayed based on dependsOn
        if (!shouldDisplayQuestion(input)) {
          return null;
        }

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
                  value={String(currentInputs[input.name] ?? "")}
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
                  value={currentInputs[input.name] ?? ""}
                  onChange={(e) =>
                    handleInputChange(input.name, e.target.value)
                  }
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
                          checked={Boolean(
                            currentInputs[input.name]?.[option.value]
                          )}
                          onChange={(e) => {
                            const newValue = {
                              ...currentInputs[input.name],
                              [option.value]: e.target.checked,
                            };
                            handleInputChange(input.name, newValue);
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
      })}
    </>
  );
};

export default DynamicCardInputs;