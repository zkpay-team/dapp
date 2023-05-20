import { useContext } from 'react';
import RailgunContext from '../modules/Railgun/context/railgun';

function Home() {
  const { wallet, createWallet } = useContext(RailgunContext);
  console.log({ wallet, createWallet });

  if (!wallet?.railgunWalletInfo) {
    return (
      <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
        <p className='text-3xl font-medium tracking-wider mb-8'>
          Your <span className='text-zinc-600'>wallet </span>
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
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium tracking-wider mb-8'>
        Your <span className='text-zinc-600'>wallet </span>
      </p>
      <p>{wallet.railgunWalletInfo.railgunAddress}</p>
      <p>{wallet.railgunWalletInfo.id}</p>
    </div>
  );
}

export default Home;
