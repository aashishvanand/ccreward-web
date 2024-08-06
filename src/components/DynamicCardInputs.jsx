import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from '@mui/material';

const DynamicCardInputs = ({ cardConfig, onChange }) => {
  if (!cardConfig) return null;

  return (
    <>
      {cardConfig.amazonPrimeRate && (
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <FormLabel component="legend">Are you an Amazon Prime member?</FormLabel>
          <RadioGroup
            aria-label="prime-membership"
            name="isPrimeMember"
            onChange={(e) => onChange('isPrimeMember', e.target.value === 'true')}
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      )}
      
      {cardConfig.internationalRate && (
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <FormLabel component="legend">Is this an international transaction?</FormLabel>
          <RadioGroup
            aria-label="international-transaction"
            name="isInternational"
            onChange={(e) => onChange('isInternational', e.target.value === 'true')}
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      )}

      {/* Add more dynamic inputs here based on card configurations */}
    </>
  );
};

export default DynamicCardInputs;