import { useState, useEffect, useRef } from "react";
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
  Chip,
} from "@mui/material";
import { Public as PublicIcon } from "@mui/icons-material";
import { useRegion, REGIONS } from "../../../core/providers/RegionContext";
import { fetchBanks, fetchCards } from "../../../core/services/api";

function AddCardDialog({ open, onClose, onAddCard }) {
  // Get region from context
  const { region: contextRegion, regionName: contextRegionName } = useRegion();
  
  // Use state to track the active region in the dialog
  const [activeRegion, setActiveRegion] = useState({
    code: contextRegion,
    name: contextRegionName
  });
  
  const [newCard, setNewCard] = useState({ bank: "", cardName: "" });
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Reset dialog state when opened
  useEffect(() => {
    if (open) {
      // Read directly from localStorage to ensure we have the most current value
      const currentRegion = localStorage.getItem('app-region') || 'IN';
      const currentRegionName = REGIONS[currentRegion] || 'India';
      
      console.log(`Dialog opened with region: ${currentRegion} (${currentRegionName})`);
      
      // Reset all state
      setNewCard({ bank: "", cardName: "" });
      setBanks([]);
      setCards([]);
      setActiveRegion({
        code: currentRegion,
        name: currentRegionName
      });
      
      // Fetch banks for this region
      fetchBankList(currentRegion);
    }
  }, [open]);

  // Function to update everything when region changes
  const updateForRegion = (newRegion) => {
    const regionName = REGIONS[newRegion] || 'India';
    
    console.log(`Updating dialog for region change: ${newRegion} (${regionName})`);
    
    // Update state
    setActiveRegion({
      code: newRegion,
      name: regionName
    });
    
    // Reset selections
    setNewCard({ bank: "", cardName: "" });
    setCards([]);
    
    // Fetch banks for new region
    fetchBankList(newRegion);
  };

  // Listen for region changes
  useEffect(() => {
    const handleRegionChanged = (event) => {
      if (!open) return;
      
      // Get new region from event or localStorage
      const newRegion = event?.detail?.region || 
                        localStorage.getItem('app-region') || 
                        'IN';
                        
      updateForRegion(newRegion);
    };

    // Listen for our custom event
    window.addEventListener('region-changed', handleRegionChanged);
    
    // Clean up
    return () => {
      window.removeEventListener('region-changed', handleRegionChanged);
    };
  }, [open]);

  // Watch for context region changes too
  useEffect(() => {
    if (open && contextRegion !== activeRegion.code) {
      updateForRegion(contextRegion);
    }
  }, [contextRegion, activeRegion.code, open]);

  const fetchBankList = async (regionCode) => {
    setLoading(true);
    try {
      console.log(`Fetching banks for region: ${regionCode}`);
      const bankList = await fetchBanks(regionCode);
      setBanks(bankList);
    } catch (error) {
      console.error("Error fetching banks:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCardList = async (bank) => {
    setLoading(true);
    try {
      console.log(`Fetching cards for bank ${bank} in region ${activeRegion.code}`);
      const cardList = await fetchCards(bank, activeRegion.code);
      setCards(cardList);
    } catch (error) {
      console.error("Error fetching cards:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    if (error?.message?.includes("too many requests")) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "warning",
      });
    } else {
      setSnackbar({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
    }
  };

  const handleBankChange = (e) => {
    const selectedBank = e.target.value;
    setNewCard({ bank: selectedBank, cardName: "" });
    if (selectedBank) {
      fetchCardList(selectedBank);
    } else {
      setCards([]);
    }
  };

  const handleAddCard = () => {
    // Add region information
    const cardWithCountry = {
      ...newCard,
      country: (cardData.country || country).toLowerCase(),
    };
    
    console.log(`Adding card with region: ${activeRegion.code.toLowerCase()}`);
    onAddCard(cardWithCountry);
    
    // Reset and close
    setNewCard({ bank: "", cardName: "" });
    onClose();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        slots={{
          backdrop: "div",
        }}
        slotProps={{
          backdrop: {
            sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Add New Card
          </Box>
         
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
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
                onChange={(e) =>
                  setNewCard({ ...newCard, cardName: e.target.value })
                }
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddCardDialog;