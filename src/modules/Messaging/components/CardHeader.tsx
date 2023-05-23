import { ClipboardDocumentIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { truncateAddress } from '../../../utils';
import { useContext, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import RailgunContext from '../../Railgun/context/railgun';
import { ChevronLeft } from 'heroicons-react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

interface ICardHeaderProps {
  peerAddress?: string;
}
const CardHeader = ({ peerAddress }: ICardHeaderProps) => {
  const { account } = useContext(RailgunContext);
  const [show, setShow] = useState(false);
  const router = useRouter();

  const shareLink = `https://www.zk-pay.io/messaging/${account?.address}`;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shareLink);
    toast('Link copied', {
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
    <div className='flex flex-row text-white'>
      <div className='flex justify-between py-4 px-4 items-center border-b w-full border-gray-800'>
        {peerAddress && (
          <>
            <nav className='flex mr-5' aria-label='Back'>
              <ol className='inline-flex items-center space-x-1 md:space-x-3'>
                <li className=''>
                  <a
                    href='#'
                    onClick={() => router.back()}
                    className='text-sm font-medium text-gray-400 inline-flex items-center -ml-1 pr-5 py-2 border-r border-gray-800'>
                    <ChevronLeft />
                    Back
                  </a>
                </li>
              </ol>
            </nav>
            <p className='w-full h-full flex items-center text-xs'>
              To:
              <span className='pr-2'>{truncateAddress(peerAddress, 5)}</span>
            </p>
          </>
        )}
        {!peerAddress && (
          <>
            <p className='text-2xl font-medium'>Chats</p>

            <button
              type='button'
              className=' hover:bg-endnight text-white bg-endnight px-5 py-2 flex items-center'
              onClick={() => setShow(true)}>
              <QrCodeIcon className='w-[22px] h-[22px] text-greeny mr-2' />
              Share
            </button>

            <div
              className={`${
                !show ? 'hidden' : ''
              } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full bg-black/90 flex flex-col items-center justify-center`}>
              <div className='relative w-full max-w-2xl h-auto'>
                <div className='relative bg-endnightshadow '>
                  <div className='fixed top-0 right-0'>
                    <button
                      onClick={() => setShow(false)}
                      type='button'
                      className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm p-4 ml-auto inline-flex items-center '
                      data-modal-toggle='defaultModal'>
                      <svg
                        className='w-5 h-5'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          fillRule='evenodd'
                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                          clipRule='evenodd'></path>
                      </svg>
                      <span>Close</span>
                    </button>
                  </div>
                  <div className='flex flex-col justify-between items-center '>
                    <h3 className='text-xl font-semibold text-center py-6'>Share your address</h3>
                    <div className='flex justify-center'>
                      <QRCodeSVG
                        value={shareLink}
                        size={260}
                        bgColor='#11FEB7'
                        fgColor='#0A0A18'
                        level='L'
                        includeMargin={true}
                      />
                    </div>
                    <p className='mt-10'>or</p>
                    <a
                      onClick={handleCopyClick}
                      className='flex p-3 bg-endnight border-endnight rounded justify-between mt-10 text-greeny'>
                      Copy a share link
                      <ClipboardDocumentIcon className='ml-2 h-5 w-5' />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CardHeader;
