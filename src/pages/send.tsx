import { useCallback, useContext } from 'react';
import RailgunContext from '../modules/Railgun/context/railgun';

function Send() {
  const { account } = useContext(RailgunContext);
  console.log({ account });

  const { fetchGasEstimate, executeGenerateTransferProof } = useContext(RailgunContext);

  const createProof = useCallback(() => {
    console.log('create the Proof');
    console.log('should call function exposed from context.');
    console.log('this: ', { executeGenerateTransferProof });
    if (executeGenerateTransferProof) {
      console.log("it exists, let's call it.");
      executeGenerateTransferProof();
    }
    return;
  }, []);

  const gasEstimate = useCallback(() => {
    console.log('Get the gas esimate!');
    console.log('should call function exposed from context.');
    console.log('this: ', { fetchGasEstimate });
    if (fetchGasEstimate) {
      console.log("it exists, let's call it.");
      fetchGasEstimate();
    }
    return;
  }, []);

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Payroll <span className='text-gray-100'>multisend </span>
      </p>
      <button
        type='button'
        className='hover:bg-endnight hover:text-white bg-greeny text-midnight px-5 py-2 rounded-lg'
        onClick={createProof}>
        Create Proof to Send.
      </button>
      <button
        type='button'
        className='hover:bg-endnight hover:text-white bg-greeny text-midnight px-5 py-2 rounded-lg'
        onClick={gasEstimate}>
        Get Gas Estimate.
      </button>
      <button
        type='button'
        className='hover:bg-endnight hover:text-white bg-greeny text-midnight px-5 py-2 rounded-lg'
        onClick={() => {
          console.log('Sendddd it boyy');
        }}>
        Send Transactions
      </button>
    </div>
  );
}

export default Send;
