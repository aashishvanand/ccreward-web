import CreditCardRewardsCalculator from '../components/CreditCardRewardsCalculator';
import ThemeToggle from '../components/ThemeToggle';
import Box from '@mui/material/Box';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ThemeToggle />
      </Box>
      <CreditCardRewardsCalculator />
    </Box>
  );
}