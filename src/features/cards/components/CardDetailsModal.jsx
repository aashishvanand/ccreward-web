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

const CardDetailsModal = ({ open, onClose, card, onSave }) => {
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
  }, [card, region]);

  const handleSave = () => {
    const updatedCard = {
      ...card,
      network: cardDetails.network,
      billingDate: cardDetails.billingDate,
      limit: cardDetails.limit,
      since: `${selectedMonth}, ${selectedYear}`,
    };

    onSave(updatedCard);
    onClose();
  };

  const generateYearOptions = () => {
    return Array.from({ length: 10 }, (_, i) => currentYear - i);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Card Details</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          {/* Card Network */}
          <Typography variant="h6" gutterBottom>
            Card Network
          </Typography>
          <CardNetworkSelector
            selectedNetwork={cardDetails.network}
            onNetworkChange={(networkName) =>
              setCardDetails((prev) => ({
                ...prev,
                network: networkName,
              }))
            }
          />

          {/* Billing Date */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Billing Date
          </Typography>
          <ToggleButtonGroup
            value={cardDetails.billingDate}
            exclusive
            onChange={(e, newValue) => {
              if (newValue !== null) {
                setCardDetails({ ...cardDetails, billingDate: newValue });
              }
            }}
            fullWidth
            sx={{ flexWrap: "wrap", mb: 2 }}
          >
            {BILLING_DATES.map((date) => (
              <ToggleButton
                key={date}
                value={date}
                sx={{
                  flexBasis: `${100 / 7}%`,
                  borderRadius: 1,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                }}
              >
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
              max={limitConfig[region]?.max || 500000}
              step={1000}
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