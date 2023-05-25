import { generateTransferProof } from '@railgun-community/quickstart';
import { LoadRailgunWalletResponse, NetworkName } from '@railgun-community/shared-models';
import { getEncryptionKey } from './encryptionKey';
import { RailgunERC20AmountRecipient } from '@railgun-community/shared-models';

export const executeGenerateTransferProof = async (
  wallet: LoadRailgunWalletResponse,
  erc20AmountsByRecipient: RailgunERC20AmountRecipient[],
): Promise<boolean> => {
  const progressCallback = (progress: number) => {
    // Handle proof progress (show in UI).
    // Proofs can take 20-30 seconds on slower devices.
    console.log(`Proof generation progress: ${progress}%`);
  };

  const showSenderAddressToRecipient = true;
  const sendWithPublicWallet = true;
  const railgunWalletID = wallet?.railgunWalletInfo?.id;
  const encryptionKey = getEncryptionKey();
  const overallBatchMinGasPrice = '0';
  const tokenAmountRecipients = erc20AmountsByRecipient;

  if (!railgunWalletID || !encryptionKey) {
    throw new Error('Railgun wallet not configured');
  }

  const { error } = await generateTransferProof(
    NetworkName.EthereumGoerli,
    railgunWalletID,
    encryptionKey,
    showSenderAddressToRecipient,
    null,
    tokenAmountRecipients,
    [], // nftAmountRecipients
    undefined,
    sendWithPublicWallet,
    overallBatchMinGasPrice,
    progressCallback,
  );

  if (error) {
    console.error(error);
    throw new Error(error);
  }

  return true;
};
