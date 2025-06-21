import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import CardNetworkSelector from "./CardNetworkSelector";

const BILLING_DATES = Array.from({ length: 31 }, (_, i) => i + 1);

const CardDetailsModal = ({ open, onClose, card, onSave, onDelete }) => {
  const { region } = useRegion();
  const currentYear = new Date().getFullYear();
  const [cardDetails, setCardDetails] = useState({
    network: region === "IN" ? "Visa" : "Mastercard",
    billingDate: 1,
    limit: region === "IN" ? 100000 : 500,
    since: `${new Date().toLocaleString("default", {
      month: "long",
    })}, ${currentYear}`,
  });

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const limitConfig = {
    IN: {
      min: 1000,
      max: 1000000,
      steps: [
        { label: "1-50k", value: 25000 },
        { label: "50k-1L", value: 75000 },
        { label: "1L-5L", value: 300000 },
        { label: "5L-10L", value: 750000 },
      ],
    },
    SG: {
      min: 500,
      max: 50000,
      steps: [
        { label: "500-1k", value: 750 },
        { label: "1k-10k", value: 5500 },
        { label: "10k-20k", value: 15000 },
        { label: "20k-30k", value: 25000 },
        { label: "30k-40k", value: 35000 },
        { label: "40k-50k", value: 45000 },
      ],
    },
  };

  // Define credit limit options for dropdown
  const getCreditLimitOptions = () => {
    const config = limitConfig[region];
    if (!config) return [];
    
    const options = [];
    const step = region === "IN" ? 50000 : 5000;
    
    for (let i = config.min; i <= config.max; i += step) {
      const label = region === "IN" 
        ? `₹${(i / 1000).toFixed(0)}k`
        : `$${(i / 1000).toFixed(0)}k`;
      options.push({ value: i, label });
    }
    
    return options;
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const generateYearOptions = () => {
    const years = [];
    for (let i = currentYear; i >= currentYear - 30; i--) {
      years.push(i);
    }
    return years;
  };

  useEffect(() => {
    if (card) {
      const { network, billingDate, limit, since } = card;
      if (since) {
        const [month, year] = since.split(", ");
        setSelectedMonth(month);
        setSelectedYear(parseInt(year));
      }

      setCardDetails({
        network: network || (region === "IN" ? "Visa" : "Mastercard"),
        billingDate: billingDate || 1,
        limit: limit || (region === "IN" ? 100000 : 500),
        since: since || `${selectedMonth}, ${selectedYear}`,
      });
    }
  }, [card, region, selectedMonth, selectedYear]);

  useEffect(() => {
    setCardDetails(prev => ({
      ...prev,
      since: `${selectedMonth}, ${selectedYear}`,
    }));
  }, [selectedMonth, selectedYear]);

  const handleSave = () => {
    onSave({ ...cardDetails });
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && card) {
      console.log("Delete button clicked - calling onDelete with:", card.bank, card.cardName);
      onDelete(card.bank, card.cardName);
      onClose();
    } else {
      console.error("Delete failed - missing onDelete handler or card data:", { onDelete: !!onDelete, card });
    }
  };

  const handleNetworkChange = (network) => {
    console.log("Network changed to:", network);
    setCardDetails(prev => ({ ...prev, network }));
  };

  if (!card) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Card Details</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Card Network Selector */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Card Network
          </Typography>
          <CardNetworkSelector
            selectedNetwork={cardDetails.network}
            onNetworkChange={handleNetworkChange}
          />

          {/* Display Selected Network */}
          {cardDetails.network && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                Selected: {cardDetails.network}
              </Typography>
            </Box>
          )}

          {/* Billing Date */}
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Billing Date
          </Typography>
          <ToggleButtonGroup
            value={cardDetails.billingDate}
            exclusive
            onChange={(e, newBillingDate) => {
              if (newBillingDate !== null) {
                setCardDetails({ ...cardDetails, billingDate: newBillingDate });
              }
            }}
            aria-label="billing date"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              "& .MuiToggleButton-root": {
                border: "1px solid",
                borderRadius: 1,
                minWidth: "60px",
                height: "40px",
              },
            }}
          >
            {BILLING_DATES.map((date) => (
              <ToggleButton key={date} value={date} aria-label={`${date}`}>
                {date}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Credit Limit - Using Dropdown instead of Slider */}
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Credit Limit
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="credit-limit-label">Credit Limit</InputLabel>
            <Select
              labelId="credit-limit-label"
              value={cardDetails.limit}
              label="Credit Limit"
              onChange={(e) => setCardDetails({ ...cardDetails, limit: e.target.value })}
            >
              {getCreditLimitOptions().map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Alternative: Keep slider as backup option */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Or use slider for custom amount:
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={cardDetails.limit}
              min={limitConfig[region]?.min || 1000}
              max={limitConfig[region]?.max || 1000000}
              step={region === "IN" ? 1000 : 100}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) =>
                `${region === "IN" ? "₹" : "$"}${value.toLocaleString()}`
              }
              onChange={(e, newValue) =>
                setCardDetails({ ...cardDetails, limit: newValue })
              }
              marks={limitConfig[region]?.steps}
            />
          </Box>

          {/* Card Member Since */}
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Card Member Since
          </Typography>
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
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        {/* Delete button on the left */}
        <Button 
          onClick={handleDelete}
          color="error"
          variant="outlined"
          disabled={!onDelete || !card}
        >
          Delete Card
        </Button>
        
        {/* Cancel and Save buttons on the right */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save Details
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CardDetailsModal;