import { Box, Container, Typography } from '@mui/material';
import Header from '../../../shared/components/layout/Header';
import Footer from '../../../shared/components/layout/Footer';

const TermsOfServicePage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="body1" component="div">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the CCReward application (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of the terms, you may not access the Service.</p>

          <h2>2. Description of Service</h2>
          <p>CCReward is a credit card rewards calculator for India, allowing users to compare cards, calculate rewards, and manage their credit card information.</p>

          <h2>3. Service Infrastructure</h2>
          <p>3.1. CCReward utilizes multiple service providers to deliver its functionality:</p>
          <ul>
            <li>User authentication and data storage are handled through Firebase, a Google Cloud service</li>
            <li>All reward calculations and computational operations are processed on Cloudflare's infrastructure</li>
          </ul>
          <p>3.2. By using the Service, you acknowledge and agree that your data may be processed through these infrastructure providers in accordance with their respective terms of service and our Privacy Policy.</p>


          <h2>4. User Content</h2>
          <p>4.1. You retain all rights to any content you submit, post or display on or through the Service.</p>
          <p>4.2. By submitting, posting or displaying content on or through the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display and distribute such content.</p>

          <h2>5. Intellectual Property</h2>
          <p>5.1. The Service and its original content, features, and functionality are owned by CCReward and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>

          <p>5.2. The source code for CCReward is available at https://github.com/aashishvanand/ccreward-web under a dual license:</p>

          <h3>Open Source License (for non-commercial use)</h3>
          <p>Permission is granted free of charge for non-commercial purposes, subject to the following conditions:</p>
          <ul>
            <li>The copyright notice and permission notice must be included in all copies</li>
            <li>The software must be used for non-commercial purposes only</li>
            <li>Any modifications must be open-sourced under the same terms</li>
          </ul>

          <h3>Commercial License</h3>
          <p>A separate commercial license is required for:</p>
          <ul>
            <li>Using the software as part of a business process</li>
            <li>Incorporating it into a commercial product or service</li>
            <li>Any use intended for commercial advantage or monetary compensation</li>
          </ul>
          <p>Commercial license fees vary based on company size. Contact support@ccreward.app for licensing information.</p>
          <p>5.3. All bank logos, credit card images, and related visual assets displayed on CCReward.app are the property of their respective financial institutions and are used solely for representational purposes. The display of these assets does not imply any endorsement, sponsorship, or official relationship between CCReward.app and the financial institutions.</p>
          <p>5.4. Financial institutions may request the removal of their logos or card images by contacting support@ccreward.app.</p>

          <h2>6. Disclaimer of Accuracy</h2>
          <p>6.1. The reward calculations and information provided by the Service are for reference purposes only and may not always reflect the most current changes in bank reward programs.</p>
          <p>6.2. Banks may modify their reward structures, terms, and conditions at any time without notice. In all cases, the respective bank&apos;s calculation of rewards and their terms and conditions shall be considered final and binding.</p>
          <p>6.3. Users should always verify reward calculations with their respective banks.</p>
          <p>6.4. CCReward.app makes no guarantees about the accuracy of calculations and shall not be held liable for any discrepancies between calculated and actual rewards.</p>

          <h2>7. Termination</h2>
          <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>

          <h2>8. Limitation of Liability</h2>
          <p>In no event shall CCReward, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

          <h2>9. Changes</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.</p>

          <h2>10. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at support@ccreward.app</p>

          <h2>11. Mobile Applications</h2>
          <p>11.1. <strong>App Availability:</strong> CCReward provides mobile applications available through:</p>
          <ul>
            <li>Apple App Store: <a href="https://apps.apple.com/in/app/ccreward/id6736835206">CCReward for iOS</a></li>
            <li>Google Play Store: <a href="https://play.google.com/store/apps/details?id=app.ccreward">CCReward for Android</a></li>
          </ul>

          <p>11.2. <strong>App Store Compliance:</strong></p>
          <ul>
            <li>iOS users are also bound by Apple&apos;s App Store Terms of Service</li>
            <li>Android users are also bound by Google Play Store Terms of Service</li>
            <li>Any in-app purchases or subscriptions will be processed by the respective app stores</li>
          </ul>

          <p>11.3. <strong>Mobile App Updates:</strong></p>
          <ul>
            <li>Updates may be required to maintain app functionality and security</li>
            <li>Users are responsible for keeping their apps updated</li>
            <li>Older versions may cease to function without updates</li>
          </ul>

          <p>11.4. <strong>Mobile App Permissions:</strong></p>
          <ul>
            <li>The app requires certain device permissions to function properly</li>
            <li>Users can manage permissions through their device settings</li>
            <li>Denying essential permissions may limit app functionality</li>
          </ul>

          <p>11.5. <strong>Mobile Data Usage:</strong></p>
          <ul>
            <li>The app uses internet connectivity for reward calculations and data synchronization</li>
            <li>Users are responsible for any data charges incurred while using the app</li>
            <li>Some features may require an active internet connection</li>
          </ul>

          <p>11.6. <strong>Mobile Account Sync:</strong></p>
          <ul>
            <li>User accounts can be accessed across web and mobile platforms</li>
            <li>Data is synchronized between devices when signed in</li>
            <li>Changes made on one platform will reflect across all platforms</li>
          </ul>

          <p>11.7. <strong>Mobile App Support:</strong></p>
          <ul>
            <li>Technical support is provided through support@ccreward.app</li>
            <li>App store reviews are not monitored for support requests</li>
            <li>Users should report issues directly through the support email</li>
          </ul>

          <p>11.8. <strong>Mobile App Termination:</strong></p>
          <ul>
            <li>We reserve the right to terminate or restrict access to the mobile apps</li>
            <li>App store providers may also terminate access according to their policies</li>
            <li>Users can remove the apps from their devices at any time</li>
          </ul>
        </Typography>
      </Container>
      <Footer />
    </Box>
  );
};

export default TermsOfServicePage;