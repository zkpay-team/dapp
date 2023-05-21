import Image from 'next/image';
import { useContext } from 'react';
import RailgunContext from '../modules/Railgun/context/railgun';
import ConnectBlock from './ConnectBlock';

function Steps() {
  const { account, wallet, createWallet } = useContext(RailgunContext);

  if (account?.isConnected && wallet) {
    return null;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <div className='flex justify-center'>
        <Image src={'/logo.jpg'} width={200} height={200} alt='ZKpay logo' className='-ml-4' />
      </div>

      <div className='flex items-center justify-center w-full flex-col'>
        <p className='leading-10'>
          <span className='pr-2'>🔑</span> Private (shielded) transactions <br />
          <span className='pr-2'>🔀</span> Pay individuals or groups <br />
          <span className='pr-2'>⭐</span> Payroll, DAO, Hackathon, etc. <br />
          <span className='pr-2'>💱</span> Receive your preferred currency
        </p>
        {!account?.isConnected && <ConnectBlock />}
        {account?.isConnected && !wallet && (
          <>
            <button
              type='button'
              className='hover:bg-endnight hover:text-white bg-greeny text-midnight px-5 py-2 rounded w-full mt-6'
              onClick={createWallet}>
              Create your private Wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Steps;
