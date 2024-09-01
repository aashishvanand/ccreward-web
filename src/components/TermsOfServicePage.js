import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

          <h2>3. User Accounts</h2>
          <p>3.1. You must create an account with Google to use certain features of the Service.</p>
          <p>3.2. You are responsible for maintaining the confidentiality of your account and password.</p>
          <p>3.3. You agree to accept responsibility for all activities that occur under your account.</p>

          <h2>4. User Content</h2>
          <p>4.1. You retain all rights to any content you submit, post or display on or through the Service.</p>
          <p>4.2. By submitting, posting or displaying content on or through the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display and distribute such content.</p>

          <h2>5. Intellectual Property</h2>
          <p>5.1. The Service and its original content, features, and functionality are owned by CCReward and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
          <p>5.2. The source code for CCReward is available at https://github.com/aashishvanand/credit-card-rewards-india-calculator under the MIT License with attribution required.</p>

          <h2>6. Termination</h2>
          <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>

          <h2>7. Limitation of Liability</h2>
          <p>In no event shall CCReward, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

          <h2>8. Changes</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.</p>

          <h2>9. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at support@ccreward.app</p>
        </Typography>
      </Container>
      <Footer />
    </Box>
  );
};

export default TermsOfServicePage;