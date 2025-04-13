import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
} from "@mui/material";
import { useRegion } from "../../../core/providers/RegionContext";

const NETWORK_OPTIONS = {
  IN: ["Visa", "Mastercard", "RuPay", "DinersClub", "AmEx"],
  SG: ["Visa", "Mastercard", "DinersClub", "AmEx", "UnionPay"]
};

const BILLING_DATES = Array.from({length: 31}, (_, i) => i + 1);

const CardDetailsModal = ({ open, onClose, card, onSave }) => {
  const { region } = useRegion();
  const currentYear = new Date().getFullYear();
  const [cardDetails, setCardDetails] = useState({
    network: region === 'IN' ? "Visa" : "Mastercard",
    billingDate: 1,
    limit: region === 'IN' ? 100000 : 500,
    since: `${new Date().toLocaleString('default', { month: 'long' })}, ${currentYear}`,
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const limitConfig = {
    IN: {
      min: 1000,
      max: 500000,
      steps: [
        { label: '1-50k', min: 1000, max: 50000 },
        { label: '50k-2L', min: 50000, max: 200000 },
        { label: '2L-5L', min: 200000, max: 500000 }
      ]
    },
    SG: {
      min: 500,
      max: 50000,
      steps: [
        { label: '500-10k', min: 500, max: 10000 },
        { label: '10k-25k', min: 10000, max: 25000 },
        { label: '25k-50k', min: 25000, max: 50000 }
      ]
    }
  };

  useEffect(() => {
    if (card) {
      const { network, billingDate, limit, since } = card;
      if (since) {
        const [month, year] = since.split(', ');
        setSelectedMonth(month);
        setSelectedYear(parseInt(year));
      }
      
      setCardDetails({
        network: network || (region === 'IN' ? "Visa" : "Mastercard"),
        billingDate: billingDate || 1,
        limit: limit || (region === 'IN' ? 100000 : 500),
        since: since || `${selectedMonth}, ${selectedYear}`
      });
    }
  }, [card, region]);

  const handleSave = () => {
    const updatedCard = {
      ...card,
      network: cardDetails.network,
      billingDate: cardDetails.billingDate,
      limit: cardDetails.limit,
      since: `${selectedMonth}, ${selectedYear}`
    };
    
    onSave(updatedCard);
    onClose();
  };

  const generateYearOptions = () => {
    return Array.from(
      { length: 10 },
      (_, i) => currentYear - i
    );
  };

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
    >
      <DialogTitle>Card Details</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          {/* Card Network */}
          <Typography variant="h6" gutterBottom>Card Network</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            {NETWORK_OPTIONS[region].map((network) => (
              <Box
                key={network}
                onClick={() => setCardDetails({ ...cardDetails, network })}
                sx={{
                  p: 2,
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: cardDetails.network === network ? "primary.main" : "divider",
                  textAlign: "center",
                  cursor: "pointer",
                  width: 80,
                  height: 80,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">{network}</Typography>
              </Box>
            ))}
          </Box>

          {/* Billing Date */}
          <Typography variant="h6" gutterBottom>Billing Date</Typography>
          <ToggleButtonGroup
            value={cardDetails.billingDate}
            exclusive
            onChange={(e, newValue) => {
              if (newValue !== null) {
                setCardDetails({ ...cardDetails, billingDate: newValue });
              }
            }}
            fullWidth
            sx={{ flexWrap: 'wrap', mb: 2 }}
          >
            {BILLING_DATES.map((date) => (
              <ToggleButton 
                key={date} 
                value={date}
                sx={{
                  flexBasis: `${100/7}%`,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                }}
              >
                {date}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Credit Limit */}
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Credit Limit</Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={cardDetails.limit}
              min={limitConfig[region].min}
              max={limitConfig[region].max}
              step={1000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${region === 'IN' ? '₹' : '$'}${value.toLocaleString()}`}
              onChange={(e, newValue) => setCardDetails({ ...cardDetails, limit: newValue })}
              marks={limitConfig[region].steps}
            />
          </Box>

          {/* Card Member Since */}
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Card Member Since</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  label="Month"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {generateYearOptions().map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Details
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardDetailsModal;