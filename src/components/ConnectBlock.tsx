import { ConnectButton } from '@web3modal/react';

function ConnectBlock() {
  return (
    <div className='p-8 flex flex-col items-center'>
      <p className='p-2'>Connect your daily wallet</p>
      <ConnectButton />
    </div>
  );
}

export default ConnectBlock;
