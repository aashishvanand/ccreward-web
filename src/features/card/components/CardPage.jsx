"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { useAuth } from "@/core/providers/AuthContext";
import useCardImagesData from "@/core/hooks/useCardImagesData";
import TiltCard from "@/shared/components/ui/TiltCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import TrainIcon from "@mui/icons-material/Train";
import SportsGolfIcon from "@mui/icons-material/SportsGolf";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";

const bankColors = {
  HDFC: "#004C8F",
  ICICI: "#B02A30",
  SBI: "#22409A",
  Axis: "#800000",
  AMEX: "#006FCF",
  YESBank: "#00518F",
  SC: "#0072AA",
  Kotak: "#ED1C24",
  IDFCFirst: "#9C1D26",
  HSBC: "#EE3524",
  OneCard: "#000000",
  RBL: "#21317D",
  IndusInd: "#98272A",
  IDBI: "#00836C",
  Federal: "#F7A800",
  BOB: "#F15A29",
  AU: "#ec691f",
};

const CardPage = ({ bankName, cardName, country }) => {
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [goals, setGoals] = useState(null);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();

  // Fetch card images
  const { cardImagesData } = useCardImagesData();

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return;

    if (!user) {
      setOpenDialog(true);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the auth object from firebase to get the token directly
        // The user object from context might be a plain object stripped of methods
        const { auth } = await import('@/firebase');
        const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
        
        if (!token) {
             throw new Error("Unable to authenticate. Please try signing in again.");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const encodedCard = encodeURIComponent(cardName);
        const baseUrl = "https://devapi.ccreward.app/v3";

        // Fetch Card Details
        const detailsRes = await fetch(
          `${baseUrl}/card/detail?bank=${bankName}&card=${encodedCard}&country=${country}`,
          { headers }
        );
        
        if (detailsRes.status === 404) {
          router.replace('/404');
          return;
        }
        
        if (!detailsRes.ok) throw new Error("Failed to fetch card details");
        const detailsData = await detailsRes.json();
        setData(detailsData);

        // Fetch Goals
        const goalsRes = await fetch(
            `${baseUrl}/goals?bank=${bankName}&card=${encodedCard}&country=${country}`,
            { headers }
          );

        if (goalsRes.ok) {
             const goalsData = await goalsRes.json();
             setGoals(goalsData);
        }

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, bankName, cardName, country]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setOpenDialog(false);
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  const renderAccessFrequency = (access) => {
    if (!access || access === "NA") return "Not Available";
    
    // Check for "999" or 999 to display "Unlimited"
    const unlimitedValue = "Unlimited"; // Or use the Infinity symbol if preferred
    
    if (access === 999 || access === "999") return unlimitedValue;
    
    if (typeof access === "string") return access;
    
    // Check keys in order of period duration (roughly)
    const periods = [
        { key: 'daily', label: 'Daily' },
        { key: 'weekly', label: 'Weekly' },
        { key: 'monthly', label: 'Monthly' },
        { key: 'quarterly', label: 'Quarterly' },
        { key: 'halfYearly', label: 'Half Yearly' },
        { key: 'annual', label: 'Annual' },
        { key: 'transaction', label: 'Per Transaction' }
    ];

    const available = periods.find(p => access[p.key] !== undefined && access[p.key] !== 'NA');
    if (available) {
        let val = access[available.key];
        if(val === 999 || val === "999") val = unlimitedValue;
        return `${val} ${available.label} visits`;
    }
    return "Check details";
  };

  const formatCurrency = (amount) => {
    if (amount === "NA" || amount === undefined) return "NA";
    return new Intl.NumberFormat(country === 'in' ? 'en-IN' : 'en-SG', {
      style: 'currency',
      currency: country === 'in' ? 'INR' : 'SGD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Logic to find card image & details
  // Using same logic as CardList.jsx
  const cardDetails = cardImagesData?.find(
    (item) =>
      item.bank.toLowerCase() === bankName.toLowerCase() &&
      item.cardName.toLowerCase() === cardName.toLowerCase()
  );

  const cardImage = cardDetails?.id;
  const orientation = cardDetails?.orientation || 'horizontal';
  
  // Bank Color Logic
  const matchedBankKey = Object.keys(bankColors).find(key => 
    bankName.toLowerCase().includes(key.toLowerCase()) || 
    key.toLowerCase().includes(bankName.toLowerCase())
  );
  const ambientColor = matchedBankKey ? bankColors[matchedBankKey] : '#3EB8FF'; // Default blue

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: 'background.default' }}>
      <Header />
      <Container component="main" sx={{ py: 6, flexGrow: 1 }} maxWidth="xl">
        
        {authLoading || loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
           <Alert severity="error">{error}</Alert>
        ) : !user ? (
             <Alert severity="info" action={
                <Button color="inherit" size="small" onClick={() => setOpenDialog(true)}>
                  Sign In
                </Button>
              }>
              Please sign in to view card details.
            </Alert>
        ) : data && (
            <>
            {/* Header Section */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {bankName} {cardName}
                </Typography>
            </Box>

          <Grid container spacing={4}>
            
            {/* Row 1: Fees (Left) & Card Image (Right) */}
            <Grid item xs={12} md={6}>
                 <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, textAlign: 'center' }}>Fees</Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 2, textAlign: 'center' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>Annual Fee</Typography>
                                <Typography variant="h5" sx={{ color: 'primary.dark', fontWeight: 700 }}>{formatCurrency(data.annualFees)}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                             <Box sx={{ p: 2, bgcolor: 'secondary.50', borderRadius: 2, textAlign: 'center' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>Joining Fee</Typography>
                                <Typography variant="h5" sx={{ color: 'secondary.dark', fontWeight: 700 }}>{formatCurrency(data.joiningFees)}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                     <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Requirements</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="subtitle2" color="text.secondary">Income</Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {data.incomeRequirement === 'NA' ? 'Not Specified' : formatCurrency(data.incomeRequirement)}
                        </Typography>
                        
                         {data.marketSegment && data.marketSegment !== 'NA' && (
                             <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Segment</Typography>
                                <Chip label={data.marketSegment} size="small" sx={{ mt: 0.5 }} />
                            </Box>
                        )}
                    </Box>
                 </Paper>
            </Grid>

            {/* Card Image Column (Right of Fees) */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Box sx={{ mb: { xs: 6, md: 0 }, display: 'flex', position: 'relative' }}>
                    {/* Ambient Background */}
                    <Box sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        width: orientation === 'vertical' ? '280px' : '400px', 
                        height: orientation === 'vertical' ? '400px' : '280px', 
                        background: `radial-gradient(circle, ${ambientColor}66 0%, ${ambientColor}00 70%)`, 
                        filter: 'blur(50px)', 
                        zIndex: 0,
                        pointerEvents: 'none'
                    }} />

                    <Box>
                        {cardImage ? (
                            <TiltCard 
                                src={cardImage}
                                alt={`${bankName} ${cardName}`}
                                height={240}
                                orientation={orientation}
                            />
                        ) : (
                            <Box sx={{ height: 240, width: 380, bgcolor: 'action.hover', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography color="text.secondary">No Image Available</Typography>
                            </Box>
                        )}
                    </Box>
                 </Box>
            </Grid>

            {/* Row 2: Full Width Lounge Access */}
            <Grid item xs={12}>
                 <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                         <FlightTakeoffIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>Lounge Access</Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, textAlign: 'center' }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>DOMESTIC</Typography>
                                <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                                    {data.airportLoungeAccess?.domestic ? renderAccessFrequency(data.airportLoungeAccess.domestic) : 'NA'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, textAlign: 'center' }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>INTERNATIONAL</Typography>
                                <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                                    {data.airportLoungeAccess?.international ? renderAccessFrequency(data.airportLoungeAccess.international) : 'NA'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* Row 3: Full Width Other Perks */}
            {(
                (data.railwayLoungeAccess && data.railwayLoungeAccess !== 'NA' && data.railwayLoungeAccess !== 0 && data.railwayLoungeAccess !== '0' && data.railwayLoungeAccess !== 'Not Available') ||
                (data.golfAccess && data.golfAccess !== 'NA' && data.golfAccess !== 0 && data.golfAccess !== '0' && data.golfAccess !== 'Not Available') ||
                (data.limoAccess && data.limoAccess !== 'NA' && data.limoAccess !== 0 && data.limoAccess !== '0' && data.limoAccess !== 'Not Available')
            ) && (
             <Grid item xs={12}>
                 <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Other Travel Perks</Typography>
                    <Grid container spacing={3}>
                         {data.railwayLoungeAccess && data.railwayLoungeAccess !== 'NA' && data.railwayLoungeAccess !== 0 && data.railwayLoungeAccess !== '0' && data.railwayLoungeAccess !== 'Not Available' && (
                             <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TrainIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="caption" display="block">Railway Lounge</Typography>
                                        <Typography variant="body2" fontWeight="bold">{renderAccessFrequency(data.railwayLoungeAccess)}</Typography>
                                    </Box>
                                </Box>
                             </Grid>
                         )}
                         {data.golfAccess && data.golfAccess !== 'NA' && data.golfAccess !== 0 && data.golfAccess !== '0' && data.golfAccess !== 'Not Available' && (
                             <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <SportsGolfIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="caption" display="block">Golf</Typography>
                                         <Typography variant="body2" fontWeight="bold">{renderAccessFrequency(data.golfAccess)}</Typography>
                                    </Box>
                                </Box>
                             </Grid>
                         )}
                          {data.limoAccess && data.limoAccess !== 'NA' && data.limoAccess !== 0 && data.limoAccess !== '0' && data.limoAccess !== 'Not Available' && (
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AirportShuttleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="caption" display="block">Limo</Typography>
                                         <Typography variant="body2" fontWeight="bold">{renderAccessFrequency(data.limoAccess)}</Typography>
                                    </Box>
                                </Box>
                             </Grid>
                          )}
                    </Grid>
                 </Paper>
             </Grid>
            )}

            {/* Row 4: Full Width Milestone Goals */}
            {goals && goals.length > 0 && (
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                     <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>Milestones/ Goals</Typography>
                     <Grid container spacing={3}>
                        {goals.map((goal, index) => (
                            <Grid item xs={12} key={index}>
                                <Box sx={{ 
                                    p: 3, 
                                    borderRadius: 3, 
                                    bgcolor: 'background.default',
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-2px)' }
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>{goal.name}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>Spend Requirement:</Typography>
                                                <Typography variant="body1" fontWeight="bold" color="primary.dark">
                                                    {formatCurrency(goal.spendsNeeded)} / {goal.period}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ mt: { xs: 2, sm: 0} }}>
                                            {goal.spendCategories?.map(cat => (
                                                <Chip 
                                                    key={cat} 
                                                    label={cat} 
                                                    size="small" 
                                                    sx={{ ml: 0.5, mb: 0.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }} 
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                     </Grid>
                </Paper>
            </Grid>
            )}

            {/* Row 5: Excluded Categories */}
            {data.excludedCategories && data.excludedCategories.length > 0 && (
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                     <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>Excluded Categories</Typography>
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {data.excludedCategories.map((category, index) => (
                            <Chip 
                                key={index} 
                                label={category} 
                                variant="outlined" 
                                size="small"
                                sx={{ borderColor: 'divider' }}
                            />
                        ))}
                     </Box>
                </Paper>
            </Grid>
            )}
          </Grid>
          </>
        )}
      </Container>


      <Dialog open={openDialog} onClose={() => { if(user) setOpenDialog(false); }}>
        <DialogTitle>Sign In Required</DialogTitle>
        <DialogContent>
            <Typography>
                You need to sign in to view detailed card benefits.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => router.push('/')}>Go Home</Button>
            <Button variant="contained" onClick={handleSignIn}>Sign In with Google</Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default CardPage;
