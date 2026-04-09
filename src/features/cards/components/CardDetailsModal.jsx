import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Stack,
  TextField,
  Paper,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon, CreditCard as CreditCardIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useRegion } from "@/core/providers/RegionContext";
import CardNetworkSelector from "./CardNetworkSelector";

const CardDetailsModal = ({ open, onClose, card, onSave, onDelete }) => {
  const theme = useTheme();
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
          <CreditCardIcon sx={{ fontSize: 32, opacity: 0.9 }} />
          <Typography variant="h5" sx={{
            fontWeight: "bold"
          }}>Card Details</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white", opacity: 0.8, '&:hover': { opacity: 1 } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Stack spacing={3}>
          <TextField
            label="Bank"
            value={cardDetails.bank}
            fullWidth
            disabled
            variant="outlined"
            slotProps={{
              input: {
                readOnly: true,
              }
            }}
          />
          <TextField
            label="Card Name"
            value={cardDetails.cardName}
            fullWidth
            disabled
            variant="outlined"
            slotProps={{
              input: {
                readOnly: true,
              }
            }}
          />
          
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
              Card Network
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <CardNetworkSelector
                selectedNetwork={cardDetails.network}
                onNetworkChange={handleNetworkChange}
              />
            </Paper>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0, justifyContent: "space-between" }}>
        <Button 
          onClick={handleDelete} 
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ 
            px: 2,
            borderRadius: 2,
            '&:hover': { bgcolor: 'error.lighter' }
          }}
        >
          Delete Card
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            onClick={onClose}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{
              px: 4,
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Save Changes
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CardDetailsModal;