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
import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";
import { useAuth } from "../../../core/providers/AuthContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import TrainIcon from "@mui/icons-material/Train";
import SportsGolfIcon from "@mui/icons-material/SportsGolf";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";

const CardPage = ({ bankName, cardName, country }) => {
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [goals, setGoals] = useState(null);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();

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
        const token = await user.getIdToken();
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
        return `${access[available.key]} ${available.label}`;
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container component="main" sx={{ py: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {bankName} {cardName}
        </Typography>

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
          <Grid container spacing={4}>
            {/* Benefits Section */}
            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Travel & Lifestyle Benefits</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <FlightTakeoffIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="subtitle1" fontWeight="bold">Airport Lounge</Typography>
                            </Box>
                            <Box sx={{ ml: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Domestic: {data.airportLoungeAccess?.domestic ? renderAccessFrequency(data.airportLoungeAccess.domestic) : 'NA'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    International: {data.airportLoungeAccess?.international ? renderAccessFrequency(data.airportLoungeAccess.international) : 'NA'}
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TrainIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="subtitle1" fontWeight="bold">Railway Lounge</Typography>
                            </Box>
                             <Box sx={{ ml: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {renderAccessFrequency(data.railwayLoungeAccess)}
                                </Typography>
                             </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <SportsGolfIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="subtitle1" fontWeight="bold">Golf</Typography>
                            </Box>
                             <Box sx={{ ml: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {renderAccessFrequency(data.golfAccess)}
                                </Typography>
                             </Box>
                        </Grid>
                         <Grid item xs={12} sm={6}>
                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <AirportShuttleIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="subtitle1" fontWeight="bold">Limo</Typography>
                            </Box>
                             <Box sx={{ ml: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {renderAccessFrequency(data.limoAccess)}
                                </Typography>
                             </Box>
                        </Grid>
                    </Grid>
                </Paper>

                 {/* Goals Section */}
                 {goals && goals.length > 0 && (
                    <Paper sx={{ p: 3 }}>
                         <Typography variant="h6" gutterBottom>Milestone Goals</Typography>
                         <Grid container spacing={2}>
                            {goals.map((goal, index) => (
                                <Grid item xs={12} key={index}>
                                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">{goal.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Spend {formatCurrency(goal.spendsNeeded)} {goal.period}
                                        </Typography>
                                         <Box sx={{ mt: 1 }}>
                                            {goal.spendCategories?.map(cat => (
                                                <Chip key={cat} label={cat} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                            ))}
                                         </Box>
                                    </Box>
                                </Grid>
                            ))}
                         </Grid>
                    </Paper>
                 )}
            </Grid>

            {/* Side Panel - Financials */}
            <Grid item xs={12} md={4}>
                 <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>Financials</Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Annual Fees</Typography>
                        <Typography variant="h6">{formatCurrency(data.annualFees)}</Typography>
                    </Box>

                     <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Joining Fees</Typography>
                        <Typography variant="h6">{formatCurrency(data.joiningFees)}</Typography>
                    </Box>

                     <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Income Details</Typography>
                        <Typography variant="body1">
                            {data.incomeRequirement === 'NA' ? 'Not Specified' : formatCurrency(data.incomeRequirement)}
                        </Typography>
                    </Box>
                    
                    {data.marketSegment && data.marketSegment !== 'NA' && (
                         <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">Segment</Typography>
                            <Chip label={data.marketSegment} color="primary" variant="outlined" />
                        </Box>
                    )}

                     {data.verdict && data.verdict !== 'NA' && (
                         <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">Verdict</Typography>
                            <Chip 
                                label={data.verdict} 
                                color={data.verdict === 'Take It' ? 'success' : data.verdict === 'Leave It' ? 'error' : 'warning'} 
                            />
                        </Box>
                    )}

                 </Paper>
            </Grid>
          </Grid>
        )}
      </Container>


      <Dialog open={openDialog} onClose={() => { if(user) setOpenDialog(false); }}>
        <DialogTitle>Sign In Required</DialogTitle>
        <DialogContent>
            <Typography>
                You need to sign in to clear security checks and view detailed card benefits.
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
