import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
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

          <h2>3. Data Storage and Security</h2>
          <p>3.1. Your data is stored in Firebase, a Google Cloud service. We implement appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information and data stored on our Service.</p>
          <p>3.2. We do not store users&apos; data other than the single copy at the Firebase database.</p>

          <h2>4. Data Retention and Deletion</h2>
          <p>4.1. We retain your personal information only for as long as necessary to provide you with our Service and as described in this Privacy Policy.</p>
          <p>4.2. You can delete all the cards you&apos;ve added to your account directly through the Service.</p>
          <p>4.3. To request the deletion of your account, please email support@ccreward.app. Upon request, we will disable your account for 30 days and then delete it after this period.</p>

          <h2>5. Third-Party Services</h2>
          <p>Our Service uses Google Firebase for authentication and data storage. Please refer to Google&apos;s Privacy Policy for information on how they handle your data.</p>

          <h2>6. Children&apos;s Privacy</h2>
          <p>Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.</p>

          <h2>7. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;effective date&quot; at the top of this Privacy Policy.</p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@ccreward.app</p>
        </Typography>
      </Container>
      <Footer />
    </Box>
  );
};

export default PrivacyPolicyPage;