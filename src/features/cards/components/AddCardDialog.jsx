"use client";

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
  Autocomplete,
  IconButton,
  Stack,
} from "@mui/material";
import { Close as CloseIcon, AddCard as AddCardIcon } from "@mui/icons-material";
import CardNetworkSelector from "./CardNetworkSelector";
import { fetchBanks, fetchCards } from "@/core/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useRegion } from "@/core/providers/RegionContext";

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

  const handleBankChange = (event, newValue) => {
    setNewCard({ ...newCard, bank: newValue, cardName: "" });
    if (newValue) {
      fetchCardList(newValue);
    } else {
      setCards([]);
    }
  };

  const handleCardChange = (event, newValue) => {
    setNewCard((prev) => ({ ...prev, cardName: newValue }));
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
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              overflow: "hidden"
            }
          }
        }}
      >
        <Box sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AddCardIcon sx={{ fontSize: 32, opacity: 0.9 }} />
            <Typography variant="h5" sx={{
              fontWeight: "bold"
            }}>Add New Card</Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Close dialog" sx={{ color: "white", opacity: 0.8, '&:hover': { opacity: 1 } }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Stack spacing={3}>
            {/* Bank Selection */}
            <Autocomplete
              value={newCard.bank}
              onChange={handleBankChange}
              options={banks}
              disabled={isLoading}
              disableClearable
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Select Bank" 
                  required
                  placeholder="Search for your bank..."
                  helperText="Start typing to search"
                />
              )}
              noOptionsText="No banks found"
            />

            {/* Card Selection */}
            <Autocomplete
              value={newCard.cardName}
              onChange={handleCardChange}
              options={cards}
              disabled={!newCard.bank || isLoading}
              disableClearable
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Select Card" 
                  required
                  placeholder={newCard.bank ? "Search for your card..." : "Select a bank first"}
                />
              )}
              noOptionsText={newCard.bank ? "No cards found for this bank" : "Select a bank first"}
            />

            {/* Network Selection (Optional) */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
                Card Network (Optional)
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                <CardNetworkSelector
                  selectedNetwork={newCard.network}
                  onNetworkChange={handleNetworkChange}
                />
              </Paper>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={onClose}
            sx={{ 
              color: 'text.secondary',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!newCard.bank || !newCard.cardName || isLoading}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Add Card"}
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