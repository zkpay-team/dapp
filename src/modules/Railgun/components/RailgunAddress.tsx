import { useContext } from 'react';
import RailgunContext from '../context/railgun';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { shortenString } from '../../../utils';
import { toast } from 'react-toastify';

function RailgunAddress() {
  const { wallet } = useContext(RailgunContext);

  if (!wallet?.railgunWalletInfo) {
    return null;
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
    <a
      onClick={handleCopyClick}
      className='flex p-3 bg-endnight border-endnight rounded justify-between mb-10 text-greeny'>
      <span>{shortenString(wallet.railgunWalletInfo.railgunAddress, 8, 5)}</span>
      <ClipboardDocumentIcon className='ml-2 h-5 w-5' />
    </a>
  );
}

export default RailgunAddress;
