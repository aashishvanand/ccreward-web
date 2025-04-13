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

const networks = ["Visa", "Mastercard", "Rupay", "Diners Club", "AmEx"];
const billingDates = [1, 5, 10, 15, 18, 20, 25, 28];
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

const CardDetailsModal = ({ open, onClose, card, onSave }) => {
  const [cardDetails, setCardDetails] = useState({
    network: "Visa",
    billingDate: 1,
    limit: 100000,
    since: "January, 2025",
  });

  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (card) {
      setCardDetails({
        network: card.network || "Visa",
        billingDate: card.billingDate || 1,
        limit: card.limit || 100000,
        since: card.since || "January, 2025",
      });

      // Parse existing since value if available
      if (card.since) {
        const [month, year] = card.since.split(", ");
        setSelectedMonth(month || "January");
        setSelectedYear(parseInt(year) || new Date().getFullYear());
      }
    }
  }, [card]);

  const handleNetworkChange = (event) => {
    setCardDetails({
      ...cardDetails,
      network: event.target.value,
    });
  };

  const handleBillingDateChange = (event, newValue) => {
    if (newValue !== null) {
      setCardDetails({
        ...cardDetails,
        billingDate: newValue,
      });
    }
  };

  const handleLimitChange = (event, newValue) => {
    setCardDetails({
      ...cardDetails,
      limit: newValue,
    });
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setCardDetails({
      ...cardDetails,
      since: `${event.target.value}, ${selectedYear}`,
    });
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setCardDetails({
      ...cardDetails,
      since: `${selectedMonth}, ${event.target.value}`,
    });
  };

  const handleSave = () => {
    onSave({
      ...card,
      ...cardDetails,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Card Details</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom>
            Card Network
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            {networks.map((network) => (
              <Box
                key={network}
                onClick={() => setCardDetails({ ...cardDetails, network })}
                sx={{
                  p: 2,
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor:
                    cardDetails.network === network
                      ? "primary.main"
                      : "divider",
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

          <Typography variant="h6" gutterBottom>
            Billing Date
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Monthly Statement Date
          </Typography>
          <ToggleButtonGroup
            value={cardDetails.billingDate}
            exclusive
            onChange={handleBillingDateChange}
            aria-label="billing date"
            fullWidth
            sx={{ mb: 2 }}
          >
            {billingDates.map((date) => (
              <ToggleButton
                key={date}
                value={date}
                sx={{
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
                {date === 1
                  ? "st"
                  : date === 5
                  ? "th"
                  : date === 15
                  ? "th"
                  : "th"}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Next Statement Date:{" "}
            {new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            ).toLocaleDateString("en-US", { month: "short" })}{" "}
            {cardDetails.billingDate}, {new Date().getFullYear()}
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Credit Limit
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select Range: ₹1,00,000 - ₹5,00,000
          </Typography>
          <Slider
            value={cardDetails.limit}
            onChange={handleLimitChange}
            min={100000}
            max={500000}
            step={10000}
            aria-labelledby="credit-limit-slider"
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Current limit: ₹{cardDetails.limit.toLocaleString()}
          </Typography>

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
                  onChange={handleMonthChange}
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
                  onChange={handleYearChange}
                >
                  {Array.from(
                    { length: 10 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
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
