import { useContext } from 'react';
import RailgunContext from '../modules/Railgun/context/railgun';
import ConnectBlock from './ConnectBlock';
import Step from './Step';

function Steps({ targetTitle }: { targetTitle?: string }) {
  const { account, wallet, createWallet } = useContext(RailgunContext);

  if (account?.isConnected) {
    return null;
  }

  console.log('Steps', account?.address, wallet);

  return (
    <>
      <nav className='mb-8'>
        <ol className='divide-y divide-gray-200 rounded border border-greeny md:flex md:divide-y-0'>
          <Step title='Connect' status={!account?.isConnected ? 'inprogress' : 'done'} order={1} />
          <Step
            title='Create your wallet'
            status={account?.isConnected && !wallet ? 'inprogress' : 'todo'}
            order={2}
          />
          {targetTitle && (
            <Step
              title={targetTitle}
              status={!account?.isConnected ? 'todo' : wallet === undefined ? 'todo' : 'inprogress'}
              order={3}
              isLast={true}
            />
          )}
        </ol>
      </nav>

      {!account?.isConnected && <ConnectBlock />}
      {account?.isConnected && !wallet && (
        <button
          type='button'
          className='hover:bg-endnight hover:text-white bg-greeny text-midnight px-5 py-2 rounded w-full mt-6'
          onClick={createWallet}>
          Create your Wallet
        </button>
      )}
    </>
  );
}

export default Steps;
