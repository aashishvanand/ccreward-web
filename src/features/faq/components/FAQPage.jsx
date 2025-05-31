// src/features/faq/components/FAQPage.jsx - Enhanced with Analytics
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Chip,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";
import faqs from "../../../shared/constants/faq";
import { motion } from "framer-motion";

// Add analytics imports
import { 
  useAnalytics, 
  usePagePerformance, 
  useEngagementTracking,
  useComponentAnalytics 
} from '../../../core/hooks';

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

const FAQPage = () => {
  // Analytics hooks
  const { 
    trackButtonClick, 
    trackFeatureUsage, 
    trackEvent,
    trackSearch 
  } = useAnalytics();
  const { recordCustomMetric } = usePagePerformance('faq-page');
  const { trackCustomEngagement } = useEngagementTracking();
  const { trackJourneyStep } = useJourneyTracking();
  const { trackComponentInteraction } = useComponentAnalytics('FAQPage');

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAccordions, setExpandedAccordions] = useState(new Set());
  const [filteredFAQs, setFilteredFAQs] = useState(faqs);

  // Track page load
  useEffect(() => {
    trackFeatureUsage('faq_page_loaded', {
      total_faqs: faqs.length,
      device_type: window.innerWidth < 768 ? 'mobile' : 'desktop'
    });

    trackJourneyStep('faq_page_accessed', {
      source: 'navigation',
      total_faqs_available: faqs.length
    });

    recordCustomMetric('page_load_time', performance.now());
    recordCustomMetric('total_faqs_available', faqs.length);
  }, [trackFeatureUsage, trackJourneyStep, recordCustomMetric]);

  // Enhanced search functionality with analytics
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFAQs(faqs);
    } else {
      const filtered = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFAQs(filtered);

      // Track search with results
      trackSearch(searchQuery, filtered, {
        search_type: 'faq_search',
        results_found: filtered.length,
        total_faqs: faqs.length
      });

      trackEvent('faq_search_performed', {
        query: searchQuery,
        results_count: filtered.length,
        has_results: filtered.length > 0,
        query_length: searchQuery.length
      });

      recordCustomMetric('search_results_count', filtered.length);
    }
  }, [searchQuery, trackSearch, trackEvent, recordCustomMetric]);

  // Enhanced search input handler
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    trackComponentInteraction('search_input', {
      query_length: query.length,
      has_query: query.trim().length > 0
    });

    // Track search engagement
    if (query.length > 2) {
      trackCustomEngagement('faq_search_interaction', {
        query_length: query.length
      });
    }
  };

  // Enhanced accordion change handler with analytics
  const handleAccordionChange = (index) => (event, isExpanded) => {
    const faq = filteredFAQs[index];
    
    trackButtonClick('faq_accordion_toggle', {
      faq_index: index,
      faq_question: faq.question.substring(0, 50), // Limit for privacy
      expanded: isExpanded,
      search_active: searchQuery.trim().length > 0
    });

    trackCustomEngagement('faq_interaction', {
      question_index: index,
      expanded: isExpanded,
      question_topic: extractQuestionTopic(faq.question)
    });

    if (isExpanded) {
      setExpandedAccordions(prev => new Set([...prev, index]));
      
      trackEvent('faq_question_opened', {
        question_index: index,
        question_topic: extractQuestionTopic(faq.question),
        search_query: searchQuery || 'none',
        total_expanded: expandedAccordions.size + 1
      });

      recordCustomMetric('faq_engagement_score', expandedAccordions.size + 1);
    } else {
      setExpandedAccordions(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });

      trackEvent('faq_question_closed', {
        question_index: index,
        question_topic: extractQuestionTopic(faq.question)
      });
    }
  };

  // Helper function to extract question topic/category
  const extractQuestionTopic = (question) => {
    const topics = {
      'pricing': ['free', 'cost', 'price', 'paid'],
      'features': ['feature', 'function', 'capability', 'can', 'does'],
      'banks': ['bank', 'support', 'which'],
      'cards': ['card', 'credit card'],
      'data': ['data', 'privacy', 'information'],
      'technical': ['app', 'android', 'ios', 'error', 'bug'],
      'rewards': ['reward', 'point', 'calculate', 'track']
    };

    const lowerQuestion = question.toLowerCase();
    
    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
        return topic;
      }
    }
    
    return 'general';
  };

  // Get popular questions based on common topics
  const getPopularQuestions = () => {
    const popularKeywords = ['free', 'bank', 'android', 'data', 'card'];
    return faqs.filter(faq => 
      popularKeywords.some(keyword => 
        faq.question.toLowerCase().includes(keyword)
      )
    ).slice(0, 3);
  };

  // Track scroll engagement
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercent > 0 && scrollPercent % 25 === 0) {
        trackCustomEngagement('faq_page_scroll', {
          scroll_percentage: scrollPercent,
          expanded_faqs: expandedAccordions.size,
          search_active: searchQuery.trim().length > 0
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [expandedAccordions.size, searchQuery, trackCustomEngagement]);

  // Track page exit with engagement metrics
  useEffect(() => {
    return () => {
      trackEvent('faq_page_exit', {
        time_on_page: performance.now(),
        total_expanded: expandedAccordions.size,
        search_performed: searchQuery.trim().length > 0,
        final_search_query: searchQuery.trim() || 'none'
      });
    };
  }, [expandedAccordions.size, searchQuery, trackEvent]);

  const popularQuestions = getPopularQuestions();

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
        <Container component="main" sx={{ py: 8, flexGrow: 1 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
              mb: 4
            }}
          >
            Frequently Asked Questions
          </Typography>

          {/* Search Bar */}
          <Box sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>

          {/* Popular Questions */}
          {searchQuery.trim() === "" && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
                Popular Questions
              </Typography>
              <Stack 
                direction="row" 
                spacing={1} 
                justifyContent="center" 
                flexWrap="wrap"
                sx={{ gap: 1 }}
              >
                {popularQuestions.map((faq, index) => (
                  <Chip
                    key={index}
                    label={faq.question.length > 40 ? `${faq.question.substring(0, 40)}...` : faq.question}
                    onClick={() => {
                      const faqIndex = faqs.findIndex(f => f.question === faq.question);
                      if (faqIndex !== -1) {
                        trackButtonClick('popular_question_click', {
                          question_index: faqIndex,
                          question_topic: extractQuestionTopic(faq.question)
                        });
                        
                        // Scroll to FAQ
                        const element = document.getElementById(`faq-${faqIndex}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                          // Expand the accordion
                          setTimeout(() => {
                            setExpandedAccordions(prev => new Set([...prev, faqIndex]));
                          }, 500);
                        }
                      }
                    }}
                    variant="outlined"
                    clickable
                    sx={{ 
                      maxWidth: 250,
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText'
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Search Results Info */}
          {searchQuery.trim() !== "" && (
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {filteredFAQs.length === 0 
                  ? `No results found for "${searchQuery}"`
                  : `Found ${filteredFAQs.length} result${filteredFAQs.length !== 1 ? 's' : ''} for "${searchQuery}"`
                }
              </Typography>
            </Box>
          )}

          {/* FAQ Accordions */}
          {filteredFAQs.map((faq, index) => (
            <Accordion 
              key={index}
              id={`faq-${index}`}
              expanded={expandedAccordions.has(index)}
              onChange={handleAccordionChange(index)}
              sx={{
                mb: 2,
                '&:before': {
                  display: 'none',
                },
                boxShadow: 1,
                borderRadius: 1,
                '&.Mui-expanded': {
                  boxShadow: 2,
                }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  px: 3,
                  '&.Mui-expanded': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pt: 1, pb: 3 }}>
                <Typography 
                  sx={{ 
                    lineHeight: 1.7,
                    color: 'text.secondary'
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* No Results Message */}
          {filteredFAQs.length === 0 && searchQuery.trim() !== "" && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                No FAQs match your search
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Try different keywords or browse all questions below
              </Typography>
              <Chip
                label="Clear Search"
                onClick={() => {
                  setSearchQuery("");
                  trackButtonClick('clear_search', {
                    previous_query: searchQuery
                  });
                }}
                variant="outlined"
                clickable
              />
            </Box>
          )}
        </Container>
        <Footer />
      </Box>
    </motion.div>
  );
};

export default FAQPage;