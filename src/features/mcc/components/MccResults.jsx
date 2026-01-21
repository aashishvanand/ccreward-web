import { Grid, Card, CardContent, Typography, Chip, Box, Skeleton, Divider, Tooltip, useTheme, alpha } from '@mui/material';
import { 
    CategoryOutlined, 
    BusinessOutlined, 
    StoreOutlined,
    AgricultureOutlined,
    BuildOutlined,
    DirectionsBusOutlined,
    ElectricalServicesOutlined,
    ShoppingBagOutlined,
    DirectionsCarOutlined,
    CheckroomOutlined,
    StorefrontOutlined,
    RoomServiceOutlined,
    BusinessCenterOutlined,
    HomeRepairServiceOutlined,
    TheaterComedyOutlined,
    WorkOutlineOutlined,
    AccountBalanceOutlined,
    VerifiedOutlined
} from '@mui/icons-material';

// Map industry names to icons
// All icons return without color props to inherit from parent
const getIndustryIcon = (industryName) => {
    if (!industryName) return <CategoryOutlined />;
    
    const lowerName = industryName.toLowerCase();
    
    if (lowerName.includes('agricultural')) return <AgricultureOutlined />;
    if (lowerName.includes('contracted')) return <BuildOutlined />;
    if (lowerName.includes('transportation')) return <DirectionsBusOutlined />;
    if (lowerName.includes('utilities')) return <ElectricalServicesOutlined />;
    if (lowerName.includes('retail')) return <ShoppingBagOutlined />;
    if (lowerName.includes('automobiles')) return <DirectionsCarOutlined />;
    if (lowerName.includes('clothing')) return <CheckroomOutlined />;
    if (lowerName.includes('miscellaneous')) return <StorefrontOutlined />;
    if (lowerName.includes('service providers')) return <RoomServiceOutlined />;
    if (lowerName.includes('business')) return <BusinessCenterOutlined />;
    if (lowerName.includes('repair')) return <HomeRepairServiceOutlined />;
    if (lowerName.includes('amusement') || lowerName.includes('entertainment')) return <TheaterComedyOutlined />;
    if (lowerName.includes('professional')) return <WorkOutlineOutlined />;
    if (lowerName.includes('government')) return <AccountBalanceOutlined />;
    
    return <StoreOutlined />;
};

const ResultCard = ({ item }) => {
    const theme = useTheme();
    const IndustryIcon = getIndustryIcon(item.industryname || item.industry);
    const category = item.merchantCategory || item.category;
    const knownMerchants = item.knownMerchants || [];

    return (
        <Card sx={{ 
            height: '100%', 
            borderRadius: 4, 
            background: alpha(theme.palette.background.paper, 0.6),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'visible',
            position: 'relative',
            '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                '& .icon-box': {
                    transform: 'scale(1.1) rotate(5deg)',
                    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                }
            }
        }}>
            <CardContent sx={{ p: 3 }}>
                {/* Header: Merchant Name & Icon */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
                    <Box 
                        className="icon-box"
                        sx={{ 
                            p: 1.5, 
                            borderRadius: 3, 
                            // Gradient background to make white icon visible
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2.5,
                            transition: 'all 0.3s ease',
                            width: 56,
                            height: 56,
                            flexShrink: 0,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                        }}>
                        {IndustryIcon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" fontWeight="800" lineHeight={1.3} sx={{ 
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '2.6em', // Fixed height for 2 lines
                        }}>
                            {item.name || item.merchantName || item.merchant || "Unknown Merchant"}
                        </Typography>
                        {item.mcc && (
                            <Chip 
                                label={`MCC: ${item.mcc}`} 
                                size="small" 
                                sx={{ 
                                    fontWeight: 'bold',
                                    borderRadius: 1.5,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                                }}
                            />
                        )}
                    </Box>
                </Box>

                <Divider sx={{ my: 2, borderColor: alpha(theme.palette.divider, 0.1) }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Industry */}
                    {(item.industryname || item.industry) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                                <BusinessOutlined fontSize="small" />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="600" display="block" sx={{ letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                             <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                                <CategoryOutlined fontSize="small" />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="600" display="block" sx={{ letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
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
                        <Box sx={{ 
                            mt: 1, 
                            p: 2, 
                            bgcolor: alpha(theme.palette.background.default, 0.5), 
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.05)}`
                        }}>
                            <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                                <VerifiedOutlined fontSize="inherit" color="action" /> SIMILAR MERCHANTS
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                {knownMerchants.slice(0, 5).map((merchant, idx) => (
                                    <Chip 
                                        key={idx} 
                                        label={merchant} 
                                        size="small" 
                                        variant="outlined"
                                        sx={{ 
                                            fontSize: '0.75rem', 
                                            height: 24,
                                            borderRadius: 1.5,
                                            borderColor: alpha(theme.palette.divider, 0.2),
                                            bgcolor: alpha(theme.palette.background.paper, 0.5)
                                        }} 
                                    />
                                ))}
                                {knownMerchants.length > 5 && (
                                    <Tooltip title={knownMerchants.slice(5).join(', ')} arrow placement="top">
                                        <Chip 
                                            label={`+${knownMerchants.length - 5}`} 
                                            size="small" 
                                            sx={{ 
                                                fontSize: '0.75rem', 
                                                height: 24,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                                fontWeight: 'bold',
                                                cursor: 'help'
                                            }} 
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
    <Card sx={{ height: '100%', borderRadius: 4, bgcolor: 'background.paper' }}>
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2.5, mb: 3 }}>
                <Skeleton variant="rounded" width={56} height={56} sx={{ borderRadius: 3 }} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={24} />
                </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={24} sx={{ mb: 3 }} />
            <Skeleton variant="rounded" width="100%" height={80} sx={{ borderRadius: 3 }} />
        </CardContent>
    </Card>
);

const MccResults = ({ results, isLoading, hasSearched }) => {
    if (isLoading) {
        return (
            <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                        <ResultSkeleton />
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (hasSearched && (!results || results.length === 0)) {
        return (
            <Box sx={{ textAlign: 'center', py: 12, opacity: 0.7 }}>
                <Box sx={{
                    display: 'inline-flex',
                    p: 3,
                    borderRadius: '50%',
                    bgcolor: (theme) => alpha(theme.palette.action.disabledBackground, 0.3),
                    mb: 3
                }}>
                    <CategoryOutlined sx={{ fontSize: 64, color: 'text.secondary' }} />
                </Box>
                <Typography variant="h5" color="text.primary" fontWeight="600" gutterBottom>
                    No merchants found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Try searching for a different merchant name or keyword
                </Typography>
            </Box>
        );
    }

    if (!hasSearched && (!results || results.length === 0)) {
        return (
            <Box sx={{ textAlign: 'center', py: 12, opacity: 0.6 }}>
                 <Box sx={{ mb: 3 }}>
                    <StorefrontOutlined sx={{ fontSize: 80, color: 'action.disabled' }} />
                </Box>
                <Typography variant="h6" color="text.secondary" fontWeight="500">
                    Start typing to search for Merchant Category Codes
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {results.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.mcc + index}>
                    <ResultCard item={item} />
                </Grid>
            ))}
        </Grid>
    );
};

export default MccResults;
