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

// Animation variants
const dialogVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
};

const inputVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: 0.3,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.98 },
};

const accordionVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      delay: 0.2,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// Default limit config for all regions
const limitConfig = {
  IN: {
    min: 1000,
    max: 500000,
    steps: [
      { value: 50000, label: "₹50K" },
      { value: 200000, label: "₹2L" },
      { value: 500000, label: "₹5L" },
    ],
  },
  SG: {
    min: 250,
    max: 50000,
    steps: [
      { value: 10000, label: "$10K" },
      { value: 25000, label: "$25K" },
      { value: 50000, label: "$50K" },
    ],
  },
  // Default fallback config
  default: {
    min: 1000,
    max: 100000,
    steps: [
      { value: 10000, label: "10K" },
      { value: 50000, label: "50K" },
      { value: 100000, label: "100K" },
    ],
  },
};

export default function AddCardDialog({ open, onClose, onAddCard }) {
  const theme = useTheme();
  // Get region from localStorage directly if needed or fallback to 'IN'
  const [region, setRegion] = useState(() => {
    // Check if we're on the client side before accessing localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("app-region") || "IN";
    }
    return "IN"; // Default fallback
  });

  const currentYear = new Date().getFullYear();

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

  const [newCard, setNewCard] = useState({
    bank: "",
    cardName: "",
    network: "",
    billingDate: 1,
    limit: region === "SG" ? 10000 : 100000,
  });

  // Safe access to limit config based on region
  const getLimitConfig = () => {
    return limitConfig[region] || limitConfig.default;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRegion = localStorage.getItem("app-region");
      if (storedRegion) {
        setRegion(storedRegion.toUpperCase());
      }
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchBankList();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      // Reset to initial state when dialog opens
      setNewCard({
        bank: "",
        cardName: "",
        network: "",
        billingDate: 1,
        limit: region === "SG" ? 10000 : 100000,
      });
      setSelectedMonth(new Date().toLocaleString("default", { month: "long" }));
      setSelectedYear(new Date().getFullYear());
      setExpanded(false);
      setCards([]);
    }
  }, [open, region]);

  const fetchBankList = async () => {
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
    setNewCard({
      ...newCard,
      bank: selectedBank,
      cardName: "",
    });

    if (selectedBank) {
      fetchCardList(selectedBank);
    } else {
      setCards([]);
    }
  };

  const handleCardChange = (e) => {
    setNewCard((prev) => ({
      ...prev,
      cardName: e.target.value,
    }));
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

  const handleAddCard = () => {
    const cardWithDetails = {
      ...newCard,
      country: region.toLowerCase(),
      since: `${selectedMonth}, ${selectedYear}`,
    };

    onAddCard(cardWithDetails);
    onClose();
  };

  const generateYearOptions = () => {
    return Array.from({ length: 10 }, (_, i) => currentYear - i);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {open && (
          <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: theme.shadows[10],
                overflow: "hidden",
              },
              component: motion.div,
              variants: dialogVariants,
              initial: "hidden",
              animate: "visible",
              exit: "exit",
            }}
          >
            <DialogTitle
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 2,
                display: "flex",
                alignItems: "center",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                  },
                }}
              >
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontWeight: 500 }}
                >
                  Add New Card
                </Typography>
              </motion.div>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                  <motion.div
                    animate={{
                      rotate: 360,
                      transition: {
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      },
                    }}
                  >
                    <CircularProgress />
                  </motion.div>
                </Box>
              ) : (
                <>
                  <motion.div variants={inputVariants}>
                    <FormControl fullWidth margin="normal" variant="outlined">
                      <InputLabel id="bank-select-label">Bank</InputLabel>
                      <Select
                        labelId="bank-select-label"
                        id="bank-select"
                        value={newCard.bank}
                        onChange={handleBankChange}
                        label="Bank"
                      >
                        <MenuItem value="">
                          <em>Select a bank</em>
                        </MenuItem>
                        {banks.map((bank, index) => (
                          <MenuItem key={bank} value={bank}>
                            {bank}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </motion.div>

                  <motion.div variants={inputVariants} custom={1}>
                    <FormControl
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      disabled={!newCard.bank || isLoading}
                    >
                      <InputLabel id="card-select-label">Card Name</InputLabel>
                      <Select
                        labelId="card-select-label"
                        id="card-select"
                        value={newCard.cardName}
                        onChange={handleCardChange}
                        label="Card Name"
                      >
                        <MenuItem value="">
                          <em>Select a card</em>
                        </MenuItem>
                        {cards.map((card) => (
                          <MenuItem key={card} value={card}>
                            {card}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </motion.div>

                  <Paper
                    elevation={0}
                    sx={{
                      mt: 3,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <Accordion
                      expanded={expanded}
                      onChange={() => setExpanded(!expanded)}
                      elevation={0}
                      disableGutters
                      sx={{
                        boxShadow: "none",
                        "&:before": {
                          display: "none",
                        },
                        borderRadius: 2,
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="additional-details-content"
                        id="additional-details-header"
                        sx={{ px: 2, py: 1 }}
                      >
                        <Typography variant="subtitle1" fontWeight="medium">
                          Additional Card Details (Optional)
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails sx={{ px: 3, pb: 3, pt: 1 }}>
                        <Box sx={{ mb: 4 }}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{
                              fontWeight: 500,
                              color: "text.primary",
                              mb: 2,
                            }}
                          >
                            Card Network
                          </Typography>
                          <CardNetworkSelector
                            selectedNetwork={newCard.network}
                            onNetworkChange={(networkName) =>
                              setNewCard((prev) => ({
                                ...prev,
                                network: networkName,
                              }))
                            }
                            region={region}
                          />
                        </Box>

                        <Box sx={{ mb: 4 }}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{ fontWeight: 500, color: "text.primary" }}
                          >
                            Billing Date
                          </Typography>
                          <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel id="billing-date-label">
                              Billing Date
                            </InputLabel>
                            <Select
                              labelId="billing-date-label"
                              value={newCard.billingDate || ""}
                              onChange={(e) =>
                                setNewCard((prev) => ({
                                  ...prev,
                                  billingDate: e.target.value,
                                }))
                              }
                              label="Billing Date"
                            >
                              {BILLING_DATES.map((date) => (
                                <MenuItem key={date} value={date}>
                                  {date}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{ fontWeight: 500, color: "text.primary" }}
                          >
                            Credit Limit ({getCurrencySymbol()})
                          </Typography>
                          <Box sx={{ px: 1, mb: 2 }}>
                            <Slider
                              value={newCard.limit ?? getLimitConfig().min}
                              min={getLimitConfig().min}
                              max={getLimitConfig().max}
                              step={1000}
                              valueLabelDisplay="auto"
                              valueLabelFormat={(value) =>
                                `${getCurrencySymbol()}${value.toLocaleString()}`
                              }
                              marks={getLimitConfig().steps}
                              onChange={(e, newValue) =>
                                setNewCard((prev) => ({
                                  ...prev,
                                  limit: newValue,
                                }))
                              }
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1, textAlign: "right" }}
                          >
                            {getCurrencySymbol()}
                            {newCard.limit?.toLocaleString() || "0"}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{ fontWeight: 500, color: "text.primary" }}
                          >
                            Card Member Since
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <FormControl fullWidth>
                                <InputLabel id="month-select-label">
                                  Month
                                </InputLabel>
                                <Select
                                  labelId="month-select-label"
                                  value={selectedMonth}
                                  label="Month"
                                  onChange={(e) =>
                                    setSelectedMonth(e.target.value)
                                  }
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
                                <InputLabel id="year-select-label">
                                  Year
                                </InputLabel>
                                <Select
                                  labelId="year-select-label"
                                  value={selectedYear}
                                  label="Year"
                                  onChange={(e) =>
                                    setSelectedYear(e.target.value)
                                  }
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
                      </AccordionDetails>
                    </Accordion>
                  </Paper>
                </>
              )}
            </DialogContent>

            <DialogActions
              sx={{
                px: 3,
                py: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                gap: 1,
              }}
            >
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCard}
                color="primary"
                variant="contained"
                disabled={!newCard.bank || !newCard.cardName || isLoading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  boxShadow: theme.shadows[3],
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Add Card
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
