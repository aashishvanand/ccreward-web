import { useState } from 'react';
import { Box, Container, Typography, Button, Paper, Fade, useTheme, alpha } from '@mui/material';
import { Flag, Search } from '@mui/icons-material';
import MccSearch from './MccSearch';
import MccResults from './MccResults';
import ReportMccForm from './ReportMccForm';
import { fetchMCC } from '../../../core/services/api';

const MccLookup = () => {
    const theme = useTheme();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isReportFormOpen, setIsReportFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setIsLoading(true);
        setHasSearched(true);

        try {
            const data = await fetchMCC(query);
            // Ensure data is an array
            setResults(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch MCC data", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReportSuccess = (message, severity) => {
        // You might want to show a snackbar here
        console.log("Report submitted:", message);
    };

    return (
        <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '90vh' }}>
            {/* Ambient Background Elements */}
            <Box sx={{
                position: 'absolute',
                top: -100,
                left: '20%',
                width: 500,
                height: 500,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                filter: 'blur(60px)',
                zIndex: 0,
                animation: 'pulse 10s infinite alternate'
            }} />
             <Box sx={{
                position: 'absolute',
                top: 100,
                right: '10%',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
                filter: 'blur(50px)',
                zIndex: 0
            }} />

            <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant="h2" component="h1" gutterBottom fontWeight="800"
                        sx={{ 
                            background: theme.palette.mode === 'dark' 
                                ? 'linear-gradient(45deg, #90caf9 30%, #ce93d8 90%)'
                                : 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2,
                            fontSize: { xs: '2.5rem', md: '3.5rem' }
                        }}
                    >
                        MCC Lookup Tool
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 650, mx: 'auto', mb: 5, lineHeight: 1.6, fontWeight: 400 }}>
                        Discover Merchant Category Codes instantly. Search by merchant name to uncover detailed codes, categories, and industry insights.
                    </Typography>

                    <Box sx={{ maxWidth: 700, mx: 'auto', position: 'relative' }}>
                         {/* Search glow effect */}
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            height: '80%',
                            background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.2)})`,
                            filter: 'blur(40px)',
                            zIndex: -1,
                        }} />
                        <MccSearch onSearch={handleSearch} />
                    </Box>
                </Box>

                <Box sx={{ flex: 1, mb: 6 }}>
                    <Fade in={true} timeout={800}>
                        <Box>
                             <MccResults 
                                results={results} 
                                isLoading={isLoading} 
                                hasSearched={hasSearched} 
                            />
                        </Box>
                    </Fade>
                </Box>

                <Box sx={{ mt: 'auto', pt: 6, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`, display: 'flex', justifyContent: 'center' }}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 4, 
                            textAlign: 'center', 
                            bgcolor: alpha(theme.palette.background.paper, 0.4),
                            backdropFilter: 'blur(10px)', 
                            borderRadius: 4,
                            maxWidth: 700,
                            width: '100%',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <Search fontSize="small" color="primary" /> Missing Data?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Can't find a merchant or spotted incorrect information? Help improve the database for everyone.
                        </Typography>
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            startIcon={<Flag />}
                            onClick={() => setIsReportFormOpen(true)}
                            sx={{ 
                                borderRadius: 3, 
                                px: 4,
                                py: 1,
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2,
                                    bgcolor: alpha(theme.palette.secondary.main, 0.05)
                                }
                            }}
                        >
                            Report Issue
                        </Button>
                    </Paper>
                </Box>

                <ReportMccForm 
                    open={isReportFormOpen} 
                    onClose={() => setIsReportFormOpen(false)} 
                    onSubmitSuccess={handleReportSuccess}
                />
            </Container>
        </Box>
    );
};

export default MccLookup;
