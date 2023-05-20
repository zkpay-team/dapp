import { DocumentDuplicate } from 'heroicons-react';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import RailgunContext from '../modules/Railgun/context/railgun';
import { shortenString } from '../utils';

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

  const handleCopyClick = () => {
    navigator.clipboard.writeText(wallet?.railgunWalletInfo?.railgunAddress as string);
    toast('Private address copied', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium tracking-wider mb-8'>
        Your <span className='text-zinc-600'>wallet </span>
      </p>
      <a onClick={handleCopyClick} className='flex'>
        <DocumentDuplicate />
        <span>{shortenString(wallet.railgunWalletInfo.railgunAddress, 8, 5)}</span>
      </a>
    </div>
  );
}

export default Home;
