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
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  CreditCard,
  Add as AddIcon,
  Delete as DeleteIcon,
  Brightness4,
  Brightness7,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/providers/AuthContext';
import { useAppTheme } from '../components/ThemeRegistry';
import { bankData } from '../data/bankData';  // Import the bank data
import { addCardForUser, getCardsForUser, deleteCardForUser } from '../utils/firebaseUtils';

function MyCardsPage() {
  const { mode, toggleTheme, theme } = useAppTheme();
  const [cards, setCards] = useState([]);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({ bank: '', cardName: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { user, isAuthenticated, loading, logout } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      if (loading) {
        return;
      }

      if (!isAuthenticated()) {
        router.push('/');
      } else {
        await fetchUserCards();
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, router, user, loading]);

  const fetchUserCards = async () => {
    if (!user) {
      console.error('No user available');
      showSnackbar('Authentication error. Please try logging in again.', 'error');
      setIsLoading(false);
      return;
    }
  
    try {
      const fetchedCards = await getCardsForUser(user.uid);
      setCards(fetchedCards);
      setHasAttemptedFetch(true);
    } catch (error) {
      console.error('Error fetching cards:', error);
      if (error.message.includes('Permission denied')) {
        showSnackbar('You do not have permission to access these cards. Please try logging out and in again.', 'error');
      } else {
        showSnackbar('Error fetching cards. Please try again later.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = async () => {
    try {
      const cardData = {
        bank: newCard.bank,
        cardName: newCard.cardName
      };

      await addCardForUser(user.uid, cardData);
      await fetchUserCards(); // Refresh the cards list
      setIsAddCardDialogOpen(false);
      setNewCard({ bank: '', cardName: '' });
      showSnackbar('Card added successfully', 'success');
    } catch (error) {
      console.error('Error adding card:', error);
      showSnackbar('Error adding card. Please try again later.', 'error');
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCardForUser(user.uid, cardId);
      await fetchUserCards(); // Refresh the cards list
      showSnackbar('Card deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting card:', error);
      showSnackbar('Error deleting card. Please try again later.', 'error');
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      showSnackbar('Error logging out. Please try again.', 'error');
    }
  };

  if (isLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <CreditCard sx={{ mr: 1 }} />
            CardCompare
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ ml: 2 }}
          >
            Logout
          </Button>
          <Avatar
            src={user?.photoURL || ''}
            alt={user?.displayName || 'User'}
            sx={{ ml: 2, width: 40, height: 40 }}
          />
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

      <Dialog 
        open={isAddCardDialogOpen} 
        onClose={() => setIsAddCardDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
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
            {newCard.bank && bankData[newCard.bank].map((card) => (
              <MenuItem key={card} value={card}>
                {card}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddCardDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCard} color="primary" variant="contained">Add Card</Button>
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

export default MyCardsPage;