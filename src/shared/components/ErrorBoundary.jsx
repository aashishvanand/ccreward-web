"use client"
// src/shared/components/ErrorBoundary.jsx - React Error Boundary with Crashlytics
import React from 'react';
import { Box, Typography, Button, Paper, Alert, Stack } from '@mui/material';
import { Refresh as RefreshIcon, BugReport as BugReportIcon } from '@mui/icons-material';
import { handleReactError, logBreadcrumb, recordFatalError } from '../../core/services/crashlytics';

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
    const errorId = `error_${Date.now()}_${crypto.randomUUID().replace(/-/g, '').slice(0, 9)}`;
    
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
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function' 
          ? this.props.fallback(this.state.error, this.handleRefresh)
          : this.props.fallback;
      }
      
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
          <Box
            sx={{
              animation: 'errorFadeIn 0.5s ease-out',
              '@keyframes errorFadeIn': {
                from: { opacity: 0, transform: 'scale(0.9)' },
                to: { opacity: 1, transform: 'scale(1)' },
              },
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
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
              <BugReportIcon
                sx={{
                  fontSize: 64,
                  color: 'error.main',
                  mb: 2
                }}
              />

              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 'bold', color: 'error.main' }}
              >
                Oops! Something went wrong
              </Typography>

              <Typography
                variant="body1"
                sx={{ mb: 3, color: 'text.secondary' }}
              >
                We've encountered an unexpected error. Our team has been notified and is working on a fix.
              </Typography>

              {process.env.NODE_ENV === 'development' && this.state.error && (
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
              )}

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

              {this.state.errorId && (
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
              )}
            </Paper>
          </Box>
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