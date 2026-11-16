"use client";

import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  alpha,
} from "@mui/material";
import { ArrowForward as ArrowForwardIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";

const sectionSx = { p: { xs: 3, md: 4 }, mb: 4, borderRadius: 4, border: "1px solid", borderColor: "divider" };

/**
 * Public explainer for a signed-in tool. tool: one entry of TOOL_PAGES; others: the rest, for links.
 */
function ToolExplainerPage({ tool, others = [] }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Container component="main" maxWidth="md" sx={{ py: { xs: 3, md: 5 }, flexGrow: 1 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <MuiLink component={Link} href="/" underline="hover" color="inherit">
            Home
          </MuiLink>
          <MuiLink component={Link} href="/tools" underline="hover" color="inherit">
            Tools
          </MuiLink>
          <Typography sx={{ color: "text.primary" }}>{tool.name}</Typography>
        </Breadcrumbs>

        <Paper
          elevation={0}
          sx={(theme) => ({
            ...sectionSx,
            p: { xs: 3, md: 5 },
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
          })}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 800, mb: 2, fontSize: { xs: "1.75rem", sm: "2.25rem" }, lineHeight: 1.2 }}
          >
            {tool.name}
          </Typography>
          {tool.intro.map((p) => (
            <Typography key={p.slice(0, 32)} sx={{ color: "text.secondary", mb: 2 }}>
              {p}
            </Typography>
          ))}
          <Button
            component={Link}
            href={tool.toolPath}
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ borderRadius: 2, px: 4, mt: 1 }}
          >
            {tool.cta}
          </Button>
          <Typography variant="caption" component="p" sx={{ color: "text.secondary", mt: 1.5 }}>
            Free. Sign in with Google or Apple to use it.
          </Typography>
        </Paper>

        <Paper elevation={0} sx={sectionSx}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            How it works
          </Typography>
          <Box component="ol" sx={{ m: 0, pl: 3, "& li": { mb: 1 } }}>
            {tool.steps.map((step) => (
              <Typography component="li" key={step}>
                {step}
              </Typography>
            ))}
          </Box>
        </Paper>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {tool.features.map(([title, text]) => (
            <Grid key={title} size={{ xs: 12, sm: 6 }}>
              <Paper elevation={0} sx={{ ...sectionSx, mb: 0, p: 3, height: "100%" }}>
                <Typography component="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Questions
          </Typography>
          {tool.faqs.map(([q, a]) => (
            <Accordion key={q} disableGutters elevation={0} sx={{ border: "1px solid", borderColor: "divider", "&:not(:last-of-type)": { borderBottom: 0 } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography component="h3" sx={{ fontWeight: 600 }}>
                  {q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: "text.secondary" }}>{a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {others.length > 0 && (
          <Paper elevation={0} sx={sectionSx}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
              More ccreward tools
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5, "& li": { mb: 0.75 } }}>
              {others.map((t) => (
                <li key={t.slug}>
                  <MuiLink component={Link} href={`/tools/${t.slug}`} underline="hover">
                    {t.name}
                  </MuiLink>
                </li>
              ))}
              <li>
                <MuiLink component={Link} href="/in/top-cards" underline="hover">
                  Best credit cards in India by category
                </MuiLink>
              </li>
              <li>
                <MuiLink component={Link} href="/sg/top-cards" underline="hover">
                  Best credit cards in Singapore by category
                </MuiLink>
              </li>
            </Box>
          </Paper>
        )}
      </Container>
      <Footer />
    </Box>
  );
}

export default ToolExplainerPage;
