// src/features/legal/components/TermsOfServicePage.js - Enhanced with Analytics
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
} from "@/core/hooks/useAnalytics";

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

const TermsOfServicePage = () => {
  // Analytics hooks
  const { trackFeatureUsage, trackEvent } = useAnalytics();
  const { recordCustomMetric } = usePagePerformance("terms-of-service");
  const { trackCustomEngagement } = useEngagementTracking();
  const { trackComponentInteraction } =
    useComponentAnalytics("TermsOfServicePage");

  // Track page load
  useEffect(() => {
    trackFeatureUsage("terms_of_service_loaded", {
      source: "legal_pages",
      device_type: window.innerWidth < 768 ? "mobile" : "desktop",
    });

    trackEvent("legal_document_accessed", {
      document_type: "terms_of_service",
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
        trackCustomEngagement("terms_reading_progress", {
          progress_percentage: scrollPercent,
          reading_milestone: `${scrollPercent}%`,
        });

        trackEvent("legal_document_progress", {
          document_type: "terms_of_service",
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
    trackComponentInteraction("terms_section_focus", {
      section_name: sectionName,
      interaction_type: "section_view",
    });
  };

  // Track external link clicks
  const handleLinkClick = (linkType, url) => {
    trackEvent("legal_external_link_click", {
      document_type: "terms_of_service",
      link_type: linkType,
      destination: url,
    });
  };

  // Track page exit
  useEffect(() => {
    return () => {
      trackEvent("terms_of_service_exit", {
        time_on_page: performance.now(),
        document_type: "terms_of_service",
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
      >
        <Header />
        <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
<Typography variant="h4" component="h1" gutterBottom>
            Terms of Service
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
            <div onFocus={() => handleSectionInteraction("acceptance")}>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the ccreward application (&quot;the Service&quot;),
                you agree to be bound by these Terms of Service (&quot;Terms&quot;). If
                you disagree with any part of the terms, you may not access the
                Service.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("service_description")}>
              <h2>2. Description of Service</h2>
              <p>
                ccreward is a comprehensive credit card rewards comparison and
                management tool for users in India and Singapore. The Service
                allows users to:
              </p>
              <ul>
                <li>Calculate reward points for specific transactions.</li>
                <li>
                  Identify the best card to use for a given transaction to
                  maximize returns.
                </li>
                <li>Perform Merchant Category Code (MCC) lookups.</li>
                <li>
                  Calculate and compare reward transfer ratios to partner
                  airlines and hotels.
                </li>
                <li>
                  Manage a portfolio of credit cards for tracking purposes.
                </li>
              </ul>
            </div>

            <div
              onFocus={() => handleSectionInteraction("service_infrastructure")}
            >
              <h2>3. Service Infrastructure</h2>
              <p>
                3.1. ccreward utilizes industry-leading service providers to
                deliver its functionality:
              </p>
              <ul>
                <li>
                  <strong>Authentication & Storage:</strong> User authentication
                  and data storage are handled through Firebase, a Google Cloud
                  service.
                </li>
                <li>
                  <strong>Computation:</strong> All reward calculations and
                  computational operations are processed on Cloudflare&apos;s
                  infrastructure.
                </li>
              </ul>
              <p>
                3.2. <strong>Advertising:</strong> The Service integrates Google
                Ads to display relevant advertisements to users. By using the
                Service, you acknowledge that third-party providers such as
                Google may collect and process data for ad delivery and
                performance measurement in accordance with their respective
                privacy policies.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("user_content")}>
              <h2>4. User Content & Data Rights</h2>
              <p>
                4.1. You retain all rights to any content or data you submit to
                the Service.
              </p>
              <p>
                4.2. <strong>Limited License:</strong> By entering data into the
                Service, you grant us a worldwide, royalty-free license to use,
                copy, reproduce, process, and display such content solely for
                the purpose of providing the Service to you. We do not sell,
                publish, or distribute your personal financial data to public
                third parties.
              </p>
              <p>
                4.3. By using the Service, you consent to the use of anonymized
                data for personalized advertisements, where applicable. You may
                manage your advertising preferences through your device settings
                or Google&apos;s Ad Settings page.
              </p>
            </div>

            <div
              onFocus={() => handleSectionInteraction("intellectual_property")}
            >
              <h2>5. Intellectual Property</h2>
              <p>
                5.1. The Service and its original content (including calculation
                algorithms, source code, and unique functionality) are owned by
                ccreward and are protected by international copyright,
                trademark, patent, trade secret, and other intellectual property
                laws. This ownership claim excludes third-party assets such as
                bank logos and card images, as described in Section 5.3.
              </p>
              <p>
                5.2. The source code for ccreward is available at{" "}
                <a
                  href="https://github.com/aashishvanand/ccreward-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    handleLinkClick(
                      "github_repo",
                      "https://github.com/aashishvanand/ccreward-web"
                    )
                  }
                >
                  https://github.com/aashishvanand/ccreward-web
                </a>{" "}
                under a dual license:
              </p>
              <ul>
                <li>
                  <strong>Open Source License:</strong> Permission is granted
                  free of charge for non-commercial purposes, provided the
                  copyright notice is included and modifications are
                  open-sourced.
                </li>
                <li>
                  <strong>Commercial License:</strong> A separate license is
                  required for business use or incorporation into commercial
                  products. Contact{" "}
                  <a
                    href="mailto:support@ccreward.app"
                    onClick={() =>
                      handleLinkClick(
                        "support_email",
                        "mailto:support@ccreward.app"
                      )
                    }
                  >
                    support@ccreward.app
                  </a>{" "}
                  for details.
                </li>
              </ul>
              <p>
                5.3. All bank logos, credit card images, and related visual
                assets displayed on ccreward.app are the property of their
                respective financial institutions and are used solely for
                representational and identification purposes. The display of
                these assets does not imply any endorsement, sponsorship, or
                official relationship between ccreward.app and the financial
                institutions.
              </p>
              <p>
                5.4. Financial institutions may request the removal of their
                logos or card images by contacting{" "}
                <a
                  href="mailto:support@ccreward.app"
                  onClick={() =>
                    handleLinkClick(
                      "support_email",
                      "mailto:support@ccreward.app"
                    )
                  }
                >
                  support@ccreward.app
                </a>
                .
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("data_privacy")}>
              <h2>6. Data Privacy, Security & PCI DSS</h2>
              <p>
                6.1. <strong>No Sensitive Payment Data:</strong> ccreward does
                not collect, store, or process sensitive payment credentials
                such as full Credit Card Numbers (PAN), CVV/CVC codes, PINs, or
                One-Time Passwords (OTPs).
              </p>
              <p>
                6.2. <strong>Card Selection:</strong> To add a card to their
                portfolio, users strictly select the Bank and Card Name from a
                predefined list. The Service does not verify ownership of the
                selected cards and does not link to bank accounts.
              </p>
              <p>
                6.3. <strong>Security & Compliance:</strong> We prioritize the
                security of your data.
              </p>
              <ul>
                <li>
                  All data is stored and processed using Google Firebase and
                  Cloudflare, both of which are PCI DSS Level 1 Service Provider
                  certified.
                </li>
                <li>
                  By leveraging this certified infrastructure, ccreward ensures
                  that the environment hosting your data meets rigorous industry
                  security standards.
                </li>
              </ul>
            </div>

            <div onFocus={() => handleSectionInteraction("disclaimer")}>
              <h2>7. Disclaimer of Accuracy</h2>
              <p>
                7.1. The reward calculations, transfer ratios, and MCC data
                provided by the Service are for reference purposes only and may
                not reflect real-time changes in bank reward programs.
              </p>
              <p>
                7.2. Banks may modify their reward structures, transfer
                partners, terms, and conditions at any time without notice. The
                respective bank&apos;s calculation of rewards and their official
                terms shall be considered final and binding.
              </p>
              <p>
                7.3. <strong>User Verification:</strong> Users should always
                verify reward calculations and transfer ratios directly with
                their respective banks before making significant financial
                decisions or transfers.
              </p>
              <p>
                7.4. ccreward.app shall not be held liable for any discrepancies
                between calculated/projected rewards and actual rewards credited
                by the bank.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("termination")}>
              <h2>8. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the
                Service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever, including but
                not limited to a breach of the Terms.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("liability")}>
              <h2>9. Limitation of Liability</h2>
              <p>
                In no event shall ccreward, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from your
                access to or use of or inability to access or use the Service.
                ccreward is not liable for any actions or data collection
                practices by third-party advertisers.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("mobile_apps")}>
              <h2>10. Mobile Applications</h2>
              <p>
                10.1. <strong>Availability:</strong> ccreward is available on
                the Apple App Store (iOS) and Google Play Store (Android).
              </p>
              <p>
                10.2. <strong>Store Compliance:</strong> Users are subject to
                the Terms of Service of the respective app store (Apple or
                Google) in addition to these Terms.
              </p>
              <p>
                10.3. <strong>Permissions & Updates:</strong> The app requires
                certain device permissions (e.g., internet access) to function.
                Users are responsible for keeping the app updated to ensure
                security and functionality.
              </p>
              <p>
                10.4. <strong>Account Sync:</strong> User data is synchronized
                securely across devices (Web, iOS, Android) when signed in.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("changes")}>
              <h2>11. Changes</h2>
              <p>
                We reserve the right to modify or replace these Terms at any
                time. By continuing to access or use our Service after any
                revisions become effective, you agree to be bound by the revised
                terms.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("contact")}>
              <h2>12. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at{" "}
                <a
                  href="mailto:support@ccreward.app"
                  onClick={() =>
                    handleLinkClick(
                      "support_email",
                      "mailto:support@ccreward.app"
                    )
                  }
                >
                  support@ccreward.app
                </a>
                .
              </p>
            </div>
          </Typography>
        </Container>
        <Footer />
      </Box>
    </motion.div>
  );
};

export default TermsOfServicePage;
