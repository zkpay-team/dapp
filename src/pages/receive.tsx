import { useContext } from 'react';
import RailgunAddress from '../modules/Railgun/components/RailgunAddress';
import ReceiveForm from '../modules/Railgun/components/ReceiveForm';
import RailgunContext from '../modules/Railgun/context/railgun';
import Steps from '../components/Steps';

function Receive() {
  const { wallet, account } = useContext(RailgunContext);

  if (!account?.isConnected || !wallet?.railgunWalletInfo) {
    return <Steps />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Receive <span className='text-gray-100'>privately</span>
      </p>

      <RailgunAddress />

      <hr />

      <div className='mt-10'>
        <ReceiveForm />
      </div>
    </div>
  );
}

export default Receive;
