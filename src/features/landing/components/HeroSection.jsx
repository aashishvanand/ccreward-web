// src/features/landing/components/HeroSection.jsx
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  CircularProgress,
  useTheme,
} from "@mui/material";
import HeroCard from "./HeroCard";

const HeroSection = ({
  cardImages,
  isMobile,
  isTablet,
  isLargeScreen,
  handleSignIn,
  isLoading,
  isAuthenticated,
  loading,
  signInWithGoogle,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: "transparent",
        background: theme => theme.palette.mode === 'light' 
          ? `radial-gradient(circle at 50% 0%, ${theme.palette.primary.light}15 0%, transparent 50%), ${theme.palette.background.default}`
          : `radial-gradient(circle at 50% 0%, ${theme.palette.primary.dark}20 0%, transparent 50%), ${theme.palette.background.default}`,
        minHeight: { md: "80vh" }, // Increased height for impact
        display: "flex",
        alignItems: "center",
        pt: { xs: 8, md: 0 }, 
        pb: { xs: 8, md: 0 }, 
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ width: "100%" }}>
        <Grid
          container
          spacing={{ xs: 4, md: 6, lg: 8 }}
          alignItems="center"
          sx={{ minHeight: { md: "60vh" } }} // Ensure grid takes full height
        >
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Typography
              variant="h1" // Upgraded to h1
              sx={{
                fontSize: { xs: "2.5rem", md: "4.5rem" }, // Larger font size
                fontWeight: 800, // Extra bold
                mb: 3,
                lineHeight: 1.1,
                background: theme => theme.palette.mode === 'light'
                  ? `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                  : `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              Maximize Your Rewards with the Right Credit Card
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "text.secondary", // Use theme text color
                mb: 4,
                fontSize: { xs: "1.125rem", md: "1.5rem" },
                lineHeight: 1.4,
              }}
            >
              Compare cards, calculate rewards, and find the perfect credit card
              for your spending habits.
            </Typography>
            {!loading && !isAuthenticated && (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleSignIn(signInWithGoogle)}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                  sx={{
                    height: 48,
                    px: 4,
                    fontSize: "1.125rem",
                  }}
                >
                  Sign in with Google
                </Button>

              </Stack>
            )}
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: { xs: 300, sm: 400, md: "50vh" }, // Adjust height for desktop
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
