'use client';
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  Link,
} from '@mui/material';
import {
  CreditCard,
  Add as AddIcon,
  Delete as DeleteIcon,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/providers/AuthProvider';
import { useTheme, withTheme } from './ThemeRegistry';

const API_BASE_URL = "https://credit-card-rewards-india-backend.aashishvanand.workers.dev";

function MyCardsPage() {
  const { mode, toggleTheme } = useTheme();
  const [cards, setCards] = useState([]);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({ bank: '', cardName: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const router = useRouter();

  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated;
  const token = auth?.token;

  useEffect(() => {
    if (!isAuthenticated || !isAuthenticated()) {
      router.push('/signin');
    } else {
      fetchUserCards();
    }
  }, [isAuthenticated, router]);

  const fetchUserCards = async () => {
    if (!token) {
      console.error('No token available');
      showSnackbar('Authentication error', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/cards`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCards(data.cards);
      } else {
        console.error('Failed to fetch cards');
        showSnackbar('Failed to fetch cards', 'error');
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
      showSnackbar('Error fetching cards', 'error');
    }
  };

  const handleAddCard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newCard),
      });

      if (response.ok) {
        const addedCard = await response.json();
        setCards([...cards, addedCard]);
        setIsAddCardDialogOpen(false);
        setNewCard({ bank: '', cardName: '' });
        showSnackbar('Card added successfully', 'success');
      } else {
        showSnackbar('Failed to add card', 'error');
      }
    } catch (error) {
      console.error('Error adding card:', error);
      showSnackbar('Error adding card', 'error');
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCards(cards.filter(card => card.id !== cardId));
        showSnackbar('Card deleted successfully', 'success');
      } else {
        showSnackbar('Failed to delete card', 'error');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      showSnackbar('Error deleting card', 'error');
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <CreditCard sx={{ mr: 1 }} />
            CardCompare
          </Typography>
          <Button color="inherit" component={Link} href="/">Home</Button>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 8 }} maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            My Cards
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddCardDialogOpen(true)}
          >
            Add New Card
          </Button>
        </Box>

        {cards.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            You haven&apos;t added any cards yet. Click &quot;Add New Card&quot; to get started!
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    '&:hover .deleteIcon': {
                      opacity: 1,
                    },
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      pt: '56.25%',
                      background: `linear-gradient(45deg, ${mode === 'dark' ? '#1a237e' : '#2196f3'}, #f50057)`,
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.bank}
                    </Typography>
                    <Typography>
                      {card.cardName}
                    </Typography>
                  </CardContent>
                  <IconButton 
                    className="deleteIcon"
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.7)',
                      },
                    }}
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    <DeleteIcon sx={{ color: 'white' }} />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Dialog open={isAddCardDialogOpen} onClose={() => setIsAddCardDialogOpen(false)}>
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
            <MenuItem value="HDFC">HDFC</MenuItem>
            <MenuItem value="ICICI">ICICI</MenuItem>
            <MenuItem value="SBI">SBI</MenuItem>
            {/* Add more banks as needed */}
          </TextField>
          <TextField
            label="Card Name"
            value={newCard.cardName}
            onChange={(e) => setNewCard({ ...newCard, cardName: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddCardDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCard} color="primary">Add Card</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper' }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 CardCompare. All rights reserved.
            <Link color="inherit" href="#" sx={{ ml: 2 }}>
              Terms of Service
            </Link>
            <Link color="inherit" href="#" sx={{ ml: 2 }}>
              Privacy
            </Link>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default withTheme(MyCardsPage);