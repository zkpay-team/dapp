import { QrCodeIcon } from '@heroicons/react/24/outline';
import { truncateAddress } from '../../../utils';

interface ICardHeaderProps {
  peerAddress: string;
}
const CardHeader = ({ peerAddress }: ICardHeaderProps) => {
  return (
    <div className='flex flex-row text-white'>
      <div className='flex justify-start py-4 px-2 items-start border-b w-full'>
        <p className='w-full h-full flex items-center'>
          To:
          {peerAddress && (
            <span className='ml-2 pl-2 pr-2text-xs'>{truncateAddress(peerAddress, 5)}</span>
          )}
        </p>
        <button
          type='button'
          className=' hover:bg-endnight text-white bg-midnight px-5 py-2'
          onClick={() => console.log('hey')}>
          <QrCodeIcon className='w-[22px] h-[22px] text-greeny' />
        </button>
      </div>
    </div>
  );
};

export default CardHeader;
