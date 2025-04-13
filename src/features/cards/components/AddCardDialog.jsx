import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CardNetworkSelector from "./CardNetworkSelector";

const cardNetworks = [
  { name: "Visa", id: "76167935-fcfc-4098-f3e4-b9d4369f6800" },
  { name: "Mastercard", id: "40969bf0-5dcf-48cd-a617-df61631df000" },
  { name: "RuPay", id: "24b3f814-0f9a-4639-ce66-43c5128c7300" },
  { name: "DinersClub", id: "452de32e-ea1e-46b4-eec8-01f0ebf32c00" },
  { name: "AmEx", id: "55c9ee86-66b6-4540-17f5-0cebd2ae6700" },
  { name: "UnionPay", id: "55c9ee86-66b6-4540-17f5-0cebd2ae6701" },
];

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
  const region =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("app-region") || "IN"
      : "IN";

  const currentYear = new Date().getFullYear();

  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [newCard, setNewCard] = useState({
    bank: "",
    cardName: "",
    network: region === "SG" ? "Mastercard" : "Visa",
    billingDate: 1,
    limit: region === "SG" ? 500 : 100000,
  });

  // Safe access to limit config based on region
  const getLimitConfig = () => {
    return limitConfig[region] || limitConfig.default;
  };

  useEffect(() => {
    // Fetch banks
    const fetchBanks = async () => {
      setIsLoading(true);
      // Mock data for demonstration
      setTimeout(() => {
        setBanks(["HDFC", "ICICI", "SBI", "Axis", "AMEX", "YesBank"]);
        setIsLoading(false);
      }, 500);
    };

    fetchBanks();
  }, [region]);

  const handleBankChange = (event, value) => {
    setNewCard((prev) => ({ ...prev, bank: value, cardName: "" }));

    // Fetch cards for selected bank
    if (value) {
      setIsLoading(true);
      // Mock data for demonstration
      setTimeout(() => {
        const mockCards = {
          HDFC: ["Regalia", "Diners Black", "Infinia", "Millennia"],
          ICICI: ["Amazon Pay", "Emeralde", "Rubyx", "Sapphiro"],
          SBI: ["Elite", "SimplyCLICK", "BPCL", "Prime"],
          Axis: ["Ace", "Atlas", "Magnus", "Vistara"],
          AMEX: ["Platinum", "Gold", "Membership Rewards"],
          YesBank: ["Prosperity", "Premia", "Exclusive"],
        };
        setCards(mockCards[value] || []);
        setIsLoading(false);
      }, 500);
    } else {
      setCards([]);
    }
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

  const getCurrencySymbol = () => {
    if (region === "SG") return "S$";
    if (region === "IN") return "₹";
    return "$"; // Default
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: 500 }}>
          Add New Card
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Autocomplete
              options={banks}
              value={newCard.bank}
              onChange={handleBankChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bank"
                  required
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              )}
            />

            <Autocomplete
              options={cards}
              value={newCard.cardName}
              onChange={(event, value) =>
                setNewCard((prev) => ({ ...prev, cardName: value }))
              }
              disabled={!newCard.bank || isLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Card Name"
                  required
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              )}
            />

            <Accordion
              expanded={expanded}
              onChange={() => setExpanded(!expanded)}
              elevation={0}
              sx={{
                mt: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                "&::before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                }}
              >
                <Typography>Additional Card Details (Optional)</Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 3 }}>
                <CardNetworkSelector
                  selectedNetwork={newCard.network}
                  onNetworkChange={(networkName) =>
                    setNewCard((prev) => ({ ...prev, network: networkName }))
                  }
                  region={region}
                />

                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 500, mt: 2 }}
                >
                  Billing Date
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 0.5,
                    mb: 3,
                  }}
                >
                  {BILLING_DATES.map((date) => (
                    <Button
                      key={date}
                      variant={
                        newCard.billingDate === date ? "contained" : "outlined"
                      }
                      onClick={() =>
                        setNewCard((prev) => ({ ...prev, billingDate: date }))
                      }
                      sx={{
                        minWidth: 0,
                        height: 36,
                        p: 0,
                      }}
                    >
                      {date}
                    </Button>
                  ))}
                </Box>

                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 500, mt: 2 }}
                >
                  Credit Limit ({getCurrencySymbol()})
                </Typography>

                <Box sx={{ px: 2, mb: 3 }}>
                  <Slider
                    value={newCard.limit}
                    min={getLimitConfig().min}
                    max={getLimitConfig().max}
                    step={1000}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) =>
                      `${getCurrencySymbol()}${value.toLocaleString()}`
                    }
                    marks={getLimitConfig().steps}
                    onChange={(e, newValue) =>
                      setNewCard((prev) => ({ ...prev, limit: newValue }))
                    }
                  />
                </Box>

                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 500, mt: 2 }}
                >
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
              </AccordionDetails>
            </Accordion>
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}
      >
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
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
          }}
        >
          Add Card
        </Button>
      </DialogActions>
    </Dialog>
  );
}
