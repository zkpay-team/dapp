import { useCallback, useContext } from 'react';
import RailgunContext from '../modules/Railgun/context/railgun';
import SendForm from '../modules/Railgun/components/SendForm';

function Send() {
  const { account } = useContext(RailgunContext);
  console.log({ account });

  const {
    fetchGasEstimate,
    gasEstimate,
    executeGenerateTransferProof,
    createPopulateProvedTransfer,
    serializedTransaction,
    executeSendTransaction,
  } = useContext(RailgunContext);

  const createProof = useCallback(() => {
    console.log('create the Proof');
    console.log('should call function exposed from context.');
    console.log('this: ', { executeGenerateTransferProof });
    if (executeGenerateTransferProof) {
      console.log("it exists, let's call it.");
      executeGenerateTransferProof();
    }
    return;
  }, [executeGenerateTransferProof]);

  const callGasEstimate = useCallback(() => {
    console.log('Get the gas esimate!');
    console.log('should call function exposed from context.');
    console.log('this: ', { fetchGasEstimate });
    if (fetchGasEstimate) {
      console.log("it exists, let's call it.");
      fetchGasEstimate();
    }
    return;
  }, [fetchGasEstimate]);

  const createPopulatedTx = useCallback(() => {
    console.log('create the Populated Transaction');
    console.log('should call function exposed from context.');
    console.log('this: ', { executeGenerateTransferProof });
    if (!gasEstimate) {
      console.log('no gas estimate, so we can not create the populated transaction.');
      return;
    }
    if (createPopulateProvedTransfer) {
      console.log("it exists, let's call it.");
      createPopulateProvedTransfer(gasEstimate);
    } else {
      console.log("createPopulateProvedTransfer doesn't exist, so we can't call it.");
    }
    return;
  }, [createPopulateProvedTransfer, gasEstimate]);

  const runExecuteSendTransaction = useCallback(() => {
    console.log('run the executeSendTransaction');
    console.log('should call function exposed from context.');
    console.log('this: ', { executeSendTransaction });

    console.log('serializedTransaction: ', serializedTransaction);

    if (executeSendTransaction && serializedTransaction) {
      console.log("it exists, let's call it.");
      executeSendTransaction(serializedTransaction);
    } else {
      console.log("executeSendTransaction doesn't exist, so we can't call it.");
    }
    return;
  }, [serializedTransaction, executeSendTransaction]);

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium mb-8'>
        Multisend <span className='text-gray-100'>privately</span>
      </p>
      <div className='mt-10'>
        <SendForm />
      </div>

      <hr />
      <p>DEBUGG</p>
      <button
        type='button'
        className='hover:bg-endnight hover:text-white bg-greeny text-midnight px-5 py-2 rounded'
        onClick={createProof}>
        Create Proof to Send.
      </button>
      <button
        type='button'
        className='hover:text-green-600 hover:bg-green-50 bg-green-500 text-white px-5 py-2 rounded-lg'
        onClick={createPopulatedTx}>
        Create Populated Transaction.
      </button>
      <button
        type='button'
        className='hover:text-green-600 hover:bg-green-50 bg-green-500 text-white px-5 py-2 rounded-lg'
        onClick={callGasEstimate}>
        Get Gas Estimate.
      </button>
      <button
        type='button'
        className='hover:bg-endnight hover:text-white bg-greeny text-midnight px-5 py-2 rounded'
        onClick={() => {
          runExecuteSendTransaction();
        }}>
        Send Transactions
      </button>
      <h1>{serializedTransaction}</h1>
    </div>
  );
}

export default Send;
