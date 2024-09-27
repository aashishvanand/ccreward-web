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
} from "@mui/material";
import { fetchBanks, fetchCards } from "../utils/api";

function AddCardDialog({ open, onClose, onAddCard }) {
  const [newCard, setNewCard] = useState({ bank: "", cardName: "" });
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      fetchBankList();
    }
  }, [open]);

  const fetchBankList = async () => {
    setLoading(true);
    setError("");
    try {
      const bankList = await fetchBanks();
      setBanks(bankList);
    } catch (error) {
      console.error("Error fetching banks:", error);
      setError("Failed to fetch banks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCardList = async (bank) => {
    setLoading(true);
    setError("");
    try {
      const cardList = await fetchCards(bank);
      setCards(cardList);
    } catch (error) {
      console.error(`Error fetching cards for ${bank}:`, error);
      setError("Failed to fetch cards. Please try again.");
    } finally {
      setLoading(false);
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

  return (
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
  );
}

export default AddCardDialog;