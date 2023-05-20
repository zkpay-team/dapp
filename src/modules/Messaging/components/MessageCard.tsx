import Image from 'next/image';
import { useContext } from 'react';
import Loading from '../../../components/Loading';
import TalentLayerContext from '../../../context/talentLayer';
import { truncateAddress } from '../../../utils';
import { formatDateDivider } from '../../../utils/dates';
import { formatDateTime } from '../utils/messaging';
import { ChatMessageStatus, XmtpChatMessage } from '../utils/types';
import { tokens } from '../../Railgun/components/TokenList';
import { shortenString } from '../../../utils';

interface IMessageCardProps {
  message: XmtpChatMessage;
  dateHasChanged: boolean;
}

const formatMessage = (message: string) => {
  if (message.includes('/send?')) {
    const url = new URL(message);

    const token = 'DAI';
    const to = url.searchParams.get('to[0]');
    const amount = url.searchParams.get('amount[0]');

    if (!to || !token || !amount) {
      return message;
    }

    return (
      <a
        href={message}
        className='block text-center border border-greeny rounded hover:bg-endnight text-white bg-midnight px-5 py-2 w-full'>
        Send {amount} {token} to {shortenString(to, 8, 5)}
      </a>
    );
  }
  return message;
};

const MessageCard = ({ message, dateHasChanged }: IMessageCardProps) => {
  const { account } = useContext(TalentLayerContext);

  const isSender = message.from.toLowerCase() === account?.address?.toLowerCase();

  const messageContent = formatMessage(message.messageContent);

  return (
    <>
      {dateHasChanged && <DateDivider date={message.timestamp} />}
      {message.from && (
        <div
          className={`flex ${isSender ? 'justify-end pr-5' : 'justify-start'} mb-4 items-center`}>
          {isSender && (
            <>
              <span className='text-sm pr-3 text-gray-400'>
                {formatDateTime(message.timestamp)}
              </span>
              <Image
                src={`/images/default-avatar-1.jpeg`}
                className='object-cover h-12 w-12 rounded-full'
                width={50}
                height={50}
                alt=''
              />
            </>
          )}
          <div
            className={`py-3 px-4 ${
              isSender && message.status === ChatMessageStatus.SENT
                ? 'ml-2 bg-greeny text-midnight rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
                : isSender && message.status === ChatMessageStatus.ERROR
                ? 'ml-2 bg-red-600 rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
                : isSender && message.status === ChatMessageStatus.PENDING
                ? 'ml-2 bg-endnight rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
                : 'mr-2 bg-endnight rounded-bl-3xl rounded-tl-3xl rounded-tr-xl'
            }
          text-white`}>
            {isSender && message.status === ChatMessageStatus.SENT && (
              <>
                <div>{<b>{truncateAddress(message.from)}</b>}</div>
                <div className={'break-all'}>{messageContent}</div>
              </>
            )}
            {isSender && message.status === ChatMessageStatus.PENDING && (
              <div className='flex flex-row items-center'>
                <div>
                  <div>{<b>{truncateAddress(message.from)}</b>}</div>
                  <div className={'break-all'}>{messageContent}</div>
                </div>
                <div className='ml-2'>
                  <Loading size={'5'} />
                </div>
              </div>
            )}
            {isSender && message.status === ChatMessageStatus.ERROR && (
              <>
                <div>{<b>{truncateAddress(message.from)}</b>}</div>
                <div className={'break-all'}>{messageContent}</div>
              </>
            )}
            {!isSender && (
              <>
                <div>{<b>{truncateAddress(message.from)}</b>}</div>
                <div className={'break-all'}>{messageContent}</div>
              </>
            )}
          </div>
          {!isSender && (
            <>
              <Image
                src={`/images/default-avatar-2.jpeg`}
                className='object-cover h-12 w-12 rounded-full'
                width={50}
                height={50}
                alt=''
              />
              <span className='text-sm pl-3 text-gray-400'>
                {formatDateTime(message.timestamp)}
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
};

const DateDivider = ({ date }: { date?: Date }): JSX.Element => (
  <div className='flex align-items-center items-center pb-8 pt-4'>
    <div className='grow h-0.5 bg-gray-300/25' />
    <span className='mx-11 flex-none text-gray-300 text-sm font-semibold'>
      {formatDateDivider(date)}
    </span>
    <div className='grow h-0.5 bg-gray-300/25' />
  </div>
);

export default MessageCard;
