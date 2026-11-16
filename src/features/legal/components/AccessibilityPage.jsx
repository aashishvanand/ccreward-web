// src/features/legal/components/AccessibilityPage.jsx
import { useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { useAnalytics } from "@/core/hooks/useAnalytics";

const AccessibilityPage = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("legal_document_accessed", {
      document_type: "accessibility",
    });
  }, [trackEvent]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      slots={{ root: "div" }}
    >
      <Header />
      <Container
        component="main"
        sx={{ mt: 4, mb: 4, flexGrow: 1 }}
        slots={{ root: "main" }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Accessibility
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ mb: 4, color: 'text.secondary' }}>
          Last Updated: October 29, 2026
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{
            '& a': {
              color: 'primary.light',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }
          }}
        >
          <p>
            We want everyone to be able to get the most from their credit
            cards. This page describes the accessibility support in the
            ccreward iOS app, what we are still working on, and how to tell us
            about a problem.
          </p>

          <h2>1. Supported Features</h2>
          <ul>
            <li>
              <strong>Dark Mode:</strong> Every screen, widget and control
              follows your iPhone&apos;s Light or Dark appearance.
            </li>
            <li>
              <strong>Sufficient Contrast:</strong> Text and icons use system
              colors that keep readable contrast in both Light and Dark Mode.
            </li>
            <li>
              <strong>Reduce Motion:</strong> When Reduce Motion is on
              (Settings &gt; Accessibility &gt; Motion), card stack animations,
              pulsing effects, press scaling and screen transitions are turned
              off or replaced with simple fades.
            </li>
          </ul>

          <h2>2. Partially Supported</h2>
          <ul>
            <li>
              <strong>VoiceOver:</strong> Cards, reward results, toggles,
              question choices, search and close buttons have spoken labels,
              and focus returns to the button you used after a sheet closes.
              Some charts and newer screens may not read fully yet.
            </li>
            <li>
              <strong>Larger Text:</strong> Text follows your iPhone&apos;s text
              size setting (Settings &gt; Display &amp; Brightness &gt; Text
              Size). Some screens may truncate text at the largest
              accessibility sizes.
            </li>
            <li>
              <strong>Voice Control:</strong> Buttons with labels can be
              activated by name. Elsewhere, use &quot;Show numbers&quot; or
              &quot;Show grid&quot;.
            </li>
          </ul>

          <h2>3. Other Ways to Use ccreward</h2>
          <ul>
            <li>
              <strong>Siri and Shortcuts:</strong> Find the best card, look up
              an MCC, calculate a reward or check transfer partners by voice,
              without opening the app.
            </li>
            <li>
              <strong>Control Center:</strong> Open MCC Lookup, Best Card or the
              Calculator from Control Center.
            </li>
            <li>
              <strong>Automatic import:</strong> Bank SMS (India and Singapore)
              and Apple Pay purchases can be logged automatically, so you
              don&apos;t have to type them in.
            </li>
            <li>
              <strong>Languages:</strong> The app is available in English,
              Hindi, Tamil, Telugu, Kannada, Bengali and Marathi and follows
              your iPhone&apos;s language.
            </li>
          </ul>

          <h2>4. Known Limitations</h2>
          <ul>
            <li>
              Spending heat maps and charts rely mostly on color and may not be
              fully described to VoiceOver.
            </li>
            <li>
              Third-party ads are provided by Google and may not meet the same
              accessibility standards as the rest of the app.
            </li>
            <li>
              Translations other than English are machine translated and are
              still being reviewed.
            </li>
          </ul>

          <h2>5. Feedback</h2>
          <p>
            If something in ccreward is hard to use with an accessibility
            feature, please email{" "}
            <a href="mailto:support@ccreward.app">support@ccreward.app</a> with
            the screen, the feature you were using (for example VoiceOver or
            Larger Text) and your iOS version. We read every message and use
            it to decide what to fix next.
          </p>
        </Typography>
      </Container>
      <Footer />
    </Box>
  );
};

export default AccessibilityPage;
