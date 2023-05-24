import { useCallback, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { useSigner, useProvider, chain } from 'wagmi';
import RailgunContext from '../context/railgun';
import { sign } from 'crypto';

import { deserializeTransaction } from '@railgun-community/shared-models';

export function useExecuteTransaction() {
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const provider = useProvider({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const executeSendTransaction = useCallback(
    async (serializedTransaction: string | undefined) => {
      console.log('entered executeSendTransaction');
      try {
        if (!serializedTransaction) {
          console.error('Missing serializedTransaction.');
          return;
        }
        if (!provider) {
          console.error('Missing provider.');
          return;
        }
        if (!signer) {
          console.error('Missing signer.');
          return;
        }

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
          console.error('Missing txResponse.');
          return;
        }

        console.log('waiting...');
        const receipt = await txResponse.wait();

        console.log('Transaction successfully mined:', receipt);
      } catch (err) {
        console.error('Error sending transaction:', err);
      }
    },
    [signer, provider],
  );

  return executeSendTransaction;
}
