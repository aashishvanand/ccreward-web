import { Box, Container, Typography, Link } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "background.paper",
      }}
      slots={{ root: "footer" }}
    >
      <Container maxWidth="sm" slots={{ root: "div" }}>
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "text.secondary",
            "& > a": {
              ml: 2,
              color: "inherit",
            },
          }}
        >
          © {new Date().getFullYear()} CCReward. All rights reserved.
          <Link color="inherit" href="/terms">
            Terms of Service
          </Link>
          <Link color="inherit" href="/privacy">
            Privacy Policy
          </Link>
          <Link color="inherit" href="/faq">
            FAQs
          </Link>
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "text.secondary",
            mt: 1,
          }}
        >
          Made with ❤️ for credit card enthusiasts
        </Typography>
      </Container>
    </Box>
  );
}
export default Footer;
