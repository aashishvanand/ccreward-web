import { Box, Container, Typography, Button } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy"; // Robot icon for GPT
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const CustomGPTSection = ({ theme }) => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            }}
          >
            <SmartToyIcon sx={{ fontSize: 32 }} />
          </Box>

          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontWeight: "bold",
              fontSize: { xs: "1.75rem", sm: "2.5rem" },
              background: (theme) =>
                theme.palette.mode === "light"
                  ? `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`
                  : `linear-gradient(90deg, ${theme.palette.success.light} 0%, ${theme.palette.primary.light} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Experience ccreward inside ChatGPT
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            Tired of scrolling through menus? Just ask.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: "700px",
              mb: 4,
              color: "text.secondary",
              lineHeight: 1.7,
              fontSize: "1.1rem",
            }}
          >
            ccreward.app is now available as a <strong>ccreward GPT</strong>. 
            Currently supporting MCC search and reward calculations, it communicates directly 
            with our backend to provide the same accurate, real-time data you see on our web and mobile apps.
          </Typography>

          <Button
            variant="contained"
            size="large"
            href="https://chatgpt.com/g/g-6954dd72c4d08191af836ec7ca3faf26-ccreward-gpt"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<SmartToyIcon />}
            endIcon={<OpenInNewIcon />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 3,
              fontSize: "1.1rem",
              textTransform: "none",
              boxShadow: (theme) => `0 8px 20px ${theme.palette.primary.main}40`,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: (theme) => `0 12px 24px ${theme.palette.primary.main}60`,
              },
            }}
          >
            Chat with ccreward GPT
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CustomGPTSection;
