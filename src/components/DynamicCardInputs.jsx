import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

const DynamicCardInputs = ({ cardConfig, onChange, currentInputs }) => {
  if (!cardConfig) return null;

  return (
    <>
      {cardConfig.amazonPrimeRate && (
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <FormLabel component="legend">Are you an Amazon Prime member?</FormLabel>
          <RadioGroup
            aria-label="prime-membership"
            name="isPrimeMember"
            value={currentInputs.isPrimeMember ? 'true' : 'false'}
            onChange={(e) => onChange('isPrimeMember', e.target.value === 'true')}
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      )}

      {cardConfig.flipkartPlusRate && (
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <FormLabel component="legend">Are you a Flipkart Plus member?</FormLabel>
          <RadioGroup
            aria-label="flipkart-plus-membership"
            name="isFlipkartPlusMember"
            value={currentInputs.isFlipkartPlusMember ? 'true' : 'false'}
            onChange={(e) => onChange('isFlipkartPlusMember', e.target.value === 'true')}
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
            value={currentInputs.isInternational ? 'true' : 'false'}
            onChange={(e) => onChange('isInternational', e.target.value === 'true')}
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      )}

      {cardConfig.birthdayRate && (
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <FormLabel component="legend">Is this a birthday month transaction?</FormLabel>
          <RadioGroup
            aria-label="birthday-transaction"
            name="isBirthday"
            value={currentInputs.isBirthday ? 'true' : 'false'}
            onChange={(e) => onChange('isBirthday', e.target.value === 'true')}
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      )}

      {cardConfig.acceleratedRewards?.travelEdgePortal && (
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <FormLabel component="legend">Is this a Travel Edge Portal transaction?</FormLabel>
          <RadioGroup
            aria-label="travel-edge-portal-transaction"
            name="isTravelEdgePortal"
            value={currentInputs.isTravelEdgePortal ? 'true' : 'false'}
            onChange={(e) => onChange('isTravelEdgePortal', e.target.value === 'true')}
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