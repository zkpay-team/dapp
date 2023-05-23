import { gasEstimateForUnprovenTransfer } from '@railgun-community/quickstart';

import {
  EVMGasType,
  FeeTokenDetails,
  LoadRailgunWalletResponse,
  NetworkName,
  TransactionGasDetailsSerialized,
} from '@railgun-community/shared-models';
import { BigNumber, Signer } from 'ethers';

export const fetchGasEstimate = async (
  signer: Signer,
  wallet: LoadRailgunWalletResponse,
  erc20AmountsByRecipient: [],
): Promise<BigNumber> => {
  const memoText = 'Getting the salariess! 🍝😋';
  const feeData = await signer?.getFeeData();
  console.log('FeeData?.gasPrice?.toString()', feeData?.gasPrice?.toString());
  const gasPrice = feeData?.gasPrice?.toHexString() ?? '0x0100000000';
  console.log('gasPrice', gasPrice);

  const originalGasDetailsSerialized: TransactionGasDetailsSerialized = {
    evmGasType: EVMGasType.Type2,
    gasEstimateString: '0x00',
    maxFeePerGasString: feeData?.maxFeePerGas?.toHexString() ?? '0x100000',
    maxPriorityFeePerGasString: feeData?.maxPriorityFeePerGas?.toHexString() ?? '0x100000',
    // gasPriceString: gasPrice,
  };

  const selectedTokenFeeAddress = '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60'; //goerli dai
  const selectedRelayer = {
    feePerUnitGas: '0',
  };
  const feeTokenDetails: FeeTokenDetails = {
    tokenAddress: selectedTokenFeeAddress,
    feePerUnitGas: selectedRelayer.feePerUnitGas,
  };

  const sendWithPublicWallet = true;

  const railgunWalletID = wallet?.railgunWalletInfo?.id || '0xnoWalletIDFound';

  console.log('erc20AmountsByRecipient showing before estimating', erc20AmountsByRecipient);
  const { gasEstimateString, error } = await gasEstimateForUnprovenTransfer(
    NetworkName.EthereumGoerli,
    railgunWalletID,
    wallet?.encryptionKey,
    memoText,
    erc20AmountsByRecipient,
    [], // nftAmountRecipients
    originalGasDetailsSerialized,
    feeTokenDetails,
    sendWithPublicWallet,
  );

  if (error) {
    throw new Error(error);
  }

  return BigNumber.from(gasEstimateString);
};
