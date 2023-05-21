import { useContext } from 'react';
import Steps from '../components/Steps';
import RailgunAddress from '../modules/Railgun/components/RailgunAddress';
import TokenList from '../modules/Railgun/components/TokenList';
import RailgunContext from '../modules/Railgun/context/railgun';

function Home() {
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
    </div>
  );
}

export default Home;
