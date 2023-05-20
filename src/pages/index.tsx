import { useContext } from 'react';
import RailgunAddress from '../modules/Railgun/components/RailgunAddress';
import TokenList from '../modules/Railgun/components/TokenList';
import RailgunContext from '../modules/Railgun/context/railgun';
import Image from 'next/image';

function Home() {
  const { wallet, createWallet, balances } = useContext(RailgunContext);
  console.log({ wallet, createWallet, balances });

  if (!wallet?.railgunWalletInfo) {
    return (
      <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
        <div className='flex justify-center'>
          <Image src={'/logo.jpg'} width={200} height={200} alt='ZKpay logo' className='-ml-4' />
        </div>
        <div className='py-6 px-6 '>
          <p className='leading-10'>
            🔑 Private (shielded) transactions <br />
            🔀 Pay individuals or groups <br />
            ⭐ Payroll, DAO, Hackathon, etc. <br />
            💱 Receive your preferred currency
          </p>
          <button
            type='button'
            className='hover:bg-endnight hover:text-white bg-greeny text-midnight px-5 py-2 rounded w-full mt-6'
            onClick={createWallet}>
            Create your Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Your <span className='text-gray-100'>private wallet </span>
      </p>
      <RailgunAddress />

      <div className='mt-4'>
        <TokenList balances={balances} />
      </div>
    </div>
  );
}

export default Home;
