import { gasEstimateForUnprovenTransfer } from '@railgun-community/quickstart';

import {
  EVMGasType,
  FeeTokenDetails,
  LoadRailgunWalletResponse,
  NetworkName,
  TransactionGasDetailsSerialized,
} from '@railgun-community/shared-models';
import { BigNumber, Signer } from 'ethers';
import { getEncryptionKey } from './encryptionKey';
import { RailgunERC20AmountRecipient } from '@railgun-community/shared-models';

export const fetchGasEstimate = async (
  signer: Signer,
  wallet: LoadRailgunWalletResponse,
  erc20AmountsByRecipient: RailgunERC20AmountRecipient[],
): Promise<BigNumber> => {
  const feeData = await signer?.getFeeData();
  const gasPrice = feeData?.gasPrice?.toHexString();

  const maxFeePerGasString = feeData?.maxFeePerGas?.toHexString();
  const maxPriorityFeePerGasString = feeData?.maxPriorityFeePerGas?.toHexString();

  if (!maxFeePerGasString || !maxPriorityFeePerGasString) {
    throw new Error('Gas info missing');
  }

  const originalGasDetailsSerialized: TransactionGasDetailsSerialized = {
    evmGasType: EVMGasType.Type2,
    gasEstimateString: '0x00',
    maxFeePerGasString: maxFeePerGasString,
    maxPriorityFeePerGasString: maxPriorityFeePerGasString,
    // gasPriceString: gasPrice,
  };

  const selectedTokenFeeAddress = '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60'; //goerli dai // TODO: should be in env
  const selectedRelayer = {
    feePerUnitGas: '0',
  };
  const feeTokenDetails: FeeTokenDetails = {
    tokenAddress: selectedTokenFeeAddress,
    feePerUnitGas: selectedRelayer.feePerUnitGas,
  };

  const sendWithPublicWallet = true;
  const railgunWalletID = wallet?.railgunWalletInfo?.id;
  const encryptionKey = getEncryptionKey();

  if (!railgunWalletID || !encryptionKey) {
    throw new Error('Railgun wallet not configured');
  }

  const { gasEstimateString, error } = await gasEstimateForUnprovenTransfer(
    NetworkName.EthereumGoerli,
    railgunWalletID,
    encryptionKey,
    null,
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
