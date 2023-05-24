import { deserializeTransaction } from '@railgun-community/shared-models';
import { Provider } from '@wagmi/core';
import { Signer } from 'ethers';

export const executeSendTransaction = async (
  signer: Signer,
  provider: Provider,
  serializedTransaction: string,
): Promise<boolean> => {
  console.log('entered executeSendTransaction');
  try {
    const address = await signer.getAddress();
    const nonce = await provider.getTransactionCount(address, 'pending');

    // Deserialize the transaction
    const transactionReq = deserializeTransaction(serializedTransaction, nonce, 5);
    console.log('🚀 ~ file: useExecuteTransaction.ts:36 ~ transactionReq:', transactionReq);

    transactionReq.from = await signer.getAddress();

    console.log('await signer.getAddress()', await signer.getAddress());

    // Send the transaction
    let txResponse;
    try {
      txResponse = await signer.sendTransaction(transactionReq);
    } catch (error) {
      console.log('Error sending transaction:', error);
    }

    // Wait for the transaction to be mined
    if (!txResponse) {
      throw new Error('Missing txResponse.');
    }

    console.log('waiting...');
    const receipt = await txResponse.wait();

    console.log('Transaction successfully mined:', receipt);
    return true;
  } catch (err) {
    console.error('Error sending transaction:', err);
    throw new Error('Error sending transaction.');
  }
};
