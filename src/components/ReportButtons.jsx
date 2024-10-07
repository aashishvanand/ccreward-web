import React from "react";
import { Button } from "@mui/material";

const ReportButtons = ({
  calculationPerformed,
  onMissingFormOpen,
  onIncorrectRewardOpen,
}) => {
  return (
    <>
      {calculationPerformed ? (
        <Button
          variant="text"
          color="primary"
          onClick={onIncorrectRewardOpen}
          sx={{ mt: 2 }}
        >
          Report Incorrect Reward
        </Button>
      ) : (
        <Button
          variant="text"
          color="primary"
          onClick={onMissingFormOpen}
          sx={{ mt: 2 }}
        >
          Bank or Card / MCC Missing?
        </Button>
      )}
    </>
  );
};

export default ReportButtons;
