import { populateProvedTransfer } from '@railgun-community/quickstart';
import {
  EVMGasType,
  LoadRailgunWalletResponse,
  NetworkName,
  TransactionGasDetailsSerialized,
} from '@railgun-community/shared-models';
import { BigNumber, Signer, ethers } from 'ethers';

export const createPopulateProvedTransfer = async (
  signer: Signer,
  gasEstimate: BigNumber,
  wallet: LoadRailgunWalletResponse,
  erc20AmountsByRecipient: [],
): Promise<string> => {
  const memoText = 'Getting the salariess! 🍝😋';

  const feeData = await signer?.getFeeData();
  console.log(
    '======================= populating Proof with gasEstimateForDeposit =======================',
  );
  console.log('FeeData?.gasPrice?.toString()', feeData?.gasPrice?.toString());

  console.log('ethers.utils.hexlify(gasEstimate),', ethers.utils.hexlify(gasEstimate));
  const gasPrice = feeData?.gasPrice?.toHexString() ?? '0x0100000000';
  console.log('gasPrice', gasPrice);

  const gasDetailsSerialized: TransactionGasDetailsSerialized = {
    evmGasType: EVMGasType.Type2, // Depends on the chain (BNB uses type 0) Goerli is type 1.
    gasEstimateString: gasEstimate.toHexString(), // Output from gasEstimateForDeposit
    // gasPriceString: gasPrice, // Current gas price   (This one is needed for type 1 tx)
    maxFeePerGasString: feeData?.maxFeePerGas?.toHexString() ?? '0x100000',
    maxPriorityFeePerGasString: feeData?.maxPriorityFeePerGas?.toHexString() ?? '0x100000',
  };
  // const erc20AmountsByRecipient = tokenAmountRecipients;
  const showSenderAddressToRecipient = true;
  const railgunWalletID = wallet?.railgunWalletInfo?.id || '0xnoWalletIDFound';
  const sendWithPublicWallet = true;
  const overallBatchMinGasPrice = '0';

  console.log('erc20AmountsByRecipient showing before populating', erc20AmountsByRecipient);
  const { serializedTransaction: serializedTx, error } = await populateProvedTransfer(
    NetworkName.EthereumGoerli,
    railgunWalletID,
    showSenderAddressToRecipient,
    memoText,
    erc20AmountsByRecipient,
    [], // nftAmountRecipients
    undefined, // relayerFeeTokenAmountRecipient
    sendWithPublicWallet,
    overallBatchMinGasPrice,
    gasDetailsSerialized,
  );

  // console.log(
  //   '!!!!!!!!!!!!!!!!!!!!!!!!!!!finished the populateProvedTransfer function!!!!!!!§!!!!!!!!!!!!!!!!!!!!',
  // );

  if (error) {
    console.log('There is ano error creating the populate Proof transaction');
    console.error(error);
    throw new Error(error);
  }

  if (!serializedTx) {
    throw new Error('no serializedTx');
  }

  console.log('There is no error creating the populate Proof transaction');
  console.log('serializedTransaction', serializedTx);
  return serializedTx;
};
