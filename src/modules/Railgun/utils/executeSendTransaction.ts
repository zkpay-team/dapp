import { deserializeTransaction } from '@railgun-community/shared-models';
import { Provider } from '@wagmi/core';
import { Signer } from 'ethers';

export const executeSendTransaction = async (
  signer: Signer,
  provider: Provider,
  serializedTransaction: string,
): Promise<boolean> => {
  try {
    const address = await signer.getAddress();
    const nonce = await provider.getTransactionCount(address, 'pending');

    // Deserialize the transaction
    const transactionReq = deserializeTransaction(serializedTransaction, nonce, 5);
    transactionReq.from = await signer.getAddress();

    // Send the transaction
    const txResponse = await signer.sendTransaction(transactionReq);

    // Wait for the transaction to be mined
    if (!txResponse) {
      throw new Error('Missing txResponse.');
    }
    const receipt = await txResponse.wait();
    return true;
  } catch (err) {
    console.error('Error sending transaction:', err);
    throw new Error('Error sending transaction.');
  }
};
