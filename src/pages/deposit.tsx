import { useContext } from 'react';
import Steps from '../components/Steps';
import RailgunContext from '../modules/Railgun/context/railgun';
import SwapForm from '../modules/1inch/components/SwapForm';

function Deposit() {
  const { wallet, account } = useContext(RailgunContext);

  if (!account?.isConnected || !wallet?.railgunWalletInfo) {
    return <Steps />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Swap <span className='text-gray-100'>and shield</span>
      </p>

      <div className='mt-4'>
        <SwapForm />
      </div>
    </div>
  );
}

export default Deposit;
