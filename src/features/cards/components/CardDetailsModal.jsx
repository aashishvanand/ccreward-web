import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useRegion } from "../../../core/providers/RegionContext";
import CardNetworkSelector from "./CardNetworkSelector";

const CardDetailsModal = ({ open, onClose, card, onSave, onDelete }) => {
  const { region } = useRegion();
  const [cardDetails, setCardDetails] = useState(null);

  useEffect(() => {
    if (card && open) {
      const { network } = card;
      setCardDetails({
        ...card,
        network: network || (region === "IN" ? "Visa" : "Mastercard"),
      });
    }
  }, [card, open, region]);

  if (!open || !card || !cardDetails) return null;

  const handleSave = () => { 
    onSave(cardDetails); 
    onClose(); 
  };
  
  const handleDelete = () => { 
    if (onDelete && card) { 
      onDelete(card.bank, card.cardName); 
      onClose(); 
    } 
  };
  
  const handleNetworkChange = (network) => { 
    setCardDetails(prev => ({ ...prev, network })); 
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Card Details</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Card Network</Typography>
          <CardNetworkSelector
            selectedNetwork={cardDetails.network}
            onNetworkChange={handleNetworkChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardDetailsModal;