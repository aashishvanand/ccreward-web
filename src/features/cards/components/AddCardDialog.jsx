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
  Snackbar,
  Alert,
  Typography,
  Box,
  Select,
  FormControl,
  InputLabel,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRegion } from "../../../core/providers/RegionContext";
import { fetchBanks, fetchCards } from "../../../core/services/api";

function AddCardDialog({ open, onClose, onAddCard }) {
  const { region } = useRegion();
  const currentYear = new Date().getFullYear();

  const NETWORK_OPTIONS = {
    IN: ["Visa", "Mastercard", "RuPay", "DinersClub", "AmEx"],
    SG: ["Visa", "Mastercard", "DinersClub", "AmEx", "UnionPay"]
  };

  const BILLING_DATES = Array.from({length: 31}, (_, i) => i + 1);

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

  const [newCard, setNewCard] = useState({ 
    bank: "", 
    cardName: "",
    // Optional details
    network: region === 'IN' ? "Visa" : "Mastercard",
    billingDate: 1,
    limit: region === 'IN' ? 100000 : 500,
    since: `${new Date().toLocaleString('default', { month: 'long' })}, ${currentYear}`
  });

  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [expanded, setExpanded] = useState(false);

  // ... existing useEffects for fetching banks and cards ...

  const handleBankChange = (e) => {
    const selectedBank = e.target.value;
    setNewCard(prev => ({ ...prev, bank: selectedBank, cardName: "" }));
    if (selectedBank) {
      fetchCardList(selectedBank);
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

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const generateYearOptions = () => {
    return Array.from(
      { length: 10 },
      (_, i) => currentYear - i
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
    >
      <DialogTitle>Add New Card</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TextField
              select
              label="Bank"
              value={newCard.bank}
              onChange={handleBankChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="">Select a bank</MenuItem>
              {banks.map((bank) => (
                <MenuItem key={bank} value={bank}>
                  {bank}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Card Name"
              value={newCard.cardName}
              onChange={(e) => setNewCard(prev => ({ ...prev, cardName: e.target.value }))}
              fullWidth
              margin="normal"
              disabled={!newCard.bank || loading}
            >
              <MenuItem value="">Select a card</MenuItem>
              {cards.map((card) => (
                <MenuItem key={card} value={card}>
                  {card}
                </MenuItem>
              ))}
            </TextField>

            <Accordion 
              expanded={expanded} 
              onChange={(e, isExpanded) => setExpanded(isExpanded)}
              sx={{ mt: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Additional Card Details (Optional)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ py: 2 }}>
                  {/* Card Network */}
                  <Typography variant="h6" gutterBottom>Card Network</Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
                    {NETWORK_OPTIONS[region].map((network) => (
                      <Box
                        key={network}
                        onClick={() => setNewCard(prev => ({ ...prev, network }))}
                        sx={{
                          p: 2,
                          borderRadius: "50%",
                          border: "2px solid",
                          borderColor: newCard.network === network ? "primary.main" : "divider",
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
                    value={newCard.billingDate}
                    exclusive
                    onChange={(e, newValue) => {
                      if (newValue !== null) {
                        setNewCard(prev => ({ ...prev, billingDate: newValue }));
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
                      value={newCard.limit}
                      min={limitConfig[region].min}
                      max={limitConfig[region].max}
                      step={1000}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${region === 'IN' ? '₹' : '$'}${value.toLocaleString()}`}
                      onChange={(e, newValue) => setNewCard(prev => ({ ...prev, limit: newValue }))}
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
              </AccordionDetails>
            </Accordion>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleAddCard}
          color="primary"
          variant="contained"
          disabled={!newCard.bank || !newCard.cardName || loading}
        >
          Add Card
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddCardDialog;