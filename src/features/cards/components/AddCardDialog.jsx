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

const BILLING_DATES = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December",
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
  const [region, setRegion] = useState("IN");
  const currentYear = new Date().getFullYear();

  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString("default", { month: "long" }));
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  
  const [newCard, setNewCard] = useState({
    bank: "", cardName: "", network: "", billingDate: 1,
    limit: region === "SG" ? 10000 : 100000,
  });
  const [selectedLimitRange, setSelectedLimitRange] = useState(null);
  
  const findRangeForLimit = (limit, currentRegion) => {
    const config = limitConfig[currentRegion] || limitConfig.default;
    return config.steps.find(range => limit >= range.min && limit <= range.max) || config.steps[0];
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRegion = localStorage.getItem("app-region");
      if (storedRegion) setRegion(storedRegion.toUpperCase());
    }
  }, []);

  useEffect(() => {
    if (open) {
      const currentRegion = (typeof window !== "undefined" && localStorage.getItem("app-region")?.toUpperCase()) || "IN";
      const initialLimit = currentRegion === "SG" ? 10000 : 100000;
      
      setRegion(currentRegion);
      setNewCard({
          bank: "", cardName: "", network: "", billingDate: 1,
          limit: initialLimit,
      });
      setSelectedMonth(new Date().toLocaleString("default", { month: "long" }));
      setSelectedYear(currentYear);
      setExpanded(false);
      setCards([]);

      const initialRange = findRangeForLimit(initialLimit, currentRegion);
      setSelectedLimitRange(initialRange);
      
      fetchBankList();
    }
  }, [open]);

  const handleLimitRangeChange = (event) => {
    const rangeLabel = event.target.value;
    const config = limitConfig[region] || limitConfig.default;
    const newRange = config.steps.find(r => r.label === rangeLabel);
    if (newRange) {
      setSelectedLimitRange(newRange);
      setNewCard(prev => ({ ...prev, limit: newRange.min }));
    }
  };
  
  const fetchBankList = async () => { setIsLoading(true); try { const bankList = await fetchBanks(); setBanks(bankList); } catch (error) { handleError(error); } finally { setIsLoading(false); } };
  const fetchCardList = async (bank) => { setIsLoading(true); try { const cardList = await fetchCards(bank); setCards(cardList); } catch (error) { handleError(error); } finally { setIsLoading(false); } };
  const handleBankChange = (e) => { const selectedBank = e.target.value; setNewCard({ ...newCard, bank: selectedBank, cardName: "" }); if (selectedBank) { fetchCardList(selectedBank); } else { setCards([]); } };
  const handleCardChange = (e) => { setNewCard((prev) => ({ ...prev, cardName: e.target.value })); };
  const handleError = (error) => { console.error("Error:", error); setSnackbar({ open: true, message: error.message?.includes("too many requests") ? error.message : "An error occurred. Please try again.", severity: error.message?.includes("too many requests") ? "warning" : "error", }); };
  const handleAddCard = () => { const cardWithDetails = { ...newCard, country: region.toLowerCase(), since: `${selectedMonth}, ${selectedYear}` }; onAddCard(cardWithDetails); onClose(); };
  const generateYearOptions = () => Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <>
      <AnimatePresence mode="wait">
        {open && (
          <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 2, boxShadow: theme.shadows[10], overflow: "hidden" } }}>
            <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}`, pb: 2, display: "flex", alignItems: "center", backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 500 }}>Add New Card</Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {isLoading ? <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}><CircularProgress /></Box> :
                <>
                  <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel>Bank</InputLabel>
                    <Select value={newCard.bank} onChange={handleBankChange} label="Bank">
                      <MenuItem value=""><em>Select a bank</em></MenuItem>
                      {banks.map((bank) => (<MenuItem key={bank} value={bank}>{bank}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal" variant="outlined" disabled={!newCard.bank || isLoading}>
                    <InputLabel>Card Name</InputLabel>
                    <Select value={newCard.cardName} onChange={handleCardChange} label="Card Name">
                      <MenuItem value=""><em>Select a card</em></MenuItem>
                      {cards.map((card) => (<MenuItem key={card} value={card}>{card}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <Paper elevation={0} sx={{ mt: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)" }}>
                    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} elevation={0} disableGutters sx={{ boxShadow: "none", "&:before": { display: "none" }, borderRadius: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="subtitle1" fontWeight="medium">Additional Card Details (Optional)</Typography></AccordionSummary>
                      <AccordionDetails sx={{ px: 3, pb: 3, pt: 1 }}>
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: "text.primary", mb: 2 }}>Card Network</Typography>
                          <CardNetworkSelector selectedNetwork={newCard.network} onNetworkChange={(networkName) => setNewCard((prev) => ({ ...prev, network: networkName }))} region={region} />
                        </Box>
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: "text.primary" }}>Billing Date</Typography>
                          <FormControl fullWidth><InputLabel>Billing Date</InputLabel><Select value={newCard.billingDate || ""} onChange={(e) => setNewCard((prev) => ({ ...prev, billingDate: e.target.value }))} label="Billing Date">{BILLING_DATES.map((date) => (<MenuItem key={date} value={date}>{date}</MenuItem>))}</Select></FormControl>
                        </Box>
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'text.primary' }}>Credit Limit ({getCurrencySymbol(region)})</Typography>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Select Range</InputLabel>
                            <Select value={selectedLimitRange?.label || ""} label="Select Range" onChange={handleLimitRangeChange}>
                              {(limitConfig[region]?.steps || limitConfig.default.steps).map((option) => (<MenuItem key={option.label} value={option.label}>{option.label}</MenuItem>))}
                            </Select>
                          </FormControl>
                          {selectedLimitRange && (
                            <Box sx={{ px: 1, mb: 2 }}>
                              <Slider value={newCard.limit} min={selectedLimitRange.min} max={selectedLimitRange.max} step={region === "IN" ? 1000 : 100} valueLabelDisplay="auto" valueLabelFormat={(value) => `${getCurrencySymbol(region)}${value.toLocaleString()}`} onChange={(e, newValue) => setNewCard(prev => ({ ...prev, limit: newValue }))} />
                            </Box>
                          )}
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "right" }}>{getCurrencySymbol(region)}{newCard.limit?.toLocaleString() || "0"}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: "text.primary" }}>Card Member Since</Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}><FormControl fullWidth><InputLabel>Month</InputLabel><Select value={selectedMonth} label="Month" onChange={(e) => setSelectedMonth(e.target.value)}>{months.map((month) => (<MenuItem key={month} value={month}>{month}</MenuItem>))}</Select></FormControl></Grid>
                            <Grid item xs={6}><FormControl fullWidth><InputLabel>Year</InputLabel><Select value={selectedYear} label="Year" onChange={(e) => setSelectedYear(e.target.value)}>{generateYearOptions().map((year) => (<MenuItem key={year} value={year}>{year}</MenuItem>))}</Select></FormControl></Grid>
                          </Grid>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Paper>
                </>
              }
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}`, gap: 1 }}>
              <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, textTransform: "none", fontWeight: 500 }}>Cancel</Button>
              <Button onClick={handleAddCard} color="primary" variant="contained" disabled={!newCard.bank || !newCard.cardName || isLoading} sx={{ borderRadius: 2, px: 3, boxShadow: theme.shadows[3], textTransform: "none", fontWeight: 500 }}>Add Card</Button>
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}><Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>{snackbar.message}</Alert></Snackbar>
    </>
  );
}