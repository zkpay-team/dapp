import { truncate } from '../utils/messaging';
import useUserByAddress from '../../../hooks/useUserByAddress';
import { useRouter } from 'next/router';
import { formatDateConversationCard } from '../../../utils/dates';
import Image from 'next/image';
import { XmtpChatMessage } from '../utils/types';
import { truncateAddress } from '../../../utils';

interface IConversationCardProps {
  peerAddress: string;
  selectedConversationPeerAddress: string;
  latestMessage?: XmtpChatMessage;
}

const ConversationCard = ({
  peerAddress,
  latestMessage,
  selectedConversationPeerAddress,
}: IConversationCardProps) => {
  const user = useUserByAddress(peerAddress);
  const router = useRouter();
  const isConvSelected = peerAddress === selectedConversationPeerAddress;

  const handleSelectConversation = () => {
    router.push(`/messaging/${peerAddress}`);
  };

  return (
    <div
      onClick={() => handleSelectConversation()}
      className={`flex py-4 px-2 justify-center items-center border-b-2 cursor-pointer text-white  ${
        isConvSelected ? 'bg-endnight ' : 'border-b-2'
      }`}>
      {/* <div className='w-[40px]'>
        <Image
          src={`/images/default-avatar-1.jpeg`}
          className='object-cover w-[40px] h-[40px] rounded-full'
          width={50}
          height={50}
          alt=''
        />
      </div> */}
      <div className='flex-1 pl-2'>
        {user && user.handle ? <b>{user.handle}</b> : <b>{truncateAddress(peerAddress)}</b>}
        <div>
          <span className='text-xs text-gray-200 bas'>
            {formatDateConversationCard(latestMessage?.timestamp as Date)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
