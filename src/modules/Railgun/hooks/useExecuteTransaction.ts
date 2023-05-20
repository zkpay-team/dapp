import { useCallback, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { useSigner, useProvider } from 'wagmi';
import RailgunContext from '../context/railgun';

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
        // Deserialize the transaction
        const deserializedTransaction = ethers.utils.parseTransaction(serializedTransaction);

        // Prepare transaction request
        const transactionRequest = {
          to: deserializedTransaction.to,
          value: deserializedTransaction.value,
          nonce: deserializedTransaction.nonce,
          gasLimit: deserializedTransaction.gasLimit,
          gasPrice: deserializedTransaction.gasPrice,
          data: deserializedTransaction.data,
          chainId: deserializedTransaction.chainId,
        };

        // Connect to the signer
        const connectedSigner = signer.connect(provider);

        // Sign the transaction
        const signedTransaction = await connectedSigner.signTransaction(transactionRequest);

        // Send the transaction
        const txResponse = await provider.sendTransaction(signedTransaction);

        // Wait for the transaction to be mined
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
