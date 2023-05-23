import { useCallback, useContext } from 'react';
import { useProvider, useSigner } from 'wagmi';
import RailgunContext from '../context/railgun';
import { createPopulateProvedTransfer } from '../utils/createPopulateProvedTransfer';
import { executeGenerateTransferProof } from '../utils/executeGenerateTransferProof';
import { executeSendTransaction } from '../utils/executeSendTransaction';
import { fetchGasEstimate } from '../utils/fetchGasEstimate';

export function useExecuteTransaction(): (erc20AmountsByRecipient: []) => void {
  const { wallet } = useContext(RailgunContext);
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const provider = useProvider({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const executeChainOfFunctions = useCallback(async (erc20AmountsByRecipient: []) => {
    try {
      if (!signer || !wallet) {
        return;
      }

      console.log('Get the gas estimate!');
      const gasEstimate = await fetchGasEstimate(signer, wallet, erc20AmountsByRecipient);
      console.log('Estimate', gasEstimate);

      console.log('create the Proof');
      await executeGenerateTransferProof(wallet, erc20AmountsByRecipient);

      console.log('Populate proved transfer');
      const serializedTransaction = await createPopulateProvedTransfer(
        signer,
        gasEstimate,
        wallet,
        erc20AmountsByRecipient,
      );

      console.log('Execute send tx');
      await executeSendTransaction(signer, provider, serializedTransaction);

      console.log('proof created');
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  return executeChainOfFunctions;
}
