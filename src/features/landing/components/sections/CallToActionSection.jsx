import { Box, Container, Typography, Button, Stack } from "@mui/material";

const CallToActionSection = ({
  isAuthenticated,
  handleSignIn,
  signInWithGoogle,
}) => {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        py: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Ready to Maximize Your Rewards?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              opacity: 0.9,
            }}
          >
            Start comparing cards and maximizing your rewards today.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default CallToActionSection;
