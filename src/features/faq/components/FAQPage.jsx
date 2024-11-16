import React from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";
import faqs from "../../../shared/constants/faq";

const FAQPage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container component="main" sx={{ py: 8, flexGrow: 1 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
      <Footer />
    </Box>
  );
};

export default FAQPage;
