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
  useTheme,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import CardNetworkSelector from "./CardNetworkSelector";
import { fetchBanks, fetchCards } from "../../../core/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useRegion } from "../../../core/providers/RegionContext";

export default function AddCardDialog({ open, onClose, onAddCard }) {
  const theme = useTheme();
  const { region, isInitialized } = useRegion();

  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [newCard, setNewCard] = useState({
    bank: "",
    cardName: "",
    network: "",
  });

  useEffect(() => {
    if (open && isInitialized && region) {
      setNewCard({
        bank: "",
        cardName: "",
        network: "",
      });
      setCards([]);
      fetchBankList();
    }
  }, [open, isInitialized, region]);

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

    onAddCard(newCard);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Card</DialogTitle>
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
      </Dialog>

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