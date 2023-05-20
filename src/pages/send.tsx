import { useCallback, useContext, useEffect } from 'react';
import RailgunContext from '../modules/Railgun/context/railgun';
import { useProvider, useSigner } from 'wagmi';
import { ethers } from 'ethers';

function Send() {
  const { account } = useContext(RailgunContext);
  console.log({ account });

  const {
    fetchGasEstimate,
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

  const gasEstimate = useCallback(() => {
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
    if (createPopulateProvedTransfer) {
      console.log("it exists, let's call it.");
      createPopulateProvedTransfer();
    } else {
      console.log("createPopulateProvedTransfer doesn't exist, so we can't call it.");
    }
    return;
  }, [createPopulateProvedTransfer]);

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
        Payroll <span className='text-gray-100'>multisend </span>
      </p>
      <button
        type='button'
        className='hover:text-green-600 hover:bg-green-50 bg-green-500 text-white px-5 py-2 rounded-lg'
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
        onClick={gasEstimate}>
        Get Gas Estimate.
      </button>
      <button
        type='button'
        className='hover:text-green-600 hover:bg-green-50 bg-green-500 text-white px-5 py-2 rounded-lg'
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
