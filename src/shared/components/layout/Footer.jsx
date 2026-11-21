"use client";

import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  IconButton,
  Divider,
  GlobalStyles,
} from "@mui/material";
import { Twitter, Instagram, Reddit, Telegram } from "@mui/icons-material";
import { m } from "framer-motion";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/core/providers/AuthContext";
import { resetAnalyticsConsent } from "@/core/services/consent";

// Only loaded when a signed-in user opens it
const AppFeedbackDialog = dynamic(() => import("../ui/AppFeedbackDialog"), { ssr: false });

// Animation variants
const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const socialIconVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15,
    },
  },
  hover: {
    y: -5,
    scale: 1.2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.9 },
};

const SOCIAL_LINKS = [
  { href: "https://x.com/ccrewardapp", label: "Follow ccreward on X (Twitter)", Icon: Twitter },
  { href: "https://www.instagram.com/ccrewardapp/", label: "Follow ccreward on Instagram", Icon: Instagram },
  { href: "https://www.reddit.com/r/ccreward/", label: "Join ccreward on Reddit", Icon: Reddit },
  { href: "https://t.me/ccrewardapp", label: "Join ccreward on Telegram", Icon: Telegram },
];

const EXPLORE_LINKS = [
  { href: "/tools", label: "Tools" },
  { href: "/howto", label: "How-to Guides" },
  { href: "/faq", label: "FAQs" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/accessibility", label: "Accessibility" },
];

const columnHeadingSx = {
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "text.secondary",
  mb: 1.5,
};

const linkSx = {
  width: "fit-content",
  fontSize: "0.9375rem",
  lineHeight: 1.5,
  textDecoration: "none",
  transition: "color 0.2s ease",
  "&:hover": { color: "primary.main" },
};

const buttonLinkSx = {
  font: "inherit",
  fontSize: "0.9375rem",
  lineHeight: 1.5,
  p: 0,
  textAlign: "left",
  verticalAlign: "baseline",
};

function Footer() {
  const { user } = useAuth();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={footerVariants}
    >
      <Box
        component="footer"
        sx={{
          pt: { xs: 5, md: 6 },
          pb: 4,
          px: 2,
          mt: "auto",
          backgroundColor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                md: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)",
              },
              columnGap: { xs: 3, md: 6 },
              rowGap: 4,
              pb: 4,
            }}
          >
            {/* Brand + social */}
            <Box sx={{ gridColumn: { xs: "1 / -1", md: "auto" } }}>
            <m.div variants={itemVariants}>
              <Typography
                component="p"
                sx={{ fontWeight: 700, fontSize: "1.125rem", mb: 1 }}
              >
                ccreward
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", maxWidth: 360, mb: 2 }}
              >
                Compare cards, calculate rewards and find the right credit card
                for how you spend.
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: -1 }}
                aria-label="Follow ccreward"
                role="group"
              >
                {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                  <m.div
                    key={href}
                    variants={socialIconVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <IconButton
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      color="inherit"
                      aria-label={label}
                    >
                      <Icon aria-hidden="true" fontSize="small" />
                    </IconButton>
                  </m.div>
                ))}
              </Box>
            </m.div>
            </Box>

            <m.nav variants={itemVariants} aria-label="Explore">
              <Typography component="p" sx={columnHeadingSx}>
                Explore
              </Typography>
              <Stack spacing={1.25}>
                {EXPLORE_LINKS.map(({ href, label }) => (
                  <Link key={href} href={href} color="inherit" sx={linkSx}>
                    {label}
                  </Link>
                ))}
                {user && (
                  <Link
                    component="button"
                    type="button"
                    color="inherit"
                    onClick={() => setFeedbackOpen(true)}
                    sx={{ ...linkSx, ...buttonLinkSx }}
                  >
                    Send feedback
                  </Link>
                )}
              </Stack>
            </m.nav>

            <m.nav variants={itemVariants} aria-label="Legal">
              <Typography component="p" sx={columnHeadingSx}>
                Legal
              </Typography>
              <Stack spacing={1.25}>
                {LEGAL_LINKS.map(({ href, label }) => (
                  <Link key={href} href={href} color="inherit" sx={linkSx}>
                    {label}
                  </Link>
                ))}
                <Link
                  component="button"
                  type="button"
                  color="inherit"
                  onClick={() => {
                    // Clears the stored analytics choice and reloads, so
                    // the consent notice reappears for a fresh decision.
                    resetAnalyticsConsent();
                    window.location.reload();
                  }}
                  sx={{ ...linkSx, ...buttonLinkSx }}
                >
                  Analytics choices
                </Link>
              </Stack>
            </m.nav>
          </Box>

          <Divider />

          <m.div variants={itemVariants}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 1,
                pt: 3,
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                © {new Date().getFullYear()} ccreward. All rights reserved.
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Made with{" "}
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    color: "error.main",
                    animation: "heartbeat 1.5s infinite",
                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                  }}
                >
                  ❤️
                </Box>{" "}
                for credit card enthusiasts
              </Typography>
            </Box>
            <Typography
              variant="caption"
              component="p"
              sx={{ color: "text.secondary", mt: 2, opacity: 0.8 }}
            >
              ccreward is an independent tool and is not affiliated with,
              endorsed by, or sponsored by any bank or card issuer. Bank names,
              logos and card images are trademarks or copyrights of their
              respective owners and are used only for identification.
            </Typography>
          </m.div>
        </Container>
      </Box>
      {/* Add keyframes for heartbeat animation */}
      <GlobalStyles
        styles={{
          "@keyframes heartbeat": {
            "0%": { transform: "scale(1)" },
            "15%": { transform: "scale(1.25)" },
            "30%": { transform: "scale(1)" },
            "45%": { transform: "scale(1.25)" },
            "60%": { transform: "scale(1)" },
          },
        }}
      />
      {feedbackOpen && <AppFeedbackDialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />}
    </m.div>
  );
}

export default Footer;
