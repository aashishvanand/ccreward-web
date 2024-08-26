import React, { useState } from 'react';
import { Paper, Typography, Box, IconButton, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const CalculationResults = ({ result }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mt: 2,
        width: "100%",
        bgcolor: result.points > 0 || result.cashback > 0 || result.miles > 0
          ? "success.light"
          : "error.light",
        borderRadius: 2,
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}
      >
        <Tooltip title={expanded ? "Collapse" : "Expand"}>
          <Typography
            variant="h6"
            align="center"
            color="textPrimary"
            fontWeight="bold"
            onClick={() => setExpanded(!expanded)}
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
              cursor: "pointer",
              maxWidth: "calc(100% - 40px)",
              ...(expanded ? {} : {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }),
            }}
          >
            {result.points > 0 || result.cashback > 0 || result.miles > 0
              ? <>🎉 {result.rewardText} 🎉</>
              : <>😢 No rewards earned 😢</>
            }
          </Typography>
        </Tooltip>
        <IconButton 
          size="small" 
          onClick={() => setExpanded(!expanded)}
          sx={{ ml: 1 }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      {expanded && (
        <>
          {result.appliedCap && (
            <Typography variant="body2" color="textSecondary" align="center">
              {`${result.appliedCap.category} cap applied: Max ${
                result.appliedCap.maxPoints ||
                result.appliedCap.maxCashback ||
                result.appliedCap.maxMiles
              } ${
                result.points ? "points" : result.cashback ? "cashback" : "miles"
              }${
                result.appliedCap.maxSpent
                  ? ` or ₹${result.appliedCap.maxSpent.toFixed(2)} spent`
                  : ""
              }`}
            </Typography>
          )}
          {result.uncappedPoints > 0 && result.uncappedPoints !== result.points && (
            <Typography variant="body2" color="textSecondary" align="center">
              (Uncapped: {result.uncappedPoints} points)
            </Typography>
          )}
          {result.uncappedCashback > 0 && result.uncappedCashback !== result.cashback && (
            <Typography variant="body2" color="textSecondary" align="center">
              (Uncapped: ₹{result.uncappedCashback.toFixed(2)} cashback)
            </Typography>
          )}
          {result.uncappedMiles > 0 && result.uncappedMiles !== result.miles && (
            <Typography variant="body2" color="textSecondary" align="center">
              (Uncapped: {result.uncappedMiles} miles)
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
};

export default CalculationResults;