import { Dispatch, SetStateAction } from 'react';
import Loading from '../../../components/Loading';

interface IMessageComposerProps {
  messageContent: string;
  setMessageContent: Dispatch<SetStateAction<string>>;
  sendNewMessage: () => void;
  sendingPending: boolean;
  peerUserExistsOnXMTP: boolean;
  peerUserExistsOnTalentLayer: boolean;
}

const MessageComposer = ({
  setMessageContent,
  messageContent,
  sendNewMessage,
  sendingPending,
  peerUserExistsOnXMTP,
  peerUserExistsOnTalentLayer,
}: IMessageComposerProps) => {
  console.log('MessageComposer');
  const renderSendButton = (peerUserExists: boolean, sendingPending: boolean) => {
    return (
      !sendingPending && (
        <button
          className='bg-zinc-500 hover:bg-midnight text-white font-bold py-2 px-4 rounded -ml-2'
          onClick={sendNewMessage}
          disabled={!peerUserExists || !peerUserExistsOnTalentLayer}>
          Send
        </button>
      )
    );
  };

  return (
    <>
      <div className='flex flex-row py-5 pr-5'>
        <input
          className='w-full  py-2 px-3 rounded'
          type='text'
          onChange={e => setMessageContent(e.target.value)}
          placeholder='Write a message'
          disabled={!peerUserExistsOnXMTP || !peerUserExistsOnTalentLayer}
          value={messageContent}
        />
        {sendingPending && <Loading />}
        {renderSendButton(peerUserExistsOnXMTP, sendingPending)}
      </div>
    </>
  );
};

export default MessageComposer;
