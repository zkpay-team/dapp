import { useContext } from 'react';
import Steps from '../components/Steps';
import RailgunAddress from '../modules/Railgun/components/RailgunAddress';
import TokenList from '../modules/Railgun/components/TokenList';
import RailgunContext from '../modules/Railgun/context/railgun';
import { useRouter } from 'next/router';

function Home() {
  const router = useRouter();
  const { wallet, balances, account } = useContext(RailgunContext);

  if (!account?.isConnected || !wallet?.railgunWalletInfo) {
    return <Steps />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Your <span className='text-gray-100'>private wallet </span>
      </p>
      <RailgunAddress />

      <div className='mt-4'>
        <TokenList balances={balances} />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <button
          type='button'
          className='mt-4 border border-greeny rounded hover:bg-endnight text-white bg-midnight px-5 py-2 w-full'
          onClick={() => router.push('/deposit')}>
          Deposit
        </button>
        <button
          type='button'
          className='mt-4 border border-greeny rounded hover:bg-endnight text-white bg-midnight px-5 py-2 w-full'
          onClick={() => router.push('/withdraw')}>
          Withdraw
        </button>
      </div>
    </div>
  );
}

export default Home;
