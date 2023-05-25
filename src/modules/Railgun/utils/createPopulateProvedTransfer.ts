import { populateProvedTransfer } from '@railgun-community/quickstart';
import {
  EVMGasType,
  LoadRailgunWalletResponse,
  NetworkName,
  TransactionGasDetailsSerialized,
} from '@railgun-community/shared-models';
import { BigNumber, Signer, ethers } from 'ethers';
import { RailgunERC20AmountRecipient } from '@railgun-community/shared-models';

export const createPopulateProvedTransfer = async (
  signer: Signer,
  gasEstimate: BigNumber,
  wallet: LoadRailgunWalletResponse,
  erc20AmountsByRecipient: RailgunERC20AmountRecipient[],
): Promise<string> => {
  const feeData = await signer?.getFeeData();
  const gasPrice = feeData?.gasPrice?.toHexString();

  const maxFeePerGasString = feeData?.maxFeePerGas?.toHexString();
  const maxPriorityFeePerGasString = feeData?.maxPriorityFeePerGas?.toHexString();

  if (!maxFeePerGasString || !maxPriorityFeePerGasString) {
    throw new Error('Gas info missing');
  }

  const gasDetailsSerialized: TransactionGasDetailsSerialized = {
    evmGasType: EVMGasType.Type2, // Depends on the chain (BNB uses type 0) Goerli is type 1.
    gasEstimateString: gasEstimate.toHexString(), // Output from gasEstimateForDeposit
    // gasPriceString: gasPrice, // Current gas price   (This one is needed for type 1 tx)
    maxFeePerGasString: maxFeePerGasString,
    maxPriorityFeePerGasString: maxPriorityFeePerGasString,
  };
  // const erc20AmountsByRecipient = tokenAmountRecipients;
  const showSenderAddressToRecipient = true;
  const railgunWalletID = wallet?.railgunWalletInfo?.id || '0xnoWalletIDFound';
  const sendWithPublicWallet = true;
  const overallBatchMinGasPrice = '0';

  const { serializedTransaction: serializedTx, error } = await populateProvedTransfer(
    NetworkName.EthereumGoerli,
    railgunWalletID,
    showSenderAddressToRecipient,
    null,
    erc20AmountsByRecipient,
    [], // nftAmountRecipients
    undefined, // relayerFeeTokenAmountRecipient
    sendWithPublicWallet,
    overallBatchMinGasPrice,
    gasDetailsSerialized,
  );

  if (error) {
    console.error(error);
    throw new Error(error);
  }

  if (!serializedTx) {
    throw new Error('no serializedTx');
  }

  return serializedTx;
};
