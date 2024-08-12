import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

const DynamicCardInputs = ({ cardConfig, onChange, currentInputs, selectedMcc }) => {
  if (!cardConfig) return null;

  const handleTransactionTypeChange = (value) => {
    onChange('isLICPremium', value === 'premium');
    onChange('isSamsungTransaction', value === 'samsung');
    onChange('isInternational', value === 'international');
  };

  const isSpecialCard = cardConfig.licPremiumRate || cardConfig.samsungRate;
  const isShoppersStopTransaction = selectedMcc && selectedMcc.name.toLowerCase().includes('shoppers stop');
  const isFlipkartTransaction = selectedMcc && selectedMcc.name.toLowerCase().includes('flipkart');
  const isAmazonTransaction = selectedMcc && selectedMcc.name.toLowerCase().includes('amazon');

  return (
    <>
      {cardConfig.amazonPrimeRate && isAmazonTransaction && (
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

      {cardConfig.flipkartPlusRate && isFlipkartTransaction && (
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

      {cardConfig.spicejetRate && (
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <FormLabel component="legend">Is this a SpiceJet transaction?</FormLabel>
          <RadioGroup
            aria-label="spicejet-transaction"
            name="isSpiceJet"
            value={currentInputs.isSpiceJet ? 'true' : 'false'}
            onChange={(e) => onChange('isSpiceJet', e.target.value === 'true')}
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      )}

      {cardConfig.airtelRate && (
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <FormLabel component="legend">Is this an Airtel Thanks App transaction?</FormLabel>
          <RadioGroup
            aria-label="airtel-app-transaction"
            name="isAirtelApp"
            value={currentInputs.isAirtelApp ? 'true' : 'false'}
            onChange={(e) => onChange('isAirtelApp', e.target.value === 'true')}
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      )}

      {cardConfig.shoppersStopExclusiveBrands && isShoppersStopTransaction && (
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <FormLabel component="legend">Is this a Shoppers Stop Exclusive Brand purchase?</FormLabel>
          <RadioGroup
            aria-label="shoppers-stop-exclusive"
            name="isShoppersStopExclusive"
            value={currentInputs.isShoppersStopExclusive ? 'true' : 'false'}
            onChange={(e) => onChange('isShoppersStopExclusive', e.target.value === 'true')}
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      )}

      {cardConfig.freechargeRate && (
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <FormLabel component="legend">Is this a Freecharge transaction?</FormLabel>
          <RadioGroup
            aria-label="freecharge-transaction"
            name="isFreechargeTransaction"
            value={currentInputs.isFreechargeTransaction ? 'true' : 'false'}
            onChange={(e) => onChange('isFreechargeTransaction', e.target.value === 'true')}
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      )}

      {cardConfig.internationalRate && (
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <FormLabel component="legend">
            {isSpecialCard ? "Transaction Type" : "Is this an international transaction?"}
          </FormLabel>
          <RadioGroup
            aria-label="transaction-type"
            name="transactionType"
            value={
              currentInputs.isLICPremium ? 'premium' :
              currentInputs.isSamsungTransaction ? 'samsung' :
              currentInputs.isInternational ? 'international' : 'other'
            }
            onChange={(e) => handleTransactionTypeChange(e.target.value)}
            row={!isSpecialCard}
          >
            {cardConfig.licPremiumRate && <FormControlLabel value="premium" control={<Radio />} label="LIC Premium Payment" />}
            {cardConfig.samsungRate && <FormControlLabel value="samsung" control={<Radio />} label="Samsung Purchase" />}
            <FormControlLabel value="international" control={<Radio />} label={isSpecialCard ? "International Transaction" : "Yes"} />
            <FormControlLabel value="other" control={<Radio />} label={isSpecialCard ? "Other Transaction" : "No"} />
          </RadioGroup>
        </FormControl>
      )}

      {cardConfig.oneCard && (
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <FormLabel component="legend">Is this a top category spend?</FormLabel>
          <RadioGroup
            aria-label="top-category-spend"
            name="isTopCategorySpend"
            value={currentInputs.isTopCategorySpend ? 'true' : 'false'}
            onChange={(e) => onChange('isTopCategorySpend', e.target.value === 'true')}
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      )}



    </>
  );
};

export default DynamicCardInputs;