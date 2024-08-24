import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { bankData } from "../data/bankData";

function AddCardDialog({ open, onClose, onAddCard }) {
  const [newCard, setNewCard] = useState({ bank: "", cardName: "" });

  const handleAddCard = () => {
    onAddCard(newCard);
    setNewCard({ bank: "", cardName: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Card</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Bank"
          value={newCard.bank}
          onChange={(e) => setNewCard({ ...newCard, bank: e.target.value })}
          fullWidth
          margin="normal"
        >
          {Object.keys(bankData).map((bank) => (
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
          disabled={!newCard.bank}
        >
          {newCard.bank &&
            bankData[newCard.bank].map((card) => (
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
          disabled={!newCard.bank || !newCard.cardName}
        >
          Add Card
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddCardDialog;
