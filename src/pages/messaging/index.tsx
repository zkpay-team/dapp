import { useContext } from 'react';
import { useSigner } from 'wagmi';
import Steps from '../../components/Steps';
import CardHeader from '../../modules/Messaging/components/CardHeader';
import ConversationList from '../../modules/Messaging/components/ConversationList';
import { XmtpContext } from '../../modules/Messaging/context/XmtpContext';
import useStreamConversations from '../../modules/Messaging/hooks/useStreamConversations';
import RailgunContext from '../../modules/Railgun/context/railgun';

function MessagingIndex() {
  const { wallet, account } = useContext(RailgunContext);
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const { providerState } = useContext(XmtpContext);

  // watchAccount(() => {
  //   providerState?.disconnect?.();
  //   selectedConversationPeerAddress
  //     ? router.push(`/messaging/${selectedConversationPeerAddress}`)
  //     : router.push(`/messaging`);
  // });

  // Listens to new conversations ? ==> Yes, & sets them in "xmtp context". Stream stops "onDestroy"
  useStreamConversations();

  const handleXmtpConnect = async () => {
    if (providerState && providerState.initClient && signer) {
      await providerState.initClient(signer);
    }
  };

  if (!account?.isConnected || !wallet?.railgunWalletInfo) {
    return <Steps />;
  }

  return (
    <div className='mx-auto text-gray-900 sm:px-4 lg:px-0'>
      {!providerState?.client && account && (
        <div className='flex items-center justify-center pt-16'>
          <button
            type='submit'
            className='bg-greeny text-midnight font-bold py-2 px-4 rounded'
            onClick={() => handleXmtpConnect()}>
            Connect to Messaging
          </button>
        </div>
      )}
      {providerState?.client && (
        <div className='-mx-6 -mt-6'>
          <CardHeader />
          <div className='flex flex-col'>
            <ConversationList
              conversationMessages={providerState.conversationMessages}
              conversationsLoading={providerState.loadingConversations}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagingIndex;
