import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
  Select,
  FormControl,
  InputLabel,
  Slider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CardNetworkSelector from "./CardNetworkSelector";
import { fetchBanks, fetchCards } from "../../../core/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrencySymbol } from "../../../core/utils";
import { useRegion } from "../../../core/providers/RegionContext";

const BILLING_DATES = Array.from({ length: 31 }, (_, i) => i + 1);
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

export default function AddCardDialog({ open, onClose, onAddCard }) {
  const theme = useTheme();

  const { region, isInitialized } = useRegion();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 31 }, (_, i) => currentYear - i); // Years for "Member Since"

  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [selectedLimitRange, setSelectedLimitRange] = useState(null);

  const [newCard, setNewCard] = useState({
    bank: "",
    cardName: "",
    network: "",
    billingDate: 1,
    limit: 100000,
  });

  const findRangeForLimit = (limit, currentRegion) => {
    const config = limitConfig[currentRegion] || limitConfig.IN;
    return (
      config.steps.find((range) => limit >= range.min && limit <= range.max) ||
      config.steps[0]
    );
  };

  useEffect(() => {
    if (open && isInitialized && region) {
      const initialLimit = region === "SG" ? 10000 : 100000;

      setNewCard({
        bank: "",
        cardName: "",
        network: "",
        billingDate: 1,
        limit: initialLimit,
      });

      setSelectedMonth(new Date().toLocaleString("default", { month: "long" }));
      setSelectedYear(currentYear);
      setExpanded(false);
      setCards([]);

      const initialRange = findRangeForLimit(initialLimit, region);
      setSelectedLimitRange(initialRange);

      fetchBankList();
    }
  }, [open, isInitialized, region, currentYear]);

  const handleLimitRangeChange = (event) => {
    if (!region) return;

    const rangeLabel = event.target.value;
    const config = limitConfig[region] || limitConfig.IN;
    const newRange = config.steps.find((r) => r.label === rangeLabel);
    if (newRange) {
      setSelectedLimitRange(newRange);
      setNewCard((prev) => ({ ...prev, limit: newRange.min }));
    }
  };

  const fetchBankList = async () => {
    if (!isInitialized) return;

    setIsLoading(true);
    try {
      const bankList = await fetchBanks();
      setBanks(bankList);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCardList = async (bank) => {
    if (!isInitialized) return;

    setIsLoading(true);
    try {
      const cardList = await fetchCards(bank);
      setCards(cardList);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankChange = (e) => {
    const selectedBank = e.target.value;
    setNewCard({ ...newCard, bank: selectedBank, cardName: "" });
    if (selectedBank) {
      fetchCardList(selectedBank);
    } else {
      setCards([]);
    }
  };

  const handleCardChange = (e) => {
    setNewCard((prev) => ({ ...prev, cardName: e.target.value }));
  };

  const handleNetworkChange = (network) => {
    setNewCard((prev) => ({ ...prev, network }));
  };

  const handleError = (error) => {
    console.error("Error:", error);
    setSnackbar({
      open: true,
      message: error.message?.includes("too many requests")
        ? error.message
        : "An error occurred. Please try again.",
      severity: error.message?.includes("too many requests")
        ? "warning"
        : "error",
    });
  };

  const handleSubmit = () => {
    if (!region) {
      handleError(new Error("Region not initialized"));
      return;
    }

    if (!newCard.bank || !newCard.cardName) {
      handleError(new Error("Please fill in the Bank and Card Name fields."));
      return;
    }

    onAddCard({
      ...newCard,
      region,
      since: `${selectedMonth}, ${selectedYear}`,
    });

    onClose();
  };

  if (open && !isInitialized) {
    return (
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading region settings...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (open && !region) {
    return (
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="error">Please select a region first</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const config = limitConfig[region] || limitConfig.IN;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="h2">
          Add Credit Card
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Bank Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Bank *</InputLabel>
            <Select
              value={newCard.bank}
              onChange={handleBankChange}
              label="Bank *"
              disabled={isLoading}
            >
              {banks.map((bank) => (
                <MenuItem key={bank} value={bank}>
                  {bank}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Card Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Card Name *</InputLabel>
            <Select
              value={newCard.cardName}
              onChange={handleCardChange}
              label="Card Name *"
              disabled={!newCard.bank || isLoading}
            >
              {cards.map((card) => (
                <MenuItem key={card} value={card}>
                  {card}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Network Selection (Optional) */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Card Network (Optional)
            </Typography>
            <CardNetworkSelector
              selectedNetwork={newCard.network}
              onNetworkChange={handleNetworkChange}
            />
          </Box>

          {/* Credit Limit (Optional) */}
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Credit Limit Range (Optional)</InputLabel>
              <Select
                value={selectedLimitRange?.label || ""}
                onChange={handleLimitRangeChange}
                label="Credit Limit Range (Optional)"
              >
                {config.steps.map((range) => (
                  <MenuItem key={range.label} value={range.label}>
                    {getCurrencySymbol(region)}
                    {range.min.toLocaleString()} - {getCurrencySymbol(region)}
                    {range.max.toLocaleString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedLimitRange && (
              <Box sx={{ px: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Credit Limit: {getCurrencySymbol(region)}
                  {newCard.limit?.toLocaleString()}
                </Typography>
                <Slider
                  value={newCard.limit}
                  onChange={(e, value) =>
                    setNewCard((prev) => ({ ...prev, limit: value }))
                  }
                  min={selectedLimitRange.min}
                  max={selectedLimitRange.max}
                  step={selectedLimitRange.min >= 1000 ? 1000 : 100}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) =>
                    `${getCurrencySymbol(region)}${value.toLocaleString()}`
                  }
                />
              </Box>
            )}
          </Box>

          {/* Billing Date (Optional) */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Billing Date (Optional)</InputLabel>
            <Select
              value={newCard.billingDate}
              onChange={(e) =>
                setNewCard((prev) => ({ ...prev, billingDate: e.target.value }))
              }
              label="Billing Date (Optional)"
            >
              {BILLING_DATES.map((date) => (
                <MenuItem key={date} value={date}>
                  {date}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Card Member Since (Optional) */}
          <Accordion
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Card Member Since (Optional)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Month</InputLabel>
                    <Select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      label="Month"
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
                      onChange={(e) => setSelectedYear(e.target.value)}
                      label="Year"
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!newCard.bank || !newCard.cardName || isLoading}
        >
          {isLoading ? <CircularProgress size={20} /> : "Add Card"}
        </Button>
      </DialogActions>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
