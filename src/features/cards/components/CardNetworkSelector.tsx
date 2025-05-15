import { Box, Typography, useTheme, Tooltip, Fade } from "@mui/material";
import { motion } from "framer-motion";

const cardNetworks = [
    { name: "Visa", id: "76167935-fcfc-4098-f3e4-b9d4369f6800" },
    { name: "Mastercard", id: "40969bf0-5dcf-48cd-a617-df61631df000" },
    { name: "RuPay", id: "24b3f814-0f9a-4639-ce66-43c5128c7300" },
    { name: "DinersClub", id: "452de32e-ea1e-46b4-eec8-01f0ebf32c00" },
    { name: "AmEx", id: "55c9ee86-66b6-4540-17f5-0cebd2ae6700" },
    { name: "UnionPay", id: "941e956d-860b-4108-04c6-eafc4c01c200" }
];

// Define region-specific network information
const regionNetworks = {
    IN: {
        include: ["Visa", "Mastercard", "RuPay", "DinersClub", "AmEx"],
        exclude: ["UnionPay"],
        popular: ["RuPay", "Visa", "Mastercard"]
    },
    SG: {
        include: ["Visa", "Mastercard", "UnionPay", "DinersClub", "AmEx"],
        exclude: ["RuPay"],
        popular: ["Visa", "Mastercard", "UnionPay"]
    },
    default: {
        include: ["Visa", "Mastercard", "DinersClub", "AmEx"],
        exclude: [],
        popular: ["Visa", "Mastercard"]
    }
};

// Animation variants
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

export default function CardNetworkSelector({ selectedNetwork, onNetworkChange, region = "IN" }) {
    const theme = useTheme();

    // Get region configuration or use default if not found
    const regionConfig = regionNetworks[region] || regionNetworks.default;

    // Filter networks based on region configuration
    const filteredNetworks = cardNetworks.filter(network =>
        regionConfig.include.includes(network.name) &&
        !regionConfig.exclude.includes(network.name)
    );

    // Sort networks to show popular ones first for this region
    const sortedNetworks = [...filteredNetworks].sort((a, b) => {
        const aPopularIndex = regionConfig.popular.indexOf(a.name);
        const bPopularIndex = regionConfig.popular.indexOf(b.name);

        // If both are in popular list, sort by their position in the popular list
        if (aPopularIndex !== -1 && bPopularIndex !== -1) {
            return aPopularIndex - bPopularIndex;
        }

        // If only one is in popular list, it comes first
        if (aPopularIndex !== -1) return -1;
        if (bPopularIndex !== -1) return 1;

        // If neither is in popular list, maintain original order
        return 0;
    });

    // Get region-specific text
    const getRegionSpecificLabel = () => {
        if (region === "IN") return "Popular in India";
        if (region === "SG") return "Popular in Singapore";
        return "Popular Options";
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
                mt: 1
            }}>
                {sortedNetworks.map((network, index) => {
                    const isPopular = regionConfig.popular.includes(network.name);
                    const isSelected = selectedNetwork === network.name;

                    return (
                        <Tooltip
                            key={network.name}
                            title={network.name}
                            placement="top"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 400 }}
                            arrow
                        >
                            <Box sx={{ position: "relative", textAlign: "center" }}>
                                <motion.div
                                    custom={index}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={networkItemVariants}
                                    animate={isSelected ? "selected" : "visible"}
                                >
                                    <Box
                                        onClick={() => onNetworkChange(network.name)}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            borderRadius: "50%",
                                            border: `2px solid ${isSelected
                                                ? theme.palette.primary.main
                                                : theme.palette.divider}`,
                                            transition: "all 0.2s ease",
                                            backgroundColor: theme.palette.background.paper,
                                            boxShadow: isSelected
                                                ? `0 0 0 3px ${theme.palette.primary.main}40`
                                                : "none",
                                            "&:hover": {
                                                borderColor: theme.palette.primary.main,
                                                boxShadow: `0 0 0 3px ${theme.palette.primary.main}30`
                                            }
                                        }}
                                    >
                                        <img
                                            src={`https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/${network.id}/public`}
                                            alt={network.name}
                                            title={network.name}
                                            style={{
                                                maxWidth: '65%',
                                                maxHeight: '65%',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </Box>
                                </motion.div>

                                {isPopular && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: '0.7rem',
                                            mt: 0.5,
                                            display: 'block',
                                            color: theme.palette.primary.main,
                                            fontWeight: 'medium'
                                        }}
                                    >
                                        Popular
                                    </Typography>
                                )}
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>

            <Box
                sx={{
                    mt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    pt: 1,
                    textAlign: 'center'
                }}
            >
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.75rem' }}
                >
                    {getRegionSpecificLabel()} • Select to continue
                </Typography>
            </Box>
        </Box>
    );
}