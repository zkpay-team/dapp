import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';
import ConnectBlock from './ConnectBlock';
import Step from './Step';
import TalentLayerIdForm from './Form/TalentLayerIdForm';

function Steps({ targetTitle }: { targetTitle?: string }) {
  const { account, user } = useContext(TalentLayerContext);

  if (account?.isConnected) {
    return null;
  }

  console.log('Steps', account?.address, user);

  return (
    <>
      <nav className='mb-8'>
        <ol className='divide-y divide-gray-200 rounded border border-greeny md:flex md:divide-y-0'>
          <Step
            title='Create your wallet'
            status={!account?.isConnected ? 'inprogress' : 'done'}
            order={1}
          />
          <Step
            title='Connect'
            status={!account?.isConnected ? 'todo' : user === undefined ? 'inprogress' : 'done'}
            order={2}
          />
          {targetTitle && (
            <Step
              title={targetTitle}
              status={!account?.isConnected ? 'todo' : user === undefined ? 'todo' : 'inprogress'}
              order={3}
              isLast={true}
            />
          )}
        </ol>
      </nav>

      {!account?.isConnected && <ConnectBlock />}
      {account?.isConnected && !user && <TalentLayerIdForm />}
    </>
  );
}

export default Steps;
