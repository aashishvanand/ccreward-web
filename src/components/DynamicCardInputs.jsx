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
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const DynamicCardInputs = ({
  cardConfig,
  onChange,
  currentInputs,
  selectedMcc,
}) => {
  const dynamicInputs = cardConfig.dynamicInputs;
  const prevInputsRef = useRef(dynamicInputs);

  useEffect(() => {
    if (dynamicInputs !== prevInputsRef.current) {
      Object.keys(currentInputs).forEach((key) => {
        onChange(key, undefined);
      });
      prevInputsRef.current = dynamicInputs;
    }
  }, [dynamicInputs, currentInputs, onChange]);

  useEffect(() => {
    const mutuallyExclusiveInputs = dynamicInputs.filter(
      (input) =>
        input.mutuallyExclusiveWith && input.mutuallyExclusiveWith.length > 0
    );
    mutuallyExclusiveInputs.forEach((input) => {
      if (currentInputs[input.name] === true) {
        input.mutuallyExclusiveWith.forEach((exclusiveName) => {
          if (currentInputs[exclusiveName] === true) {
            onChange(exclusiveName, false);
          }
        });
      }
    });
  }, [dynamicInputs, currentInputs, onChange]);

  const handleInputChange = (inputName, value, maxSelect = null) => {
    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    }

    const currentInput = dynamicInputs.find(
      (input) => input.name === inputName
    );
    if (currentInput && currentInput.mutuallyExclusiveWith && value === true) {
      currentInput.mutuallyExclusiveWith.forEach((exclusiveName) => {
        onChange(exclusiveName, false);
      });
    }

    if (maxSelect !== null && typeof value === "object") {
      const newSelectedCount = Object.values(value).filter(Boolean).length;
      const currentSelectedCount = Object.values(
        currentInputs[inputName] || {}
      ).filter(Boolean).length;

      if (
        newSelectedCount > currentSelectedCount &&
        newSelectedCount > maxSelect
      ) {
        return; // Don't allow more selections than maxSelect
      }
    }

    onChange(inputName, value);
  };

  const shouldDisplayQuestion = (input) => {
    if (!input.dependsOn) return true;
    const { question: dependentQuestion, value: dependentValue } =
      input.dependsOn;

    if (!(dependentQuestion in currentInputs)) return false;

    const currentValue = currentInputs[dependentQuestion];

    // Handle both boolean and string comparisons
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

  return (
    <>
      {dynamicInputs.map((input) => {
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
                          checked={Boolean(
                            currentInputs[input.name]?.[option.value]
                          )}
                          onChange={(e) => {
                            const newValue = {
                              ...currentInputs[input.name],
                              [option.value]: e.target.checked,
                            };
                            handleInputChange(
                              input.name,
                              newValue,
                              input.maxSelect
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
      })}
    </>
  );
};

export default DynamicCardInputs;
