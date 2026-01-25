import HomeClientWrapper from './components/HomeClientWrapper';

export const metadata = {
  title: "Maximize Your Rewards with the Right Credit Card | ccreward",
  description: "Compare cards, calculate rewards, and find the perfect credit card for your spending habits.",
}

function Home() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Static Shell for SEO */}
      <div style={{ display: 'none', visibility: 'hidden' }} aria-hidden="true">
        <h1>Maximize Your Rewards with the Right Credit Card</h1>
        <p>Compare cards, calculate rewards, and find the perfect credit card for your spending habits.</p>
      </div>
      <HomeClientWrapper />
    </div>
  );
}

export default Home;