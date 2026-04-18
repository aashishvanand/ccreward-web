import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Tooltip, Fade, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import { useRegion } from "@/core/providers/RegionContext";
import PropTypes from 'prop-types';
import { buildCloudflareImageUrl } from "@/core/utils/cloudflareImages";

const networkItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: i => ({
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: i * 0.05
        }
    }),
    hover: {
        scale: 1.1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    },
    tap: { scale: 0.95 },
    selected: {
        opacity: 1, // This is the fix: ensures the icon remains visible
        scale: [1, 1.1, 1],
        transition: {
            duration: 0.3
        }
    }
};

export default function CardNetworkSelector({ selectedNetwork, onNetworkChange }) {
    const theme = useTheme();
    const { region } = useRegion();
    const [cardNetworks, setCardNetworks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCardNetworks = async () => {
            if (!region) return;

            setIsLoading(true);
            try {
                const response = await fetch(`https://files.ccreward.app/cardNetworks_${region.toLowerCase()}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch card networks for region: ${region}`);
                }
                const data = await response.json();
                setCardNetworks(data);
            } catch (error) {
                console.error("Error fetching card networks:", error);
                setCardNetworks([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCardNetworks();
    }, [region]);

    const handleNetworkClick = (networkName) => {
        onNetworkChange(networkName);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", mt: 1 }}>
                {Array.from(new Array(5)).map((_, index) => (
                    <Skeleton key={index} variant="circular" width={80} height={80} />
                ))}
            </Box>
        );
    }
    
    let displayNetworks = [...cardNetworks];
    const isSelectedInList = cardNetworks.some(item => item.network === selectedNetwork);

    if (selectedNetwork && !isSelectedInList) {
        displayNetworks.unshift({ network: selectedNetwork, id: null }); 
    }

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
                mt: 1
            }}>
                {displayNetworks.map((item, index) => {
                    const isSelected = selectedNetwork === item.network;

                    return (
                        <Tooltip key={item.network} title={item.network} placement="top" arrow slots={{
                            transition: Fade
                        }} slotProps={{
                            transition: { timeout: 400 }
                        }}>
                            <Box sx={{ position: "relative", textAlign: "center" }}>
                                <motion.div
                                    custom={index}
                                    initial="hidden"
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={networkItemVariants}
                                    animate={isSelected ? "selected" : "visible"}
                                >
                                    <Box
                                        onClick={() => handleNetworkClick(item.network)}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            borderRadius: "50%",
                                            border: `3px solid ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
                                            transition: "border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
                                            backgroundColor: isSelected 
                                                ? `${theme.palette.primary.main}10` 
                                                : theme.palette.background.paper,
                                            boxShadow: isSelected 
                                                ? `0 0 0 3px ${theme.palette.primary.main}40` 
                                                : "none",
                                            "&:hover": {
                                                borderColor: theme.palette.primary.main,
                                                boxShadow: `0 0 0 3px ${theme.palette.primary.main}30`,
                                                backgroundColor: `${theme.palette.primary.main}10`
                                            }
                                        }}
                                    >
                                        {item.id ? (
                                            <img
                                                src={buildCloudflareImageUrl(item.id, "public")}
                                                alt={item.network}
                                                title={item.network}
                                                style={{ maxWidth: '65%', maxHeight: '65%', objectFit: 'contain' }}
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                                {item.network}
                                            </Typography>
                                        )}
                                    </Box>
                                </motion.div>
                                {isSelected && (
                                    <Box sx={{
                                        position: 'absolute', top: -5, right: -5, width: 24, height: 24, borderRadius: '50%',
                                        backgroundColor: theme.palette.primary.main, display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold'
                                    }}>
                                        ✓
                                    </Box>
                                )}
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>
            <Box sx={{ mt: 2, borderTop: `1px solid ${theme.palette.divider}`, pt: 1, textAlign: 'center' }}>
                <Typography
                    variant="caption"
                    sx={{
                        color: "text.secondary",
                        fontSize: '0.75rem'
                    }}>
                    {selectedNetwork ? `Selected: ${selectedNetwork}` : "Select a card network to continue"}
                </Typography>
            </Box>
        </Box>
    );
}

CardNetworkSelector.propTypes = {
  selectedNetwork: PropTypes.string,
  onNetworkChange: PropTypes.func.isRequired,
};
