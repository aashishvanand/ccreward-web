import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Backdrop,
} from '@mui/material';

const MissingBankCardForm = ({ open, onClose, onSubmitSuccess }) => {
  const [bankName, setBankName] = useState('');
  const [cardName, setCardName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLScN5YIru311tyglwI3vLjAbeOEHnW8BRWE2ce1qwgch-1mDbQ/formResponse', {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    }).then(() => {
      onSubmitSuccess('Submitted successfully!');
      clearForm();
      onClose();
    }).catch((error) => {
      console.error('Error:', error);
      onSubmitSuccess('There was an error submitting. Please try again.', 'error');
    });
  };

  const clearForm = () => {
    setBankName('');
    setCardName('');
  };

  return (
    <>
      <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} />
      <Dialog 
        open={open} 
        onClose={onClose}
        sx={{ 
          '& .MuiDialog-paper': { 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Report Missing Bank or Card</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" paragraph>
              Please provide the name of the missing bank and/or card.
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Bank Name"
              name="entry.1393850936"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Card Name"
              name="entry.576605505"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default MissingBankCardForm;