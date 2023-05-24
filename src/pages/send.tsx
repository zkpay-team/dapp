import { useContext } from 'react';
import Steps from '../components/Steps';
import SendForm from '../modules/Railgun/components/SendForm';
import RailgunContext from '../modules/Railgun/context/railgun';

function Send() {
  const { wallet, account } = useContext(RailgunContext);
  console.log({ account });

  if (!account?.isConnected || !wallet?.railgunWalletInfo) {
    return <Steps />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Multisend <span className='text-gray-100'>privately</span>
      </p>
      <div className='mt-10'>
        <SendForm />
      </div>
    </div>
  );
}

export default Send;
