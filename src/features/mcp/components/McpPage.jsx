"use client";

import { Box, Container, CircularProgress, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "@/core/providers/AuthContext";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import PageHeader from "@/shared/components/layout/PageHeader";
import McpMarketing from "./McpMarketing";
import McpDashboard from "./McpDashboard";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

function McpPage() {
  const { user, isAuthenticated, loading } = useAuth();

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "transparent",
        }}
      >
        <Header />
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              minHeight: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
            <Stack spacing={4}>
              <PageHeader
                title="MCP Access"
                subtitle="Bring ccreward into Claude Code and other MCP clients — calculate rewards, compare cards, and look up MCC codes right from your workflow."
              />
              {isAuthenticated() && user ? <McpDashboard /> : <McpMarketing />}
            </Stack>
          </Container>
        )}
        <Footer />
      </Box>
    </motion.div>
  );
}

export default McpPage;
