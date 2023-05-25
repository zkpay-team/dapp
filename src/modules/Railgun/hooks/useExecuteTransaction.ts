import { useCallback, useContext } from 'react';
import { useProvider, useSigner } from 'wagmi';
import RailgunContext from '../context/railgun';
import { createPopulateProvedTransfer } from '../utils/createPopulateProvedTransfer';
import { executeGenerateTransferProof } from '../utils/executeGenerateTransferProof';
import { executeSendTransaction } from '../utils/executeSendTransaction';
import { fetchGasEstimate } from '../utils/fetchGasEstimate';
import { RailgunERC20AmountRecipient } from '@railgun-community/shared-models';
import { toast } from 'react-toastify';

export function useExecuteTransaction() {
  const { wallet } = useContext(RailgunContext);
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const provider = useProvider({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const executeTransaction = useCallback(
    async (erc20AmountsByRecipient: RailgunERC20AmountRecipient[]): Promise<boolean> => {
      const toastId = toast.loading('Preparing the transaction', {
        position: 'bottom-right',
        autoClose: false,
        pauseOnHover: false,
        type: toast.TYPE.INFO,
        progress: 0,
        theme: 'dark',
      });

      try {
        if (!signer || !wallet) {
          throw new Error('Signer or Wallet cant be null');
        }

        const gasEstimate = await fetchGasEstimate(signer, wallet, erc20AmountsByRecipient);
        toast.update(toastId, { render: 'Generating the proof' });
        await executeGenerateTransferProof(wallet, erc20AmountsByRecipient);

        const serializedTransaction = await createPopulateProvedTransfer(
          signer,
          gasEstimate,
          wallet,
          erc20AmountsByRecipient,
        );

        toast.update(toastId, { render: 'Sending the transaction' });
        await executeSendTransaction(signer, provider, serializedTransaction);
        toast.update(toastId, { progress: 100 });

        toast.update(toastId, {
          type: toast.TYPE.SUCCESS,
          render: 'Transaction executed',
          autoClose: 5000,
          closeOnClick: true,
          isLoading: false,
        });

        return true;
      } catch (error) {
        toast.update(toastId, {
          type: toast.TYPE.ERROR,
          render: 'An error happend during the transaction',
          autoClose: 5000,
          closeOnClick: true,
          isLoading: false,
        });
        return false;
      }
    },
    [],
  );

  return executeTransaction;
}
