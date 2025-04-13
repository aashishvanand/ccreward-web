import { Box, Typography, useTheme } from "@mui/material";

const cardNetworks = [
    { name: "Visa", id: "76167935-fcfc-4098-f3e4-b9d4369f6800" },
    { name: "Mastercard", id: "40969bf0-5dcf-48cd-a617-df61631df000" },
    { name: "RuPay", id: "24b3f814-0f9a-4639-ce66-43c5128c7300" },
    { name: "DinersClub", id: "452de32e-ea1e-46b4-eec8-01f0ebf32c00" },
    { name: "AmEx", id: "55c9ee86-66b6-4540-17f5-0cebd2ae6700" },
    { name: "UnionPay", id: "941e956d-860b-4108-04c6-eafc4c01c200" }
];

export default function CardNetworkSelector({ selectedNetwork, onNetworkChange, region = "IN" }) {
    const theme = useTheme();

    // Filter networks based on region
    const filteredNetworks = cardNetworks.filter(network =>
        region === 'IN'
            ? network.name !== 'UnionPay'
            : network.name !== 'RuPay'
    );

    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                Card Network
            </Typography>

            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                justifyContent: "center"
            }}>
                {filteredNetworks.map((network) => (
                    <Box
                        key={network.name}
                        onClick={() => onNetworkChange(network.name)}
                        sx={{
                            width: 72,
                            height: 72,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            borderRadius: "50%",
                            border: `2px solid ${selectedNetwork === network.name
                                ? theme.palette.primary.main
                                : theme.palette.divider}`,
                            transition: "all 0.2s ease",
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: selectedNetwork === network.name
                                ? `0 0 0 2px ${theme.palette.primary.main}20`
                                : "none",
                            "&:hover": {
                                borderColor: theme.palette.primary.main,
                                boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`
                            }
                        }}
                    >
                        <img
                            src={`https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/${network.id}/public`}
                            alt={network.name}
                            title={network.name}
                            style={{
                                maxWidth: '70%',
                                maxHeight: '70%',
                                objectFit: 'contain'
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}