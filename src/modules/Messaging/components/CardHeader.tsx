import { truncateAddress } from '../../../utils';

interface ICardHeaderProps {
  peerAddress: string;
}
const CardHeader = ({ peerAddress }: ICardHeaderProps) => {
  return (
    <div className='flex flex-row text-white'>
      <div className='flex justify-start py-4 px-2 items-start border-b w-full'>
        <p>
          To:
          {peerAddress && (
            <span className='border-2 ml-2 pl-2 pr-2 border-greeny rounded-3xl text-xs'>
              {truncateAddress(peerAddress)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default CardHeader;
