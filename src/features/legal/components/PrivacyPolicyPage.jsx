// src/features/legal/components/PrivacyPolicyPage.js - Enhanced with Analytics
import { useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { m } from "framer-motion";

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
    <m.div
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
            Last Updated: November 14, 2026
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
                1.1. <strong>Account Information:</strong> You can sign in with
                Google, Apple or a one-time code sent to your email. We collect
                only:
              </p>
              <ul>
                <li>Name (when your sign-in provider shares it)</li>
                <li>Email Address</li>
                <li>A user ID created by Google Firebase Authentication</li>
              </ul>
              <p>
                We do not ask for phone numbers, card numbers, physical
                addresses, or passwords.
              </p>

              <p>
                1.2. <strong>Saved Card Details:</strong> We never collect full
                card numbers (PAN), CVV/CVC codes, PINs, One-Time Passwords
                (OTPs) or bank login details. When you save a card to your
                portfolio, we store:
              </p>
              <ul>
                <li>Bank name and card name, chosen from our list</li>
                <li>Card network (e.g., Visa, Mastercard, RuPay)</li>
                <li>
                  Optionally, if you enter them: the last four digits of the
                  card, its billing date, its credit limit, when you got the
                  card, and whether its annual fee is waived
                </li>
              </ul>
              <p>
                We do not verify card ownership or connect to your bank
                accounts. The last four digits only help you tell your cards
                apart and cannot be used to make payments.
              </p>

              <p>
                1.3. <strong>IP Addresses and Technical Data:</strong> Every
                request to our servers carries your device&apos;s Internet
                Protocol (IP) address. We use it to apply rate limits, block
                bots and abuse, and keep request logs (see section 4). We may
                also collect browser type, pages visited, time spent on pages
                and diagnostic data to improve performance.
              </p>

              <p>
                1.4. <strong>Purchases:</strong> If you buy Premium or
                mcp credits, we store the product, amount, status and
                the transaction ID from the payment provider. Card or bank
                details for the payment are entered with the payment provider
                (see section 5) and never reach us.
              </p>

              <p>
                1.5. <strong>Feedback:</strong> If you send feedback, including
                rating a reward calculation from the website, the apps or an AI
                assistant, we store your message, your vote, the calculation it
                refers to (card, amount, merchant category and result) and your
                user ID.
              </p>

              <p>
                1.6. <strong>Advertising Data:</strong> Our mobile apps
                integrate Google Ads. Google may collect:
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
                  <strong>Improvement:</strong> To analyze usage patterns and
                  feedback to maintain, optimize, and correct the Service.
                </li>
                <li>
                  <strong>Communication:</strong> To send sign-in codes and to
                  contact you regarding critical service updates or support
                  inquiries (we do not use your email for marketing).
                </li>
                <li>
                  <strong>Security:</strong> To apply rate limits and detect,
                  prevent, and address abuse, bots, technical issues or fraud.
                </li>
                <li>
                  <strong>Payments:</strong> To grant and manage Premium and
                  calculation credits, and to handle refunds.
                </li>
                <li>
                  <strong>Advertising:</strong> To serve relevant advertisements
                  in our mobile apps through Google Ads and measure their
                  effectiveness, which supports the free availability of the
                  Service.
                </li>
              </ul>
              <p>We do not sell your personal data.</p>
            </div>

            <div onFocus={() => handleSectionInteraction("data_storage")}>
              <h2>3. Data Storage and Processing</h2>
              <p>
                3.1. <strong>Where Data Is Stored:</strong> Your account (name,
                email, user ID) is stored in Google Firebase Authentication.
                Saved card details, purchase records, feedback and AI assistant
                connections are stored on Cloudflare (D1 database and Workers
                KV).
              </p>
              <p>
                3.2. <strong>Calculations:</strong> Reward calculations, MCC
                lookups and transfer ratio computations run on
                Cloudflare&apos;s global network. The transaction details you
                enter for a calculation are used in real time and are not
                stored, unless you choose to send feedback on that calculation
                (section 1.5).
              </p>
              <p>
                3.3. <strong>Statement Analysis (Premium):</strong> When you
                upload a card statement, the file and the transactions in it
                are processed in memory for that request only. They are not
                saved to any database or file storage, and our logs record only
                counts, never statement content. To read lines our parser does
                not recognize, and for some merchant lookups, the relevant text
                is sent to Cloudflare Workers AI, an AI model hosted by
                Cloudflare, which does not use it to train models.
              </p>
              <p>
                3.4. <strong>Merchant Search Logs:</strong> We may log merchant
                searches to improve results. These logs contain no user ID or
                IP address, digits are masked, and searches that look like
                pasted bank messages are not logged.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("data_retention")}>
              <h2>4. Data Retention and Deletion</h2>
              <p>
                4.1. <strong>Account and Saved Cards:</strong> Kept for as long
                as you keep your account.
              </p>
              <p>
                4.2. <strong>Request Logs:</strong> Server logs, which include
                IP addresses, rate-limit and bot-blocking events, are deleted
                automatically after 7 days.
              </p>
              <p>
                4.3. <strong>AI Assistant Connections:</strong> A connection you
                approve for an AI assistant expires 90 days after you approve
                it, or earlier if you disconnect it (section 6).
              </p>
              <p>
                4.4. <strong>Feedback:</strong> Kept to improve calculation
                accuracy. Email{" "}
                <a href="mailto:support@ccreward.app">support@ccreward.app</a>{" "}
                to have your feedback deleted.
              </p>
              <p>
                4.5. <strong>Purchase Records:</strong> Kept as long as needed
                for accounting, tax and refund obligations, including after
                account deletion.
              </p>
              <p>
                4.6. <strong>Card Deletion:</strong> You can delete individual
                cards from your portfolio at any time directly through the app
                or website.
              </p>
              <p>
                4.7. <strong>Immediate Account Deletion:</strong> We provide a
                Delete Account button within the application and website
                settings.
              </p>
              <ul>
                <li>
                  <strong>Immediate Effect:</strong> Clicking this button
                  immediately deletes your account and saved cards and turns off
                  your MCP API key.
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
              <h2>5. Service Providers and Recipients</h2>
              <p>
                We share data only with the providers below, and only as needed
                to run the Service:
              </p>
              <p>
                5.1. <strong>Google Firebase:</strong> Sign-in, account storage
                and sign-in emails. (See Google Privacy Policy).
              </p>
              <p>
                5.2. <strong>Cloudflare:</strong> Hosting, calculations, data
                storage, bot protection (including Turnstile), request logs and
                Workers AI.
              </p>
              <p>
                5.3. <strong>Payment Providers:</strong> Razorpay, Stripe,
                Apple App Store and Google Play process payments. They receive
                your payment details directly and tell us whether a payment
                succeeded.
              </p>
              <p>
                5.4. <strong>AI Assistants:</strong> If you connect ccreward to
                ChatGPT (OpenAI), Claude (Anthropic) or another AI assistant,
                your requests and our responses pass through that assistant
                (section 6).
              </p>
              <p>
                5.5. <strong>Google Ads:</strong> Used to display
                advertisements in our mobile apps. (See Google Advertising
                Privacy Policy).
              </p>
              <p>
                5.6. <strong>Bank Assets:</strong> Bank names, logos and card
                images are trademarks or copyrights of their respective owners
                and are used solely for identification. ccreward is not
                affiliated with any bank or card issuer.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("ai_assistants")}>
              <h2>6. AI Assistants (MCP)</h2>
              <p>
                6.1. <strong>How It Works:</strong> ccreward can be used from
                AI assistants such as ChatGPT, Claude, Cursor and VS Code
                through the Model Context Protocol (MCP). You connect by
                signing in and approving access (OAuth) or by creating an API
                key on the{" "}
                <a href="https://ccreward.app/mcp">ccreward.app/mcp</a> page.
              </p>
              <p>
                6.2. <strong>What the Assistant Sees:</strong> When you ask the
                assistant a question, it sends us the details needed to answer
                (for example a card, amount or merchant), and our answer,
                including your saved cards if a tool needs them, goes back to
                the assistant. What the assistant does with your conversation
                is covered by that assistant&apos;s own privacy policy, such
                as OpenAI&apos;s or Anthropic&apos;s.
              </p>
              <p>
                6.3. <strong>Connections:</strong> An approved connection lasts
                at most 90 days, after which you need to approve it again. You
                can see your connected apps and disconnect any of them, or
                revoke your API key, at any time on the{" "}
                <a href="https://ccreward.app/mcp">ccreward.app/mcp</a> page.
              </p>
              <p>
                6.4. <strong>Without Signing In (ChatGPT):</strong> Some
                lookup tools work in ChatGPT without a ccreward account. To
                apply a daily usage limit, we use the anonymous identifier
                ChatGPT sends with each request (<code>openai/subject</code>).
                It does not reveal your name or email and is used only for
                daily counts, which are discarded after each day.
              </p>
              <p>
                6.5. <strong>Changing Data:</strong> Assistants can add, update
                or remove saved cards and send feedback only when you are
                signed in, and assistants such as ChatGPT and Claude ask you to
                confirm before a change.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("user_controls")}>
              <h2>7. Your Choices and Rights</h2>
              <ul>
                <li>View, edit or delete your saved cards at any time.</li>
                <li>Disconnect AI assistants and revoke API keys at any time.</li>
                <li>Delete your account immediately from settings.</li>
                <li>
                  Request access to, correction of or deletion of your data, or
                  withdraw consent, by emailing{" "}
                  <a href="mailto:support@ccreward.app">support@ccreward.app</a>.
                </li>
              </ul>
            </div>

            <div onFocus={() => handleSectionInteraction("information_accuracy")}>
              <h2>8. Accuracy of Information</h2>
              <p>
                8.1. Reward calculations are based on publicly available data
                and are for reference only.
              </p>
              <p>
                8.2. Banks may change terms without notice. The bank&apos;s
                official terms are always final and binding.
              </p>
              <p>
                8.3. Users are responsible for verifying calculations with their
                bank before making financial decisions.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("childrens_privacy")}>
              <h2>9. Children&apos;s Privacy</h2>
              <p>
                Our Service is intended only for users aged 18 and above, and
                is not directed at children as defined under India&apos;s
                Digital Personal Data Protection Act, 2023. We do not knowingly
                collect personal data from anyone under 18. If you believe a
                child has provided us with personal data, contact us at{" "}
                <a href="mailto:support@ccreward.app">support@ccreward.app</a>{" "}
                and we will delete it.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("policy_changes")}>
              <h2>10. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &quot;Last Updated&quot; date.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("contact_info")}>
              <h2>11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a href="mailto:support@ccreward.app">support@ccreward.app</a>.
              </p>
            </div>

            <div onFocus={() => handleSectionInteraction("mobile_privacy")}>
              <h2>12. Mobile Application Privacy</h2>
              <p>
                12.1. <strong>Availability:</strong>
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
                12.2. <strong>Permissions:</strong>
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
                12.3. <strong>Mobile Data Sync:</strong>
              </p>
              <ul>
                <li>
                  App data is stored locally for offline access where possible.
                </li>
                <li>
                  When online, user account data synchronizes immediately with
                  our servers.
                </li>
                <li>
                  Using the &quot;Delete Account&quot; feature in the mobile app
                  performs the same immediate deletion as the web version.
                </li>
              </ul>

              <p>
                12.4. <strong>Platform Compatibility:</strong>
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
              <h2>13. Advertising Preferences</h2>
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
    </m.div>
  );
};

export default PrivacyPolicyPage;
