import { useContext } from 'react';
import RailgunAddress from '../modules/Railgun/components/RailgunAddress';
import TokenList from '../modules/Railgun/components/TokenList';
import RailgunContext from '../modules/Railgun/context/railgun';

function Home() {
  const { wallet, createWallet, balances } = useContext(RailgunContext);
  console.log({ wallet, createWallet, balances });

  if (!wallet?.railgunWalletInfo) {
    return (
      <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
        <p className='text-3xl font-medium mb-8'>
          Your <span className='text-gray-100'>private wallet </span>
        </p>
        <button
          type='button'
          className='hover:text-green-600 hover:bg-green-50 bg-green-500 text-white px-5 py-2 rounded-lg'
          onClick={createWallet}>
          Create your Wallet
        </button>
      </div>
    );
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
