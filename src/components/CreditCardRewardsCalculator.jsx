"use client";
import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Autocomplete,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { mccList } from '../data/mccData';
import { bankData } from '../data/bankData';
import { cardRewards } from '../data/cardRewards';

const CreditCardRewardsCalculator = () => {
  const [mode, setMode] = useState('light');
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedMcc, setSelectedMcc] = useState(null);
  const [spentAmount, setSpentAmount] = useState("");
  const [rewardPoints, setRewardPoints] = useState(0);
  const [filteredCards, setFilteredCards] = useState([]);
  const [calculationPerformed, setCalculationPerformed] = useState(false);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  useEffect(() => {
    if (selectedBank) {
      setFilteredCards(bankData[selectedBank] || []);
    } else {
      setFilteredCards([]);
    }
  }, [selectedBank]);

  const calculateRewards = () => {
    console.log("Calculation started");
    console.log("Selected Card:", selectedCard);
    console.log("Spent Amount:", spentAmount);
    console.log("Selected MCC:", selectedMcc);
  
    if (!selectedCard || !spentAmount) {
      console.log("Missing required fields");
      setCalculationPerformed(false);
      return "Please select a card and enter spent amount";
    }
  
    const cardReward = cardRewards[selectedCard];
    if (!cardReward) {
      console.log("Card reward not found");
      setCalculationPerformed(false);
      return "Card reward structure not found";
    }
  
    console.log("Card Reward Structure:", cardReward);
  
    let rate = cardReward.defaultRate;
    if (selectedMcc && cardReward.mccRates && cardReward.mccRates[selectedMcc.mcc] !== undefined) {
      rate = cardReward.mccRates[selectedMcc.mcc];
    }
    console.log("Applied Rate:", rate);
  
    const amount = parseFloat(spentAmount);
    console.log("Parsed Amount:", amount);
  
    let points = Math.floor(amount * rate);
    let rewardText = "";
  
    switch (selectedCard) {
      case "HDFC Swiggy":
        rewardText = `₹${points} Cashback`;
        break;
      case "Axis Atlas":
        rewardText = rate === 0 ? "No EDGE Points for this transaction" : `${points} EDGE Points`;
        break;
      case "Axis Vistara":
        rewardText = rate === 0 ? "No CV Points for this transaction" : `${points} CV Points`;
        break;
      case "Emeralde Private":
        rewardText = `${points} ICICI Reward Points`;
        break;
      case "Cashback":
        if (rate === 0) {
          rewardText = "No cashback for this transaction";
        } else {
          const cashback = (points / 100).toFixed(2);  // Convert points to rupees
          rewardText = `₹${cashback} Cashback`;
        }
        break;
      default:
        rewardText = `${points} Reward Points`;
    }
  
    console.log("Calculated Points:", points);
    console.log("Reward Text:", rewardText);
  
    setRewardPoints(points);
    setCalculationPerformed(true);
    return rewardText;
  };

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
            <Typography component="h1" variant="h5">
              Credit Card Rewards Calculator
            </Typography>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Select a bank</InputLabel>
            <Select
              value={selectedBank}
              label="Select a bank"
              onChange={(e) => setSelectedBank(e.target.value)}
            >
              {Object.keys(bankData).map((bank) => (
                <MenuItem key={bank} value={bank}>{bank}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select a card</InputLabel>
            <Select
              value={selectedCard}
              label="Select a card"
              onChange={(e) => setSelectedCard(e.target.value)}
            >
              {filteredCards.map((card) => (
                <MenuItem key={card} value={card}>{card}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Autocomplete
            fullWidth
            options={mccList}
            getOptionLabel={(option) => `${option.mcc} - ${option.name}`}
            renderInput={(params) => <TextField {...params} label="Search MCC" margin="normal" />}
            onChange={(event, newValue) => {
              setSelectedMcc(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.mcc === value.mcc}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Enter spent amount (INR)"
            type="number"
            value={spentAmount}
            onChange={(e) => setSpentAmount(e.target.value)}
          />

<Button
  fullWidth
  variant="contained"
  color="primary"
  onClick={() => {
    const result = calculateRewards();
    console.log("Calculation Result:", result);
  }}
  sx={{ mt: 3, mb: 2 }}
>
  Calculate Rewards
</Button>

{calculationPerformed && (
  <Paper elevation={1} sx={{ p: 2, mt: 2, width: '100%', bgcolor: 'success.light' }}>
    <Typography variant="h6" align="center" color="textPrimary">
      {rewardPoints > 0 ? `${rewardPoints} Reward Points` : calculateRewards()}
    </Typography>
  </Paper>
)}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default CreditCardRewardsCalculator;