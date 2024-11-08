import React from "react";
import { Box, Container, Typography, Grid, Card } from "@mui/material";
import {
  Search as SearchIcon,
  Calculate as CalculateIcon,
  Bolt as BoltIcon,
} from "@mui/icons-material";

const features = [
  {
    icon: <SearchIcon />,
    title: "Compare Top Cards",
    description: "Compare cards from leading banks.",
  },
  {
    icon: <CalculateIcon />,
    title: "Reward Calculator",
    description:
      "Estimate your potential rewards without adding any personal card details.",
  },
  {
    icon: <BoltIcon />,
    title: "Merchant-Specific Rewards",
    description:
      "Find the best card for your favorite merchants based on cashback and rewards.",
  },
];

const FeaturesSection = () => {
  return (
    <Box sx={{ bgcolor: "background.paper", py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 4,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    color: "primary.main",
                    fontSize: "3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {React.cloneElement(feature.icon, { fontSize: "inherit" })}
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  align="center"
                  sx={{ fontWeight: "medium" }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ color: "text.secondary" }}
                >
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
