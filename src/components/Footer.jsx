import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{ py: 3, px: 2, mt: "auto", backgroundColor: "background.paper" }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} CCReward. All rights reserved.
          <Link color="inherit" href="/terms" sx={{ ml: 2 }}>
            Terms of Service
          </Link>
          <Link color="inherit" href="/privacy" sx={{ ml: 2 }}>
            Privacy Policy
          </Link>
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 1 }}
        >
          Made with ❤️ for credit card enthusiasts
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
