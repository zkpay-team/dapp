import { generateTransferProof } from '@railgun-community/quickstart';
import { LoadRailgunWalletResponse, NetworkName } from '@railgun-community/shared-models';

export const executeGenerateTransferProof = async (
  wallet: LoadRailgunWalletResponse,
  erc20AmountsByRecipient: [],
): Promise<boolean> => {
  const memoText = 'Getting the salariess! 🍝😋';

  const progressCallback = (progress: number) => {
    // Handle proof progress (show in UI).
    // Proofs can take 20-30 seconds on slower devices.
    console.log(`Proof generation progress: ${progress}%`);
  };

  const showSenderAddressToRecipient = true;
  const sendWithPublicWallet = true;
  const railgunWalletID = wallet?.railgunWalletInfo?.id || '0xnoWalletIDFound';
  const overallBatchMinGasPrice = '0';
  const tokenAmountRecipients = erc20AmountsByRecipient;
  console.log('tokenAmountRecipients showing before generating', tokenAmountRecipients);
  const { error } = await generateTransferProof(
    NetworkName.EthereumGoerli,
    railgunWalletID,
    wallet?.encryptionKey,
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
    console.log('encryptionKey', wallet?.encryptionKey);
    console.log('tokenAmountRecipients', tokenAmountRecipients);

    console.error(error);
    throw new Error(error);
  }

  return true;
};
