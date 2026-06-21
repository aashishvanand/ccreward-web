import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  useTheme,
} from "@mui/material";
import { LocationOn, VpnKey } from "@mui/icons-material";

const RegionSelectionModal = ({ open, onRegionSelect, detectedCountry }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showVpnNotice, setShowVpnNotice] = useState(false);
  const theme = useTheme();

  const regions = [
    {
      code: "IN",
      name: "India",
      flag: "🇮🇳",
      description: "Access Indian credit cards and rewards",
      popular: true,
    },
    {
      code: "SG",
      name: "Singapore",
      flag: "🇸🇬",
      description: "Access Singapore credit cards and rewards",
      popular: true,
    },
  ];

  useEffect(() => {
    // Show VPN notice if detected country is not IN or SG
    if (detectedCountry && !["IN", "SG"].includes(detectedCountry)) {
      setShowVpnNotice(true);
    }
  }, [detectedCountry]);

  const handleRegionSelect = (regionCode) => {
    setSelectedRegion(regionCode);
  };

  const handleConfirm = () => {
    if (selectedRegion) {
      onRegionSelect(selectedRegion);
    }
  };

  const handleDialogClose = (_event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
  };

  const getNoticeMessage = () => {
    if (detectedCountry) {
      return `We detected you're browsing from ${detectedCountry}. Since ccreward currently supports India and Singapore, please select the region most relevant to you.`;
    }
    return "We couldn't detect your location. Please select your region to continue.";
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }
        },

        paper: {
          sx: {
            borderRadius: 3,
            maxWidth: '500px',
            m: 2,
          }
        }
      }}>
      <DialogContent sx={{ p: 4, pb: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <LocationOn 
            sx={{ 
              fontSize: 60, 
              color: 'primary.main', 
              mb: 2,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }} 
          />
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              mb: 1
            }}
          >
            Choose Your Region
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: '1rem'
            }}>
            Select your region to access relevant credit card data
          </Typography>
        </Box>

        {/* VPN/Country Notice */}
        {(showVpnNotice || detectedCountry) && (
          <Alert 
            severity="info" 
            icon={<VpnKey />}
            sx={{ mb: 3 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Region Selection Required
            </Typography>
            <Typography variant="body2">
              {getNoticeMessage()}
            </Typography>
          </Alert>
        )}

        {/* Region Options */}
        <Box sx={{ mb: 3 }}>
          {regions.map((region) => (
            <Card
              key={region.code}
              sx={{
                mb: 2,
                cursor: 'pointer',
                border: 2,
                borderColor: selectedRegion === region.code ? 'primary.main' : 'divider',
                backgroundColor: selectedRegion === region.code ? 'primary.50' : 'background.paper',
                transition: 'transform 0.3s ease-in-out, border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out',
                transform: selectedRegion === region.code ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selectedRegion === region.code ? 4 : 1,
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'primary.50',
                  transform: 'scale(1.01)',
                  boxShadow: 3,
                }
              }}
              onClick={() => handleRegionSelect(region.code)}
            >
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Typography 
                    variant="h3" 
                    component="span"
                    sx={{ fontSize: '2.5rem' }}
                  >
                    {region.flag}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography 
                        variant="h6" 
                        component="h3"
                        sx={{ fontWeight: 600 }}
                      >
                        {region.name}
                      </Typography>
                      {region.popular && (
                        <Chip
                          label="Supported"
                          size="small"
                          color="success"
                          variant="filled"
                          sx={{ 
                            fontSize: '0.75rem',
                            height: 20,
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: '0.9rem'
                      }}>
                      {region.description}
                    </Typography>
                  </Box>
                  {selectedRegion === region.code && (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 2,
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'white', 
                          fontSize: 16,
                          fontWeight: 'bold'
                        }}
                      >
                        ✓
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 4, pt: 0 }}>
        <Box sx={{ width: '100%' }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleConfirm}
            disabled={!selectedRegion}
            sx={{ 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: selectedRegion ? 3 : 1,
              '&:hover': {
                boxShadow: selectedRegion ? 6 : 1,
                transform: selectedRegion ? 'translateY(-1px)' : 'none',
              },
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            }}
          >
            {selectedRegion
              ? `Continue with ${regions.find(r => r.code === selectedRegion)?.name}`
              : "Select a region to continue"}
          </Button>
          
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: 'block',
              textAlign: 'center',
              mt: 2,
              fontSize: '0.8rem',
              lineHeight: 1.4
            }}>
            You can change your region later using the region selector in the header
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default RegionSelectionModal;
