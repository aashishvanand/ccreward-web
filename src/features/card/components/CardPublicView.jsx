"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  alpha,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useAuth } from "@/core/providers/AuthContext";
import useCardImagesData from "@/core/hooks/useCardImagesData";
import TiltCard from "@/shared/components/ui/TiltCard";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import SignInDialog from "@/shared/components/auth/SignInDialog";

const ordinal = (n) => {
  const suffix = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
};

const LinkList = ({ title, items }) => (
  <Paper
    elevation={0}
    sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: "1px solid", borderColor: "divider", height: "100%" }}
  >
    <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
      {title}
    </Typography>
    <Box component="ul" sx={{ m: 0, pl: 2.5, lineHeight: 2 }}>
      {items.map((item) => (
        <li key={item.url}>
          <MuiLink component={Link} href={item.url} underline="hover">
            {item.label}
          </MuiLink>
        </li>
      ))}
    </Box>
  </Paper>
);

// Public, server-rendered card overview for signed-out visitors and crawlers.
// Fees, reward rates and benefits stay behind sign-in (see CardPage).
const CardPublicView = ({
  bankName,
  cardName,
  country,
  countryName,
  bankUrl,
  topPickCategories = [],
  similarCards = [],
  relatedCards = [],
}) => {
  const theme = useTheme();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const { cardImagesData } = useCardImagesData();

  const cardImage = useMemo(
    () =>
      cardImagesData?.find(
        (item) =>
          item.bank.toLowerCase() === bankName.toLowerCase() &&
          item.cardName.toLowerCase() === cardName.toLowerCase()
      ),
    [cardImagesData, bankName, cardName]
  );
  const orientation = cardImage?.orientation || "horizontal";

  const handleSignIn = async (signIn) => {
    try {
      await signIn();
      setOpenDialog(false);
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <MuiLink component={Link} href={`/${country}`} underline="hover" color="inherit">
            {countryName}
          </MuiLink>
          <MuiLink component={Link} href={bankUrl} underline="hover" color="inherit">
            {bankName} Credit Cards
          </MuiLink>
          <Typography sx={{ color: "text.primary" }}>{cardName}</Typography>
        </Breadcrumbs>

        {/* HERO */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
          }}
        >
          <Grid container spacing={4} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {cardImage?.id ? (
                  <TiltCard
                    src={cardImage.id}
                    alt={`${bankName} ${cardName} credit card`}
                    height={orientation === "vertical" ? 320 : 220}
                    orientation={orientation}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 220,
                      width: "100%",
                      maxWidth: 349,
                      bgcolor: alpha(theme.palette.divider, 0.3),
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CreditCardIcon sx={{ fontSize: 64, color: "text.disabled" }} />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Chip label={bankName} size="small" sx={{ mb: 2, fontWeight: 600 }} />
              <Typography
                variant="h3"
                component="h1"
                sx={{ fontWeight: 800, mb: 2, fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" }, lineHeight: 1.2 }}
              >
                {bankName} {cardName} Credit Card
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 3 }}>
                {topPickCategories.length > 0
                  ? `The ${bankName} ${cardName} is one of ccreward's top picks in ${countryName} for ${topPickCategories
                      .slice(0, 3)
                      .map((c) => c.name.toLowerCase())
                      .join(", ")}. `
                  : `An overview of the ${bankName} ${cardName} credit card in ${countryName}. `}
                Sign in to see its joining and annual fees, reward rates by spend category, airport lounge
                access, milestone benefits and excluded categories, and to calculate your exact rewards.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<LockOutlinedIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{ borderRadius: 2, px: 4 }}
              >
                Sign in to see fees & rewards
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* TOP PICK CATEGORIES */}
        {topPickCategories.length > 0 && (
          <Paper
            elevation={0}
            sx={{ p: { xs: 3, md: 4 }, mb: 4, borderRadius: 4, border: "1px solid", borderColor: "divider" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <EmojiEventsIcon color="warning" />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                Where the {bankName} {cardName} ranks
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {topPickCategories.map((category) => (
                <Chip
                  key={category.name}
                  component={Link}
                  href={category.url}
                  clickable
                  label={`${ordinal(category.rank)} for ${category.name}`}
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Box>
          </Paper>
        )}

        <Grid container spacing={3}>
          {similarCards.length > 0 && (
            <Grid size={{ xs: 12, md: relatedCards.length > 0 ? 6 : 12 }}>
              <LinkList
                title={`Alternatives to the ${bankName} ${cardName}`}
                items={similarCards.map((c) => ({ url: c.url, label: `${c.bank} ${c.name}` }))}
              />
            </Grid>
          )}
          {relatedCards.length > 0 && (
            <Grid size={{ xs: 12, md: similarCards.length > 0 ? 6 : 12 }}>
              <LinkList
                title={`Other ${bankName} credit cards`}
                items={[
                  ...relatedCards.map((c) => ({ url: c.url, label: `${bankName} ${c.name}` })),
                  { url: bankUrl, label: `View all ${bankName} credit cards in ${countryName}` },
                ]}
              />
            </Grid>
          )}
        </Grid>
      </Container>

      <SignInDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onGoogleSignIn={() => handleSignIn(signInWithGoogle)}
        onAppleSignIn={() => handleSignIn(signInWithApple)}
        title="Sign In"
        message="Sign in to view detailed card benefits, fees, and exclusive features."
        icon={<CreditCardIcon sx={{ fontSize: 64, color: "primary.main", opacity: 0.8 }} />}
        onCancel={() => setOpenDialog(false)}
      />
      <Footer />
    </Box>
  );
};

export default CardPublicView;
