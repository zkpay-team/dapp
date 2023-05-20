import { useAccount } from 'wagmi';
import Onboarding from '../components/Onboarding';

function Home() {
  const account = useAccount();

  // if (!account.isConnected) {
  //   return <Onboarding />;
  // }

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium tracking-wider mb-8'>
        Your <span className='text-zinc-600'>wallet </span>
      </p>
    </div>
  );
}

export default Home;
