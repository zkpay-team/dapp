import { DocumentDuplicate } from 'heroicons-react';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import RailgunContext from '../modules/Railgun/context/railgun';
import { shortenString } from '../utils';
import TokenList from '../modules/Railgun/components/TokenList';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

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
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Your <span className='text-gray-100'>private wallet </span>
      </p>
      <a
        onClick={handleCopyClick}
        className='flex p-3 bg-endnight border-endnight rounded justify-between mb-10 text-greeny'>
        <span>{shortenString(wallet.railgunWalletInfo.railgunAddress, 8, 5)}</span>
        <ClipboardDocumentIcon className='ml-2 h-5 w-5' />
      </a>

      <div className='mt-4'>
        <TokenList balances={balances} />
      </div>
    </div>
  );
}

export default Home;
