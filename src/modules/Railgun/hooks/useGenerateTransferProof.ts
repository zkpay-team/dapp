import { useState, useCallback } from 'react';
import { generateTransferProof } from '@railgun-community/quickstart';
import { NetworkName, RailgunERC20AmountRecipient } from '@railgun-community/shared-models';

type Optional<T> = T | undefined;

type UseGenerateTransferProofParams = {
  railgunWalletID: string;
  tokenAmountRecipients: RailgunERC20AmountRecipient[];
  sendWithPublicWallet: boolean;
  overallBatchMinGasPrice: Optional<string>;
};

export function useGenerateTransferProof({
  railgunWalletID,
  tokenAmountRecipients,
  sendWithPublicWallet,
  overallBatchMinGasPrice,
}: UseGenerateTransferProofParams) {
  const [proofError, setProofError] = useState<string | null>(null);

  const executeGenerateTransferProof = useCallback(async () => {
    const wallet: string | null = localStorage.getItem('wallet');
    if (wallet === null) {
      console.error("No 'wallet' object in local storage.");
      return;
    }

    const walletObject: { encryptionKey?: string } = JSON.parse(wallet);

    if (!('encryptionKey' in walletObject)) {
      console.error('encryptionKey does not exist in the wallet object.');
      return;
    }

    const encryptionKey: string = walletObject?.encryptionKey ?? 'no-ecryption-key-present';

    const memoText = 'Getting the salariess! 🍝😋';

    const progressCallback = (progress: number) => {
      // Handle proof progress (show in UI).
      // Proofs can take 20-30 seconds on slower devices.
      console.log(`Proof generation progress: ${progress}%`);
    };

    // const relayerFeeTokenAmountRecipient = '0x0000000000000000000000000000000000000000';

    const showSenderAddressToRecipient = true;
    console.log('tokenAmountRecipients showing before generating', tokenAmountRecipients);
    const { error } = await generateTransferProof(
      NetworkName.EthereumGoerli,
      railgunWalletID,
      encryptionKey,
      showSenderAddressToRecipient,
      memoText,
      tokenAmountRecipients,
      [], // nftAmountRecipients
      undefined,
      sendWithPublicWallet,
      overallBatchMinGasPrice,
      progressCallback,
    );

    if (error) {
      console.log('the error comes from generateTransferProof');
      console.log('railgunWalletID', railgunWalletID);
      console.log('encryptionKey', encryptionKey);
      console.log('tokenAmountRecipients', tokenAmountRecipients);

      console.error(error);
      setProofError(error);
    }
  }, [railgunWalletID, tokenAmountRecipients, sendWithPublicWallet, overallBatchMinGasPrice]);

  return { executeGenerateTransferProof, proofError };
}
