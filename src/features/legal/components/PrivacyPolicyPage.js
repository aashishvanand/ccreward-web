import { Box, Container, Typography } from '@mui/material';
import Header from '../../../shared/components/layout/Header';
import Footer from '../../../shared/components/layout/Footer';

const PrivacyPolicyPage = () => {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      slots={{ root: 'div' }}
    >
      <Header />
      <Container
        component="main"
        sx={{ mt: 4, mb: 4, flexGrow: 1 }}
        slots={{ root: 'main' }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" component="div">
          <h2>1. Information We Collect</h2>
          <p>1.1. <strong>Personal Information:</strong> When you create an account, we collect information provided by Google Authentication, which may include your name and email address.</p>
          <p>1.2. <strong>User Content:</strong> We collect and store information about the credit cards you add to your account.</p>
          <p>1.3. <strong>Usage Data:</strong> We may collect information on how the Service is accessed and used, including your device&apos;s Internet Protocol address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve the Service</li>
            <li>Communicate with you about the Service</li>
            <li>Monitor the usage of the Service</li>
            <li>Detect, prevent, and address technical issues</li>
          </ul>

          <h2>3. Data Storage and Processing</h2>
          <p>3.1. <strong>User Data Storage:</strong> Your account information and card details are stored in Firebase, a Google Cloud service. We implement appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.</p>
          <p>3.2. <strong>Computation and Processing:</strong> All reward calculations and computational operations are performed on Cloudflare&apos;s infrastructure. These calculations are performed in real-time and are not stored permanently.</p>
          <p>3.3. We do not store users&apos; data other than the single copy of your account and card information in the Firebase database.</p>
          <p>3.4. <strong>Data Processing Locations:</strong> While user data is stored in Firebase, calculations are processed through Cloudflare&apos;s global network, ensuring fast and reliable service delivery.</p>

          <h2>4. Data Retention and Deletion</h2>
          <p>4.1. We retain your personal information only for as long as necessary to provide you with our Service and as described in this Privacy Policy.</p>
          <p>4.2. You can delete all the cards you&apos;ve added to your account directly through the Service.</p>
          <p>4.3. To request the deletion of your account, please email support@ccreward.app. Upon request, we will disable your account for 30 days and then delete it after this period.</p>

          <h2>5. Third-Party Services</h2>
          <p>5.1. Our Service uses Google Firebase for authentication and data storage. Please refer to Google&apos;s Privacy Policy for information on how they handle your data.</p>
          <p>5.2. Bank logos and card images displayed in our Service are the property of their respective financial institutions and are used for representational purposes only.</p>

          <h2>6. Accuracy of Information</h2>
          <p>6.1. The reward calculations provided by CCReward are based on publicly available information and are for reference purposes only.</p>
          <p>6.2. Banks may change their reward structures and terms at any time without notice. In all cases, the bank&apos;s official terms and conditions, and their calculation of rewards, shall be considered final and binding.</p>
          <p>6.3. Users should verify reward calculations with their respective banks.</p>

          <h2>7. Children&apos;s Privacy</h2>
          <p>7. Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.</p>

          <h2>8. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;effective date&quot; at the top of this Privacy Policy.</p>

          <h2>9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@ccreward.app</p>

          <h2>10. Mobile Application Privacy</h2>
          <p>10.1. <strong>App Stores:</strong> Our mobile applications are available through:</p>
          <ul>
            <li>Apple App Store: <a href="https://apps.apple.com/in/app/ccreward/id6736835206">CCReward for iOS</a></li>
            <li>Google Play Store: <a href="https://play.google.com/store/apps/details?id=app.ccreward">CCReward for Android</a></li>
          </ul>

          <p>10.2. <strong>Mobile Device Access:</strong> The mobile app may request access to:</p>
          <ul>
            <li>Internet connectivity to perform calculations and sync data</li>
            <li>Google Sign-In capabilities for authentication</li>
            <li>Device storage for caching purposes</li>
          </ul>

          <p>10.3. <strong>Data Collection in Mobile Apps:</strong></p>
          <ul>
            <li>The mobile apps collect the same core user data as our web service</li>
            <li>Device-specific information such as operating system version and device model</li>
            <li>App performance and usage statistics</li>
            <li>Crash reports and diagnostic information</li>
          </ul>

          <p>10.4. <strong>Mobile Data Storage:</strong></p>
          <ul>
            <li>App-specific data is stored locally on your device for offline access</li>
            <li>User account data is synchronized with our Firebase database</li>
            <li>Cache data can be cleared through your device&apos;s settings</li>
          </ul>

          <p>10.5. <strong>Third-Party Services in Mobile Apps:</strong></p>
          <ul>
            <li>Google Firebase for authentication and data storage</li>
            <li>Google Analytics for Firebase for usage analytics</li>
            <li>App store specific services (App Store/Play Store) for app distribution and updates</li>
          </ul>

          <h2>Platform Compatibility</h2>
          <p>CCReward.app is accessible through:</p>
          <ul>
            <li>Web browsers at https://ccreward.app</li>
            <li>iOS devices through the App Store (iOS 15.0 or later)</li>
            <li>Android devices through the Play Store (Android 10.0 or later)</li>
          </ul>

        </Typography>
      </Container>
      <Footer />
    </Box>
  );
};

export default PrivacyPolicyPage;