import { QrCodeIcon } from '@heroicons/react/24/outline';
import { truncateAddress } from '../../../utils';
import { useContext, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import RailgunContext from '../../Railgun/context/railgun';

interface ICardHeaderProps {
  peerAddress: string;
}
const CardHeader = ({ peerAddress }: ICardHeaderProps) => {
  const { account } = useContext(RailgunContext);
  const [show, setShow] = useState(false);

  const shareLink = `https://www.zk-pay.io/messaging/${account?.address}`;

  return (
    <div className='flex flex-row text-white'>
      <div className='flex justify-start py-4 px-2 items-start border-b w-full'>
        <p className='w-full h-full flex items-center'>
          To:
          {peerAddress && (
            <span className='ml-2 pl-2 pr-2text-xs'>{truncateAddress(peerAddress, 5)}</span>
          )}
        </p>
        <>
          <button
            type='button'
            className=' hover:bg-endnight text-white bg-midnight px-5 py-2'
            onClick={() => setShow(true)}>
            <QrCodeIcon className='w-[22px] h-[22px] text-greeny' />
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
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default CardHeader;
