import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import { Twitter, Instagram, Reddit, Telegram } from "@mui/icons-material";
import { motion } from "framer-motion";

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

const linkVariants = {
  hover: {
    scale: 1.05,
    color: "primary.main",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
    },
  },
  tap: { scale: 0.95 },
};

function Footer() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={footerVariants}
    >
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
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <motion.div variants={itemVariants}>
              <Stack direction="row" spacing={2} sx={{ mb: { xs: 2, md: 0 } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Follow Us
                </Typography>

                <motion.div
                  variants={socialIconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <IconButton
                    href="https://x.com/ccrewardapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    color="inherit"
                  >
                    <Twitter />
                  </IconButton>
                </motion.div>

                <motion.div
                  variants={socialIconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <IconButton
                    href="https://www.instagram.com/ccrewardapp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    color="inherit"
                  >
                    <Instagram />
                  </IconButton>
                </motion.div>

                <motion.div
                  variants={socialIconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <IconButton
                    href="https://www.reddit.com/r/ccreward/"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    color="inherit"
                  >
                    <Reddit />
                  </IconButton>
                </motion.div>

                <motion.div
                  variants={socialIconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <IconButton
                    href="https://t.me/ccrewardapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    color="inherit"
                  >
                    <Telegram />
                  </IconButton>
                </motion.div>
              </Stack>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 3 }}
                alignItems="center"
              >
                {["terms", "privacy", "howto", "faq"].map((page, idx) => (
                  <motion.div
                    key={page}
                    variants={linkVariants}
                    whileHover="hover"
                    whileTap="tap"
                    custom={idx}
                  >
                    <Link
                      href={`/${page}`}
                      color="inherit"
                      sx={{
                        textDecoration: "none",
                      }}
                    >
                      {page === "terms"
                        ? "Terms of Service"
                        : page === "privacy"
                        ? "Privacy Policy"
                        : page === "howto"
                        ? "How-to Guides"
                        : "FAQs"}
                    </Link>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>
          </Box>

          <motion.div variants={itemVariants}>
            <Divider sx={{ my: 2 }} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                © {new Date().getFullYear()} ccreward. All rights reserved.
              </Typography>

              <motion.div
                initial={{ opacity: 0.6 }}
                whileHover={{
                  opacity: 1,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Made with{" "}
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      color: "error.main",
                      animation: "heartbeat 1.5s infinite",
                    }}
                  >
                    ❤️
                  </Box>{" "}
                  for credit card enthusiasts
                </Typography>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Add keyframes for heartbeat animation */}
      <style jsx global>{`
        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          15% {
            transform: scale(1.25);
          }
          30% {
            transform: scale(1);
          }
          45% {
            transform: scale(1.25);
          }
          60% {
            transform: scale(1);
          }
        }
      `}</style>
    </motion.div>
  );
}

export default Footer;
