import { useContext } from 'react';
import Steps from '../components/Steps';
import WithdrawSwapForm from '../modules/1inch/components/WithdrawSwapForm';
import RailgunContext from '../modules/Railgun/context/railgun';

function Deposit() {
  const { wallet, account } = useContext(RailgunContext);

  if (!account?.isConnected || !wallet?.railgunWalletInfo) {
    return <Steps />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Unshield <span className='text-gray-100'>and swap</span>
      </p>

      <div className='mt-4'>
        <WithdrawSwapForm />
      </div>
    </div>
  );
}

export default Deposit;
