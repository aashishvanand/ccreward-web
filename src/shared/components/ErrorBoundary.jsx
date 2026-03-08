"use client"
// src/shared/components/ErrorBoundary.jsx - React Error Boundary with Crashlytics
import React from 'react';
import { Box, Typography, Button, Paper, Alert, Stack } from '@mui/material';
import { Refresh as RefreshIcon, BugReport as BugReportIcon } from '@mui/icons-material';
import { handleReactError, logBreadcrumb, recordFatalError } from '../../core/services/crashlytics';
// FIXED: Use specific imports instead of export *
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Generate unique error ID
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log error details
    console.error('🚨 React Error Boundary caught an error:', error, errorInfo);
    
    // Record error with Crashlytics
    handleReactError(error, errorInfo);
    
    // Log breadcrumb
    logBreadcrumb('React Error Boundary triggered', 'error', {
      error_message: error.message,
      error_id: errorId,
      component_stack: errorInfo.componentStack
    });

    // Record additional context
    recordFatalError('react_component_error', {
      error_id: errorId,
      error_message: error.message,
      error_stack: error.stack,
      component_stack: errorInfo.componentStack,
      component_name: this.props.componentName || 'Unknown',
      page_url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timestamp: new Date().toISOString(),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      react_version: React.version
    });

    // Update state with error details
    this.setState({
      error,
      errorInfo,
      errorId
    });
  }

  handleRefresh = () => {
    // Log refresh attempt
    logBreadcrumb('User attempted error recovery', 'user', {
      error_id: this.state.errorId,
      recovery_method: 'refresh'
    });

    // Clear error state
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleReload = () => {
    // Log reload attempt
    logBreadcrumb('User reloaded page after error', 'user', {
      error_id: this.state.errorId,
      recovery_method: 'reload'
    });

    // Reload the page
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleReportBug = () => {
    // Log bug report attempt
    logBreadcrumb('User reported bug', 'user', {
      error_id: this.state.errorId,
      recovery_method: 'report'
    });

    // Open email client with error details
    const errorDetails = {
      errorId: this.state.errorId,
      errorMessage: this.state.error?.message,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    const emailBody = `
Error Report for ccreward

Error ID: ${errorDetails.errorId}
Timestamp: ${errorDetails.timestamp}
URL: ${errorDetails.url}
Error: ${errorDetails.errorMessage}
User Agent: ${errorDetails.userAgent}

Please describe what you were doing when this error occurred:
[Your description here]
    `.trim();

    const emailSubject = `ccreward Error Report - ${errorDetails.errorId}`;
    const emailUrl = `mailto:support@ccreward.app?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    if (typeof window !== 'undefined') {
      window.open(emailUrl, '_blank', 'noopener,noreferrer');
    }
  };

  render() {
    if (this.state.hasError) {
      // Error UI with motion animations
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            p: 3,
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                maxWidth: 600,
                width: '100%',
                borderRadius: 2,
              }}
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <BugReportIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: 'error.main', 
                    mb: 2 
                  }} 
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ fontWeight: 'bold', color: 'error.main' }}
                >
                  Oops! Something went wrong
                </Typography>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ mb: 3, color: 'text.secondary' }}
                >
                  We've encountered an unexpected error. Our team has been notified and is working on a fix.
                </Typography>
              </motion.div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      <strong>Error:</strong> {this.state.error.message}
                    </Typography>
                    {this.state.errorId && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        Error ID: {this.state.errorId}
                      </Typography>
                    )}
                  </Alert>
                </motion.div>
              )}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  sx={{ mt: 3 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={this.handleRefresh}
                    sx={{ flex: 1 }}
                  >
                    Try Again
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={this.handleReload}
                    sx={{ flex: 1 }}
                  >
                    Refresh Page
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<BugReportIcon />}
                    onClick={this.handleReportBug}
                    sx={{ flex: 1 }}
                  >
                    Report Bug
                  </Button>
                </Stack>
              </motion.div>

              {this.state.errorId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      mt: 2, 
                      display: 'block',
                      color: 'text.disabled',
                      fontFamily: 'monospace'
                    }}
                  >
                    Error ID: {this.state.errorId}
                  </Typography>
                </motion.div>
              )}
            </Paper>
          </motion.div>
        </Box>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = (Component, componentName) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary componentName={componentName}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${componentName || Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;