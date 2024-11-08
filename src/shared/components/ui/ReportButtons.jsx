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
          slots={{ root: "button" }}
        >
          Report Incorrect Reward
        </Button>
      ) : (
        <Button
          variant="text"
          color="primary"
          onClick={onMissingFormOpen}
          sx={{ mt: 2 }}
          slots={{ root: "button" }}
        >
          Bank or Card / MCC Missing?
        </Button>
      )}
    </>
  );
};

export default ReportButtons;
