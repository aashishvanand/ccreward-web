import { useState } from 'react';
import { Box, Container, Typography, Button, Paper, Fade } from '@mui/material';
import { Flag } from '@mui/icons-material';
import MccSearch from './MccSearch';
import MccResults from './MccResults';
import ReportMccForm from './ReportMccForm';
import { fetchMCC } from '../../../core/services/api';

const MccLookup = () => {
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
        <Container maxWidth="lg" sx={{ py: 4, minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom fontWeight="800"
                    sx={{ 
                        background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    MCC Lookup Tool
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                    Find Merchant Category Codes (MCC) instantly. Search by merchant name to see codes, categories, and industry details.
                </Typography>

                <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                    <MccSearch onSearch={handleSearch} />
                </Box>
            </Box>

            <Box sx={{ flex: 1, mb: 4 }}>
                <MccResults 
                    results={results} 
                    isLoading={isLoading} 
                    hasSearched={hasSearched} 
                />
            </Box>

            <Box sx={{ mt: 'auto', pt: 4, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: 'action.hover', 
                        borderRadius: 4,
                        maxWidth: 600,
                        width: '100%'
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        Can't find a merchant or see incorrect info?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Help the community by reporting missing or incorrect Merchant Category Codes.
                    </Typography>
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        startIcon={<Flag />}
                        onClick={() => setIsReportFormOpen(true)}
                        sx={{ borderRadius: 2, px: 3 }}
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
    );
};

export default MccLookup;
