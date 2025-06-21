import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Tooltip, Fade, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import { useRegion } from "../../../core/providers/RegionContext";
import PropTypes from 'prop-types';

const regionNetworks = {
    IN: {
        include: ["Visa", "Mastercard", "Rupay", "Diners Club", "AmEx"],
        exclude: ["UnionPay"],
        popular: ["Rupay", "Visa", "Mastercard"]
    },
    SG: {
        include: ["Visa", "Mastercard", "UnionPay", "Diners Club", "AmEx"],
        exclude: ["Rupay"],
        popular: ["Visa", "Mastercard", "UnionPay"]
    },
    default: {
        include: ["Visa", "Mastercard", "Diners Club", "AmEx"],
        exclude: [],
        popular: ["Visa", "Mastercard"]
    }
};

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
        scale: [1, 1.1, 1],
        borderColor: "#3A86FF",
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

    const regionConfig = regionNetworks[region] || regionNetworks.default;

    const filteredNetworks = cardNetworks.filter(item =>
        regionConfig.include.includes(item.network) &&
        !regionConfig.exclude.includes(item.network)
    );

    const sortedNetworks = [...filteredNetworks].sort((a, b) => {
        const aPopularIndex = regionConfig.popular.indexOf(a.network);
        const bPopularIndex = regionConfig.popular.indexOf(b.network);
        if (aPopularIndex !== -1 && bPopularIndex !== -1) return aPopularIndex - bPopularIndex;
        if (aPopularIndex !== -1) return -1;
        if (bPopularIndex !== -1) return 1;
        return 0;
    });

    const getRegionSpecificLabel = () => {
        if (region === "IN") return "Popular in India";
        if (region === "SG") return "Popular in Singapore";
        return "Popular Options";
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
    
    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
                mt: 1
            }}>
                {sortedNetworks.map((item, index) => {
                    const isPopular = regionConfig.popular.includes(item.network);
                    const isSelected = selectedNetwork === item.network;

                    return (
                        <Tooltip key={item.network} title={item.network} placement="top" TransitionComponent={Fade} TransitionProps={{ timeout: 400 }} arrow>
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
                                        onClick={() => onNetworkChange(item.network)}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            borderRadius: "50%",
                                            border: `2px solid ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
                                            transition: "all 0.2s ease",
                                            backgroundColor: theme.palette.background.paper,
                                            boxShadow: isSelected ? `0 0 0 3px ${theme.palette.primary.main}40` : "none",
                                            "&:hover": {
                                                borderColor: theme.palette.primary.main,
                                                boxShadow: `0 0 0 3px ${theme.palette.primary.main}30`
                                            }
                                        }}
                                    >
                                        <img
                                            src={`https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/${item.id}/public`}
                                            alt={item.network}
                                            title={item.network}
                                            style={{
                                                maxWidth: '65%',
                                                maxHeight: '65%',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </Box>
                                </motion.div>
                                {isPopular && (
                                    <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5, display: 'block', color: theme.palette.primary.main, fontWeight: 'medium' }}>
                                        Popular
                                    </Typography>
                                )}
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>
            <Box sx={{ mt: 2, borderTop: `1px solid ${theme.palette.divider}`, pt: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {getRegionSpecificLabel()} • Select to continue
                </Typography>
            </Box>
        </Box>
    );
}

// Add prop-types for type checking in JSX
CardNetworkSelector.propTypes = {
  selectedNetwork: PropTypes.string,
  onNetworkChange: PropTypes.func.isRequired,
};