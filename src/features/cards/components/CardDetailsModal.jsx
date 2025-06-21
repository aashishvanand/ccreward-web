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
  Grid,
} from "@mui/material";
import { useRegion } from "../../../core/providers/RegionContext";
import CardNetworkSelector from "./CardNetworkSelector";
import { getCurrencySymbol } from "../../../core/utils";

const BILLING_DATES = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const limitConfig = {
    IN: {
      steps: [
        { label: "1k-50k", min: 1000, max: 50000 },
        { label: "50k-1L", min: 50000, max: 100000 },
        { label: "1L-5L", min: 100000, max: 500000 },
        { label: "5L-10L", min: 500000, max: 1000000 },
      ],
    },
    SG: {
      steps: [
        { label: "500-1k", min: 500, max: 1000 },
        { label: "1k-10k", min: 1000, max: 10000 },
        { label: "10k-20k", min: 10000, max: 20000 },
        { label: "20k-30k", min: 20000, max: 30000 },
        { label: "30k-40k", min: 30000, max: 40000 },
        { label: "40k-50k", min: 40000, max: 50000 },
      ],
    },
};

const CardDetailsModal = ({ open, onClose, card, onSave, onDelete }) => {
  const { region } = useRegion();
  const currentYear = new Date().getFullYear();

  const [cardDetails, setCardDetails] = useState(null);
  const [selectedLimitRange, setSelectedLimitRange] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const findRangeForLimit = (limit, currentRegion) => {
    const config = limitConfig[currentRegion] || limitConfig.IN;
    return config.steps.find(range => limit >= range.min && limit <= range.max) || config.steps[0];
  };

  useEffect(() => {
    if (card && open) {
      const { network, billingDate, limit, since } = card;
      let initialMonth = new Date().toLocaleString("default", { month: "long" });
      let initialYear = currentYear;
      if (since && since.includes(", ")) {
        const [month, year] = since.split(", ");
        if (months.includes(month) && !isNaN(parseInt(year))) {
          initialMonth = month;
          initialYear = parseInt(year);
        }
      }
      setSelectedMonth(initialMonth);
      setSelectedYear(initialYear);

      const initialLimit = limit || (region === "IN" ? 100000 : 500);
      const initialRange = findRangeForLimit(initialLimit, region);
      setSelectedLimitRange(initialRange);

      setCardDetails({
        ...card,
        network: network || (region === "IN" ? "Visa" : "Mastercard"),
        billingDate: billingDate || 1,
        limit: initialLimit,
        since: since || `${initialMonth}, ${initialYear}`,
      });
    }
  }, [card, open, region, currentYear]);

  useEffect(() => {
    if (cardDetails) {
      setCardDetails(prev => ({
        ...prev,
        since: `${selectedMonth}, ${selectedYear}`,
      }));
    }
  }, [selectedMonth, selectedYear]);

  if (!open || !card || !cardDetails) return null;

  const generateYearOptions = () => Array.from({ length: 31 }, (_, i) => currentYear - i);

  const handleSave = () => { onSave(cardDetails); onClose(); };
  const handleDelete = () => { if (onDelete && card) { onDelete(card.bank, card.cardName); onClose(); } };
  const handleNetworkChange = (network) => { setCardDetails(prev => ({ ...prev, network })); };

  const handleLimitRangeChange = (event) => {
    const rangeLabel = event.target.value;
    const config = limitConfig[region];
    const newRange = config.steps.find(r => r.label === rangeLabel);
    if (newRange) {
      setSelectedLimitRange(newRange);
      setCardDetails(prev => ({ ...prev, limit: newRange.min }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Card Details</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Card Network</Typography>
          <CardNetworkSelector
            selectedNetwork={cardDetails.network}
            onNetworkChange={handleNetworkChange}
          />

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Billing Date</Typography>
          <FormControl fullWidth>
            <InputLabel>Date</InputLabel>
            <Select
              label="Date"
              value={cardDetails.billingDate}
              onChange={(e) => setCardDetails({ ...cardDetails, billingDate: e.target.value })}
            >
              {BILLING_DATES.map((date) => (<MenuItem key={date} value={date}>{date}</MenuItem>))}
            </Select>
          </FormControl>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Credit Limit ({getCurrencySymbol(region)})</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Range</InputLabel>
            <Select
              value={selectedLimitRange?.label || ""}
              label="Select Range"
              onChange={handleLimitRangeChange}
            >
              {(limitConfig[region]?.steps || []).map((option) => (
                <MenuItem key={option.label} value={option.label}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {selectedLimitRange && (
            <Box sx={{ px: 1 }}>
              <Slider
                value={cardDetails.limit}
                min={selectedLimitRange.min}
                max={selectedLimitRange.max}
                step={region === "IN" ? 1000 : 100}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${getCurrencySymbol(region)}${value.toLocaleString()}`}
                onChange={(e, newValue) => setCardDetails({ ...cardDetails, limit: newValue })}
              />
            </Box>
          )}

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Card Member Since</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select value={selectedMonth} label="Month" onChange={(e) => setSelectedMonth(e.target.value)}>
                  {months.map((month) => (<MenuItem key={month} value={month}>{month}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select value={selectedYear} label="Year" onChange={(e) => setSelectedYear(e.target.value)}>
                  {generateYearOptions().map((year) => (<MenuItem key={year} value={year}>{year}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button onClick={handleDelete} color="error" variant="outlined" disabled={!onDelete || !card}>
          Delete Card
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save Details</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CardDetailsModal;