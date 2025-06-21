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
        { label: "1-50k", min: 1000, max: 50000 },
        { label: "50k-1L", min: 50000, max: 100000 },
        { label: "1L-5L", min: 100000, max: 500000 },
        { label: "5L-10L", min: 500000, max: 1000000 },
      ],
    },
    SG: {
      min: 500,
      max: 50000,
      steps: [
        { label: "500-1k", min: 500, max: 1000 },
        { label: "1k-10k", min: 500, max: 10000 },
        { label: "10k-20k", min: 10000, max: 20000 },
        { label: "20k-30k", min: 20000, max: 30000 },
        { label: "30k-40k", min: 30000, max: 40000 },
        { label: "40k-50k", min: 40000, max: 50000 },
      ],
    },
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
      onDelete(card.bank, card.cardName);
      onClose();
    }
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
            onNetworkChange={(network) =>
              setCardDetails({ ...cardDetails, network })
            }
          />

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

          {/* Credit Limit */}
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Credit Limit
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