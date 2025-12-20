import { Grid, Card, CardContent, Typography, Chip, Box, Skeleton, Divider, Tooltip } from '@mui/material';
import { 
    Category, 
    Business, 
    Store,
    Agriculture,
    Build,
    DirectionsBus,
    ElectricalServices,
    ShoppingBag,
    DirectionsCar,
    Checkroom,
    Storefront,
    RoomService,
    BusinessCenter,
    HomeRepairService,
    TheaterComedy,
    Work,
    AccountBalance,
    Info
} from '@mui/icons-material';

// Map industry names to icons
const getIndustryIcon = (industryName) => {
    if (!industryName) return <Category color="action" />;
    
    const lowerName = industryName.toLowerCase();
    
    if (lowerName.includes('agricultural')) return <Agriculture color="success" />;
    if (lowerName.includes('contracted')) return <Build color="secondary" />;
    if (lowerName.includes('transportation')) return <DirectionsBus color="primary" />;
    if (lowerName.includes('utilities')) return <ElectricalServices color="warning" />;
    if (lowerName.includes('retail')) return <ShoppingBag color="secondary" />;
    if (lowerName.includes('automobiles')) return <DirectionsCar color="primary" />;
    if (lowerName.includes('clothing')) return <Checkroom color="secondary" />;
    if (lowerName.includes('miscellaneous')) return <Storefront color="action" />;
    if (lowerName.includes('service providers')) return <RoomService color="info" />;
    if (lowerName.includes('business')) return <BusinessCenter color="primary" />;
    if (lowerName.includes('repair')) return <HomeRepairService color="error" />;
    if (lowerName.includes('amusement') || lowerName.includes('entertainment')) return <TheaterComedy color="secondary" />;
    if (lowerName.includes('professional')) return <Work color="primary" />;
    if (lowerName.includes('government')) return <AccountBalance />;
    
    return <Store color="primary" />;
};

const ResultCard = ({ item }) => {
    const IndustryIcon = getIndustryIcon(item.industryname || item.industry);
    const category = item.merchantCategory || item.category;
    const knownMerchants = item.knownMerchants || [];

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
                {/* Header: Merchant Name & Icon */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        bgcolor: 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                    }}>
                        {IndustryIcon}
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
                            {item.name || item.merchantName || item.merchant || "Unknown Merchant"}
                        </Typography>
                        {item.mcc && (
                            <Chip 
                                label={`MCC: ${item.mcc}`} 
                                color="primary" 
                                size="small" 
                                variant="outlined" 
                                sx={{ mt: 1, fontWeight: 'bold' }}
                            />
                        )}
                    </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* Industry */}
                    {(item.industryname || item.industry) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Business fontSize="small" color="action" sx={{ opacity: 0.7 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Industry
                                </Typography>
                                <Typography variant="body2" fontWeight="500">
                                    {item.industryname || item.industry}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    
                    {/* Category */}
                    {category && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Category fontSize="small" color="action" sx={{ opacity: 0.7 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Category
                                </Typography>
                                <Typography variant="body2" fontWeight="500">
                                    {category}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                     {/* Known Merchants */}
                     {knownMerchants.length > 0 && (
                        <Box sx={{ mt: 1, p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                <Info fontSize="inherit" /> Other merchants in this category:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {knownMerchants.slice(0, 5).map((merchant, idx) => (
                                    <Chip 
                                        key={idx} 
                                        label={merchant} 
                                        size="small" 
                                        sx={{ fontSize: '0.7rem', height: 20 }} 
                                    />
                                ))}
                                {knownMerchants.length > 5 && (
                                    <Tooltip title={knownMerchants.slice(5).join(', ')}>
                                        <Chip 
                                            label={`+${knownMerchants.length - 5} more`} 
                                            size="small" 
                                            variant="outlined"
                                            sx={{ fontSize: '0.7rem', height: 20, cursor: 'help' }} 
                                        />
                                    </Tooltip>
                                )}
                            </Box>
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
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Skeleton variant="rounded" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="30%" />
                </Box>
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width="100%" height={60} sx={{ mt: 2 }} />
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
