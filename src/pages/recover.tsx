import { useContext } from 'react';
import RailgunContext from '../modules/Railgun/context/railgun';
import Steps from '../components/Steps';

function Recover() {
  const { wallet, account } = useContext(RailgunContext);

  if (!account?.isConnected || !wallet?.railgunWalletInfo) {
    return <Steps />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Recover <span className='text-gray-100'>my wallet</span>
      </p>
    </div>
  );
}

export default Recover;
