import { useState, useMemo } from 'react';
import { Box, Container, Typography, Button, Paper, Fade, useTheme, alpha } from '@mui/material';
import { Flag, Search } from '@mui/icons-material';
import MccSearch from './MccSearch';
import MccResults from './MccResults';
import ReportMccForm from './ReportMccForm';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';
import PageHeader from '@/shared/components/layout/PageHeader';
import { fetchMCC } from '@/core/services/api';

const MccLookup = () => {
    const theme = useTheme();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isReportFormOpen, setIsReportFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Read mcc URL parameter for deep linking
    const initialMcc = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('mcc') || '';
    }, []);

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

    };

    return (
        <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            {/* Ambient Background Elements */}
            <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <PageHeader 
                    title="MCC Lookup Tool" 
                    subtitle="Search by merchant name to find category codes and industry details."
                >
                    <MccSearch onSearch={handleSearch} initialValue={initialMcc} />
                </PageHeader>

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
                        <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{
                                fontWeight: "700",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1
                            }}>
                            <Search fontSize="small" color="primary" /> Missing Data?
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary",
                                mb: 3
                            }}>
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
            <Footer />
        </Box>
    );
};

export default MccLookup;
