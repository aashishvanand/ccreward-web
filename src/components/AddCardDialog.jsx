import React, { useState, useEffect } from "react";
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
  Alert
} from "@mui/material";
import { fetchBanks, fetchCards } from "../utils/api";

function AddCardDialog({ open, onClose, onAddCard }) {
  const [newCard, setNewCard] = useState({ bank: "", cardName: "" });
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  useEffect(() => {
    if (open) {
      fetchBankList();
    }
  }, [open]);

  const fetchBankList = async () => {
    setLoading(true);
    try {
      const bankList = await fetchBanks();
      setBanks(bankList);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCardList = async (bank) => {
    setLoading(true);
    try {
      const cardList = await fetchCards(bank);
      setCards(cardList);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.message.includes("too many requests")) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "warning"
      });
    } else {
      setSnackbar({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error"
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
    onAddCard(newCard);
    setNewCard({ bank: "", cardName: "" });
    onClose();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Card</DialogTitle>
      <DialogContent>
        {loading && <CircularProgress />}
        {error && <p style={{ color: "red" }}>{error}</p>}
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
          onChange={(e) => setNewCard({ ...newCard, cardName: e.target.value })}
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
     <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
     <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
       {snackbar.message}
     </Alert>
   </Snackbar>
   </>
  );
}

export default AddCardDialog;