import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Autocomplete,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from '@mui/material';
import { CreditCard as CreditCardIcon } from '@mui/icons-material';
import { calculateRewards, formatRewardText } from './CalculatorHelpers';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from "../app/providers/AuthContext";
import { getCardsForUser } from "../utils/firebaseUtils";
import { mccList } from "../data/mccData";
import ReactConfetti from 'react-confetti';
import ExportedImage from "next-image-export-optimizer";
import { getBankColor } from './colorPalette';

const BestCardCalculator = () => {
  const [userCards, setUserCards] = useState([]);
  const [selectedMcc, setSelectedMcc] = useState(null);
  const [spentAmount, setSpentAmount] = useState('');
  const [cardRewards, setCardRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCardListLoading, setIsCardListLoading] = useState(true);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [imageLoadStatus, setImageLoadStatus] = useState({});
  const [failedImages, setFailedImages] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserCards = async () => {
      if (user) {
        try {
          setIsCardListLoading(true);
          const fetchedCards = await getCardsForUser(user.uid);
          setUserCards(fetchedCards);
        } catch (error) {
          console.error("Error fetching user cards:", error);
        } finally {
          setIsCardListLoading(false);
        }
      }
    };

    fetchUserCards();
    setHasCalculated(false);
  }, [user]);

  const handleCalculate = async () => {
    setIsLoading(true);
    const rewards = await Promise.all(
      userCards.map(async (card) => {
        const result = await calculateRewards(
          card.bank,
          card.cardName,
          selectedMcc,
          spentAmount,
          {}
        );
        return { ...card, ...result };
      })
    );

    const sortedRewards = rewards.sort((a, b) => {
      const aValue = a.points || a.cashback || a.miles || 0;
      const bValue = b.points || b.cashback || b.miles || 0;
      return bValue - aValue;
    });

    setCardRewards(sortedRewards);
    setIsLoading(false);
    setIsCalculated(true);
    
    if (!hasCalculated) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
      setHasCalculated(true);
    }
  };

  const getCardImagePath = (bank, cardName) => {
    const formattedCardName = cardName.replace(/\s+/g, '_').toLowerCase();
    return `/card-images/${bank}/${bank.toLowerCase()}_${formattedCardName}.webp`;
  };

  const handleImageError = (cardId) => {
    setFailedImages(prevFailedImages => ({
      ...prevFailedImages,
      [cardId]: true
    }));
  };

  const renderCardImage = (card) => {
    const bankColor = getBankColor(card.bank);

    if (failedImages[card.id]) {
      return <CreditCardIcon sx={{ fontSize: 40, color: bankColor }} />;
    }

    return (
      <ExportedImage
        src={getCardImagePath(card.bank, card.cardName)}
        alt={`${card.bank} ${card.cardName}`}
        fill
        style={{ objectFit: "contain" }}
        onError={() => handleImageError(card.id)}
      />
    );
  };


  const renderCardList = () => {
    if (isCardListLoading) {
      return Array(3).fill(0).map((_, index) => (
        <ListItem key={index} sx={{ mb: 2 }}>
          <Card sx={{ width: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Skeleton variant="rectangular" width={60} height={40} sx={{ mr: 2 }} />
              <Box sx={{ width: '100%' }}>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
              </Box>
            </CardContent>
          </Card>
        </ListItem>
      ));
    }

    return (isCalculated ? cardRewards : userCards).map((card, index) => (
      <ListItem 
        key={card.id}
        sx={{ 
          mb: 2,
          borderRadius: 1,
        }}
      >
        <Card 
          sx={{ 
            width: '100%',
            bgcolor: isCalculated && index === 0 ? 'success.light' : 'background.paper',
          }}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemIcon>
              <Box sx={{ width: 60, height: 40, position: 'relative', mr: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {renderCardImage(card)}
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="h6" component="div" sx={{ color: isCalculated && index === 0 ? 'success.contrastText' : 'text.primary' }}>
                  {isCalculated ? `${index + 1}. ${card.bank} - ${card.cardName}` : `${card.bank} - ${card.cardName}`}
                </Typography>
              }
              secondary={
                isCalculated ? 
                  <Typography variant="body1" sx={{ color: index === 0 ? 'success.contrastText' : 'text.secondary' }}>
                    {formatRewardText(card)}
                  </Typography>
                : null
              }
            />
          </CardContent>
        </Card>
      </ListItem>
    ));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        {showConfetti && <ReactConfetti />}
        <Typography variant="h4" gutterBottom>
          Know Your Best Card
        </Typography>
        <Autocomplete
          options={mccList}
          getOptionLabel={(option) => `${option.mcc} - ${option.name}`}
          renderInput={(params) => (
            <TextField {...params} label="Select MCC (Optional)" margin="normal" fullWidth />
          )}
          onChange={(event, newValue) => setSelectedMcc(newValue)}
          value={selectedMcc}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Enter spent amount (INR)"
          type="number"
          value={spentAmount}
          onChange={(e) => setSpentAmount(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCalculate}
          disabled={!spentAmount || isLoading}
          sx={{ mt: 2, mb: 4 }}
        >
          Calculate Best Card
        </Button>
        {isLoading && <CircularProgress sx={{ mt: 2 }} />}
        <List sx={{ width: '100%' }}>
          {renderCardList()}
        </List>
      </Container>
      <Footer />
    </Box>
  );
};

export default BestCardCalculator;