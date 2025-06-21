import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Tooltip, Fade, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import { useRegion } from "../../../core/providers/RegionContext";
import PropTypes from 'prop-types';

const networkItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: i => ({
        opacity: 1, scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 20, delay: i * 0.05 }
    }),
    hover: { scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.95 },
    selected: { scale: [1, 1.1, 1], transition: { duration: 0.3 } }
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
                setCardNetworks([]); // Set to empty array on error
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
    
    // Create a new list for rendering to handle networks that might be selected but not in the fetched list
    let displayNetworks = [...cardNetworks];
    const isSelectedInList = cardNetworks.some(item => item.network === selectedNetwork);

    if (selectedNetwork && !isSelectedInList) {
        // Add a placeholder for the selected network if it's not in the fetched data
        displayNetworks.unshift({ network: selectedNetwork, id: null }); 
    }

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{
                display: "flex", flexWrap: "wrap", gap: 2,
                justifyContent: "center", mt: 1
            }}>
                {displayNetworks.map((item, index) => {
                    const isSelected = selectedNetwork === item.network;

                    return (
                        <Tooltip key={item.network} title={item.network} placement="top" TransitionComponent={Fade} TransitionProps={{ timeout: 400 }} arrow>
                            <Box sx={{ position: "relative", textAlign: "center" }}>
                                <motion.div
                                    custom={index} initial="hidden" whileHover="hover" whileTap="tap"
                                    variants={networkItemVariants}
                                    animate={isSelected ? "selected" : "visible"}
                                >
                                    <Box
                                        onClick={() => handleNetworkClick(item.network)}
                                        sx={{
                                            width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: "pointer", borderRadius: "50%",
                                            border: `3px solid ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
                                            transition: "all 0.2s ease",
                                            backgroundColor: isSelected ? `${theme.palette.primary.main}10` : theme.palette.background.paper,
                                            boxShadow: isSelected ? `0 0 0 3px ${theme.palette.primary.main}40` : "none",
                                            "&:hover": {
                                                borderColor: theme.palette.primary.main,
                                                boxShadow: `0 0 0 3px ${theme.palette.primary.main}30`,
                                                backgroundColor: `${theme.palette.primary.main}10`
                                            }
                                        }}
                                    >
                                        {item.id ? (
                                            <img
                                                src={`https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/${item.id}/public`}
                                                alt={item.network}
                                                title={item.network}
                                                style={{ maxWidth: '65%', maxHeight: '65%', objectFit: 'contain' }}
                                                onError={(e) => { e.target.style.display = 'none'; }}
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
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
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