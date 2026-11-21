"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import { CheckCircleRounded } from "@mui/icons-material";
import HeroCard from "./HeroCard";
import SignInButtons from "@/shared/components/auth/SignInButtons";
import { useAuth } from "@/core/providers/AuthContext";

const TRUST_POINTS = [
  "Merchant-specific rewards",
  "Points transfer calculator",
  "No card details needed",
];

// Emphasised phrase inside the subtitle
const Em = ({ children, underline = false }) => (
  <Box
    component="strong"
    sx={{
      color: "text.primary",
      fontWeight: 600,
      ...(underline && {
        // Soft marker-style highlight under the key phrase
        backgroundImage: (theme) =>
          `linear-gradient(transparent 62%, rgba(${theme.vars.palette.primary.mainChannel} / 0.28) 62%)`,
        borderRadius: "2px",
        px: 0.25,
      }),
    }}
  >
    {children}
  </Box>
);

const eyebrowFor = (region) =>
  region === "SG"
    ? "Rewards calculator for Singapore cards"
    : region === "IN"
    ? "Rewards calculator for Indian credit cards"
    : "Credit card rewards calculator";

const HeroSection = ({
  cardImages,
  isMobile,
  isTablet,
  isLargeScreen,
  onGoogleSignIn,
  onAppleSignIn,
  isLoading,
  region,
}) => {
  const { user, loading } = useAuth();

  return (
    <Box
      sx={{
        // Tinted band so the hero reads as its own surface, distinct from the
        // plain background.default sections below it. Vars + scheme-scoped
        // rule keep one stylesheet correct in both modes.
        "&": (theme) => ({
          background: [
            `radial-gradient(55% 60% at 88% 18%, rgba(${theme.vars.palette.secondary.mainChannel} / 0.14) 0%, transparent 70%)`,
            `radial-gradient(50% 55% at 6% 92%, rgba(${theme.vars.palette.primary.mainChannel} / 0.12) 0%, transparent 70%)`,
            `linear-gradient(180deg, rgba(${theme.vars.palette.primary.mainChannel} / 0.05) 0%, rgba(${theme.vars.palette.primary.mainChannel} / 0.09) 100%)`,
            theme.vars.palette.background.default,
          ].join(", "),
          ...theme.applyStyles("dark", {
            background: [
              `radial-gradient(55% 60% at 88% 18%, rgba(${theme.vars.palette.secondary.mainChannel} / 0.18) 0%, transparent 70%)`,
              `radial-gradient(50% 55% at 6% 92%, rgba(${theme.vars.palette.primary.mainChannel} / 0.16) 0%, transparent 70%)`,
              `linear-gradient(180deg, rgba(${theme.vars.palette.primary.mainChannel} / 0.06) 0%, rgba(${theme.vars.palette.primary.mainChannel} / 0.12) 100%)`,
              theme.vars.palette.background.default,
            ].join(", "),
          }),
        }),
        borderBottom: 1,
        borderColor: "divider",
        minHeight: { md: "80vh" },
        display: "flex",
        alignItems: "center",
        py: { xs: 8, md: 6 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ width: "100%" }}>
        <Grid
          container
          spacing={{ xs: 4, md: 6, lg: 8 }}
          sx={{ alignItems: "center", minHeight: { md: "60vh" } }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.5,
                mb: 3,
                borderRadius: 999,
                border: 1,
                borderColor: (theme) =>
                  `rgba(${theme.vars.palette.primary.mainChannel} / 0.35)`,
                bgcolor: (theme) =>
                  `rgba(${theme.vars.palette.primary.mainChannel} / 0.10)`,
                color: "primary.main",
                fontSize: "0.8125rem",
                fontWeight: 600,
                letterSpacing: "0.01em",
              }}
            >
              <Box
                component="span"
                aria-hidden="true"
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "currentColor",
                }}
              />
              {eyebrowFor(region)}
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4.25rem" },
                fontWeight: 800,
                mb: 3,
                lineHeight: 1.08,
                "&": (theme) => ({
                  backgroundImage: `linear-gradient(90deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.secondary.main} 100%)`,
                  ...theme.applyStyles("dark", {
                    backgroundImage: `linear-gradient(90deg, ${theme.vars.palette.primary.light} 0%, ${theme.vars.palette.secondary.light} 100%)`,
                  }),
                }),
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.025em",
                textWrap: "balance",
              }}
            >
              Maximize Your Rewards with the Right Credit Card
            </Typography>

            <Typography
              component="p"
              sx={{
                color: "text.secondary",
                mb: 4,
                maxWidth: { md: "32rem" },
                fontSize: { xs: "1.125rem", md: "1.3125rem" },
                fontWeight: 400,
                lineHeight: 1.6,
                textWrap: "pretty",
              }}
            >
              <Em>Compare</Em> cards, <Em>calculate</Em> rewards on every
              spend, and <Em underline>find the perfect card</Em> for the way
              you shop.
            </Typography>

            {!loading && !user ? (
              <Box sx={{ maxWidth: 320 }}>
                <SignInButtons
                  onGoogleSignIn={onGoogleSignIn}
                  onAppleSignIn={onAppleSignIn}
                  isLoading={isLoading}
                  fullWidth
                  size="large"
                />
              </Box>
            ) : null}

            <Box
              component="ul"
              sx={{
                listStyle: "none",
                p: 0,
                m: 0,
                mt: 4,
                display: "flex",
                flexWrap: "wrap",
                columnGap: 3,
                rowGap: 1.25,
              }}
            >
              {TRUST_POINTS.map((point) => (
                <Box
                  component="li"
                  key={point}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    color: "text.secondary",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                  }}
                >
                  <CheckCircleRounded
                    aria-hidden="true"
                    sx={{ fontSize: 18, color: "success.main" }}
                  />
                  {point}
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                height: { xs: 300, sm: 400, md: "50vh" },
                width: "100%",
                maxWidth: { xs: 320, sm: 400, md: "100%" },
                margin: "0 auto",
              }}
            >
              {cardImages.map((card, index) => (
                <HeroCard
                  key={card.id}
                  card={card}
                  index={index}
                  isMobile={isMobile}
                  isTablet={isTablet}
                  isLargeScreen={isLargeScreen}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
