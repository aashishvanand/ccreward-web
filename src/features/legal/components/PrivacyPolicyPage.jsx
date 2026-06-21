// src/features/legal/components/PrivacyPolicyPage.js - Enhanced with Analytics
import { useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { motion } from "framer-motion";

// Add analytics imports
import {
  useAnalytics,
  usePagePerformance,
  useEngagementTracking,
  useComponentAnalytics,
} from "@/core/hooks";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const PrivacyPolicyPage = () => {
  // Analytics hooks
  const { trackFeatureUsage, trackEvent } = useAnalytics();
  const { recordCustomMetric } = usePagePerformance("privacy-policy");
  const { trackCustomEngagement } = useEngagementTracking();
  const { trackComponentInteraction } =
    useComponentAnalytics("PrivacyPolicyPage");

  // Track page load
  useEffect(() => {
    trackFeatureUsage("privacy_policy_loaded", {
      source: "legal_pages",
      device_type: window.innerWidth < 768 ? "mobile" : "desktop",
    });

    trackEvent("legal_document_accessed", {
      document_type: "privacy_policy",
      access_timestamp: new Date().toISOString(),
    });

    recordCustomMetric("page_load_time", performance.now());
  }, [trackFeatureUsage, trackEvent, recordCustomMetric]);

  // Track scroll engagement for legal document
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );

      // Track reading progress at key milestones
      if ([25, 50, 75, 90].includes(scrollPercent)) {
        trackCustomEngagement("privacy_policy_reading_progress", {
          progress_percentage: scrollPercent,
          reading_milestone: `${scrollPercent}%`,
        });

        trackEvent("legal_document_progress", {
          document_type: "privacy_policy",
          progress_percentage: scrollPercent,
          estimated_reading_time: performance.now(),
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [trackCustomEngagement, trackEvent]);

  // Track section interactions
  const handleSectionInteraction = (sectionName) => {
    trackComponentInteraction("privacy_section_focus", {
      section_name: sectionName,
      interaction_type: "section_view",
    });
  };

  // Track page exit
  useEffect(() => {
    return () => {
      trackEvent("privacy_policy_exit", {
        time_on_page: performance.now(),
        document_type: "privacy_policy",
      });
    };
  }, [trackEvent]);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
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
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
          >
            Privacy Policy
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 4, color: 'text.secondary' }}>
            Last Updated: January 2, 2026
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
            <div onFocus={() => handleSectionInteraction("information_collection")}>
              <h2>1. Information We Collect</h2>
              <p>
                1.1. <strong>Personal Information:</strong> When you create an
                account via Google Authentication, we collect only the following
                information:
              </p>
              <ul>
                <li>Name</li>
                <li>Email Address</li>
              </ul>
              <p>
                We explicitly do not collect phone numbers, physical addresses,
                passwords, or any other personal identifiers.
              </p>

              <p>
                1.2. <strong>Financial Data (Card Selection):</strong> We do not
                collect, store, or process sensitive financial information such
                as Credit Card Numbers (PAN), CVV/CVC codes, PINs, or One-Time
                Passwords (OTPs).
              </p>
              <ul>
                <li>
                  <strong>Card Management:</strong> When you add a card to your
                  portfolio, we only store the Bank Name and Card Name that you
                  select from our predefined list.
                </li>
                <li>
                  <strong>No Verification:</strong> We do not verify card
                  ownership or link to your actual bank accounts.
                </li>
              </ul>

              <p>
                1.3. <strong>Usage Data:</strong> We may collect information on
                how the Service is accessed and used to improve performance.
                This includes your device&apos;s Internet Protocol (IP) address,
                browser type, pages visited, time spent on pages, and diagnostic
                data.
              </p>

              <p>
                1.4. <strong>Advertising Data:</strong> Our app integrates
                Google Ads. Google may collect:
              </p>
              <ul>
                <li>Device identifiers (e.g., Advertising ID).</li>
                <li>Interaction data (e.g., clicks, impressions).</li>
                <li>
                  General demographic/interest data based on app usage.
                </li>
              </ul>
            </div>

            <div onFocus={() => handleSectionInteraction("data_usage")}>
              <h2>2. How We Use Your Information</h2>
              <p>
                We use the limited information we collect strictly for the
                following purposes:
              </p>
              <ul>
                <li>
                  <strong>Service Provision:</strong> To provide the core
                  functionality of ccreward and its card
                  management tools.
                </li>
                <li>
                  <strong>Improvement:</strong> To analyze usage patterns to
                  maintain, optimize, and enhance the Service.
                </li>
                <li>
                  <strong>Communication:</strong> To contact you regarding
                  critical service updates or support inquiries (we do not use
                  your email for marketing spam).
                </li>
                <li>
                  <strong>Security:</strong> To detect, prevent, and address
                  technical issues or fraud.
                </li>
                <li>
                  <strong>Advertising:</strong> To serve relevant advertisements
                  through Google Ads and measure their effectiveness, which
                  supports the free availability of the Service.
                </li>
              </ul>
            </div>

            <div onFocus={() => handleSectionInteraction("data_storage")}>
              <h2>3. Data Storage and Processing</h2>
              <p>
                3.1. <strong>Secure Storage:</strong> Your account profile
                (Name, Email) and card portfolio (List of Card Names) are stored
                in Firebase, a Google Cloud service. We rely on Google&apos;s
                industry-leading security measures to protect this data.
              </p>
              <p>
                3.2. <strong>Computation (No Retention):</strong> All reward
                calculations, MCC lookups, and transfer ratio computations are
                processed on Cloudflare&apos;s global infrastructure. These
                calculations are performed in real-time and the specific
                transaction details entered for calculation are not permanently
                stored.
              </p>
              <p>
                3.3. <strong>Processing Locations:</strong> While user data is
                stored securely in Firebase, calculations utilize
                Cloudflare&apos;s global network to ensure fast, low-latency
                service delivery regardless of your location.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("data_retention")}>
              <h2>4. Data Retention and Deletion</h2>
              <p>
                4.1. <strong>Retention:</strong> We retain your basic profile
                information only as long as you maintain an active account to
                provide you with the Service.
              </p>
              <p>
                4.2. <strong>Card Deletion:</strong> You can delete individual
                cards from your portfolio at any time directly through the app
                or website interface.
              </p>
              <p>
                4.3. <strong>Immediate Account Deletion:</strong> We provide a
                Delete Account button within the application and website
                settings.
              </p>
              <ul>
                <li>
                  <strong>Immediate Effect:</strong> Clicking this button
                  immediately wipes your profile and associated data from our
                  Firebase database.
                </li>
                <li>
                  <strong>Verification:</strong> You can verify this by
                  attempting to log in again; the system will treat you as a
                  completely new user with no prior history.
                </li>
                <li>No email request or waiting period is required.</li>
              </ul>
            </div>

            <div
              onFocus={() => handleSectionInteraction("third_party_services")}
            >
              <h2>5. Third-Party Services</h2>
              <p>
                5.1. <strong>Google Firebase:</strong> Used for secure
                authentication and database storage. (See Google Privacy
                Policy).
              </p>
              <p>
                5.2. <strong>Google Ads:</strong> Used to display
                advertisements. (See Google Advertising Privacy Policy).
              </p>
              <p>
                5.3. <strong>Bank Assets:</strong> Bank logos and card images
                are property of their respective institutions and are used
                solely for identification.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("information_accuracy")}>
              <h2>6. Accuracy of Information</h2>
              <p>
                6.1. Reward calculations are based on publicly available data
                and are for reference only.
              </p>
              <p>
                6.2. Banks may change terms without notice. The bank&apos;s
                official terms are always final and binding.
              </p>
              <p>
                6.3. Users are responsible for verifying calculations with their
                bank before making financial decisions.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("childrens_privacy")}>
              <h2>7. Children&apos;s Privacy</h2>
              <p>
                Our Service does not address anyone under the age of 13. We do
                not knowingly collect personally identifiable information from
                children under 13.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("policy_changes")}>
              <h2>8. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &quot;Last Updated&quot; date.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("contact_info")}>
              <h2>9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a href="mailto:support@ccreward.app">support@ccreward.app</a>.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("mobile_privacy")}>
              <h2>10. Mobile Application Privacy</h2>
              <p>
                10.1. <strong>Availability:</strong>
              </p>
              <ul>
                <li>
                  iOS: Apple App Store{" "}
                  <a href="https://apps.apple.com/in/app/ccreward/id6736835206">
                    https://apps.apple.com/in/app/ccreward/id6736835206
                  </a>
                </li>
                <li>
                  Android: Google Play Store{" "}
                  <a href="https://play.google.com/store/apps/details?id=app.ccreward">
                    https://play.google.com/store/apps/details?id=app.ccreward
                  </a>
                </li>
              </ul>

              <p>
                10.2. <strong>Permissions:</strong>
              </p>
              <ul>
                <li>
                  <strong>Internet:</strong> Required for calculations and
                  syncing.
                </li>
                <li>
                  <strong>Storage:</strong> Minimal use for caching images
                  (logos) to improve performance.
                </li>
              </ul>

              <p>
                10.3. <strong>Mobile Data Sync:</strong>
              </p>
              <ul>
                <li>
                  App data is stored locally for offline access where possible.
                </li>
                <li>
                  When online, user account data synchronizes immediately with
                  our Firebase database.
                </li>
                <li>
                  Using the &quot;Delete Account&quot; feature in the mobile app
                  performs the same immediate deletion as the web version.
                </li>
              </ul>

              <p>
                10.4. <strong>Platform Compatibility:</strong>
              </p>
              <ul>
                <li>
                  Web: <a href="https://ccreward.app">https://ccreward.app</a>
                </li>
                <li>iOS: iOS 18.0 or later</li>
                <li>Android: Android 10.0 or later</li>
              </ul>
            </div>

            <div
              onFocus={() =>
                handleSectionInteraction("advertising_preferences")
              }
            >
              <h2>11. Advertising Preferences</h2>
              <p>
                Users can manage their advertising preferences and opt-out of
                personalized ads by:
              </p>
              <ul>
                <li>
                  Adjusting device settings (e.g., &quot;Limit Ad Tracking&quot;
                  on iOS or &quot;Opt Out of Ads Personalization&quot; on
                  Android).
                </li>
                <li>
                  Visiting Google Ad Settings.
                </li>
              </ul>
            </div>
          </Typography>
        </Container>
        <Footer />
      </Box>
    </motion.div>
  );
};

export default PrivacyPolicyPage;
