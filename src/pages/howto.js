export async function getServerSideProps(context) {
  // Simple redirect to default region 'in'
  // Or could detect IP country if needed, but strict redirect is requested behavior for root
  return {
    redirect: {
      destination: '/in/howto',
      permanent: false, // Temporary redirect in case logic changes
    },
  };
}

export default function HowToRedirect() {
  return null;
}