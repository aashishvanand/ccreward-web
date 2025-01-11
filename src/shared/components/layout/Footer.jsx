import { Box, Container, Typography, Link, Stack, IconButton, Divider } from "@mui/material";
import { Twitter, Instagram, Reddit } from '@mui/icons-material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: "auto",
        backgroundColor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Stack direction="row" spacing={2} sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Follow Us
            </Typography>
            <IconButton 
              href="https://x.com/ccrewardapp" 
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              color="inherit"
              sx={{ 
                '&:hover': { 
                  color: 'primary.main',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                } 
              }}
            >
              <Twitter />
            </IconButton>
            <IconButton 
              href="https://www.instagram.com/ccrewardapp/" 
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              color="inherit"
              sx={{ 
                '&:hover': { 
                  color: 'primary.main',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                } 
              }}
            >
              <Instagram />
            </IconButton>
            <IconButton 
              href="https://www.reddit.com/r/ccreward/" 
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              color="inherit"
              sx={{ 
                '&:hover': { 
                  color: 'primary.main',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                } 
              }}
            >
              <Reddit />
            </IconButton>
          </Stack>

          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={{ xs: 1, sm: 3 }}
            alignItems="center"
          >
            <Link 
              href="/terms" 
              color="inherit" 
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' }
              }}
            >
              Terms of Service
            </Link>
            <Link 
              href="/privacy" 
              color="inherit"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' }
              }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="/faq" 
              color="inherit"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' }
              }}
            >
              FAQs
            </Link>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            © {new Date().getFullYear()} CCReward. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Made with ❤️ for credit card enthusiasts
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;