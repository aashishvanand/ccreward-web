import { Grid, Card, CardContent, Typography, Chip, Box, Skeleton } from '@mui/material';
import { Category, Business, Store } from '@mui/icons-material';

const ResultCard = ({ item }) => {
    // Determine color based on MCC range or category if desired
    // For now using default theme colors

    return (
        <Card sx={{ 
            height: '100%', 
            borderRadius: 3, 
            boxShadow: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
            }
        }}>
            <CardContent>
                <Typography variant="h6" component="div" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Store color="primary" fontSize="small" />
                    {item.merchantName || item.merchant}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip 
                        label={`MCC: ${item.mcc}`} 
                        color="secondary" 
                        variant="filled" 
                        size="medium" 
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {item.industry && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Business fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                {item.industry}
                            </Typography>
                        </Box>
                    )}
                    
                    {(item.merchantCategory || item.category) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Category fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                {item.merchantCategory || item.category}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

const ResultSkeleton = () => (
    <Card sx={{ height: '100%', borderRadius: 3 }}>
        <CardContent>
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width={80} height={32} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="70%" />
        </CardContent>
    </Card>
);

const MccResults = ({ results, isLoading, hasSearched }) => {
    if (isLoading) {
        return (
            <Grid container spacing={2}>
                {[1, 2, 3, 4].map((i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                        <ResultSkeleton />
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (hasSearched && (!results || results.length === 0)) {
        return (
            <Box sx={{ textAlign: 'center', py: 8, opacity: 0.7 }}>
                <Category sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    No merchants found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Try searching for a different merchant name
                </Typography>
            </Box>
        );
    }

    if (!hasSearched && (!results || results.length === 0)) {
        return (
            <Box sx={{ textAlign: 'center', py: 10, opacity: 0.6 }}>
                <Typography variant="body1" color="text.secondary">
                    Start typing to search for Merchant Category Codes
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={2}>
            {results.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={item.mcc + index}>
                    <ResultCard item={item} />
                </Grid>
            ))}
        </Grid>
    );
};

export default MccResults;
