'use client';

import { Box, Typography, Chip } from '@mui/material';
import {
  ErrorOutlined as ErrorIcon,
  LocalFireDepartment as FlameIcon,
} from '@mui/icons-material';

/**
 * Badge showing "{remaining}/{limit} remaining today".
 *
 * - Red with exclamation icon when 0 remaining
 * - Orange with flame icon when <= 3 remaining
 * - Default color otherwise
 */
const UsageRemainingBadge = ({ remaining, limit }) => {
  const isExhausted = remaining <= 0;
  const isLow = remaining > 0 && remaining <= 3;

  const color = isExhausted ? 'error' : isLow ? 'warning' : 'default';

  const icon = isExhausted ? (
    <ErrorIcon fontSize="small" />
  ) : isLow ? (
    <FlameIcon fontSize="small" />
  ) : null;

  const label = `${remaining}/${limit} remaining today`;

  return (
    <Chip
      icon={icon}
      label={label}
      color={color}
      variant="outlined"
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );
};

export default UsageRemainingBadge;
