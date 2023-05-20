import { useState, useCallback } from 'react';
import { BigNumber, ethers } from 'ethers';
import { gasEstimateForUnprovenTransfer } from '@railgun-community/quickstart';
import {
  NetworkName,
  FeeTokenDetails,
  RailgunERC20AmountRecipient,
  TransactionGasDetailsSerialized,
  EVMGasType,
} from '@railgun-community/shared-models';
import { useSigner } from 'wagmi';
import { erc20AmountRecipients } from '../context/railgun';

type UseGasEstimateMultiTransferParams = {
  railgunAddresses: string[];
  railgunWalletID: string;
  selectedTokenFeeAddress: string;
  selectedRelayer: { feePerUnitGas: string };
};

export function useGasEstimateMultiTransfer({
  railgunAddresses,
  railgunWalletID,
  selectedTokenFeeAddress,
  selectedRelayer,
}: UseGasEstimateMultiTransferParams) {
  const [gasEstimate, setGasEstimate] = useState<BigNumber | null>(null);
  const [estimateError, setEstimateError] = useState<string | null>(null);

  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const fetchGasEstimate = useCallback(async () => {
    const wallet: string | null = localStorage.getItem('wallet');
    let encryptionKey: string;

    if (wallet !== null) {
      const walletObject: { encryptionKey?: string } = JSON.parse(wallet);

      if ('encryptionKey' in walletObject) {
        encryptionKey = walletObject?.encryptionKey ?? 'no-ecryption-key-present';
      } else {
        console.error('encryptionKey does not exist in the wallet object.');
      }
    } else {
      console.error("No 'wallet' object in local storage.");
    }

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

    const feeTokenDetails: FeeTokenDetails = {
      tokenAddress: selectedTokenFeeAddress,
      feePerUnitGas: selectedRelayer.feePerUnitGas,
    };

    const sendWithPublicWallet = true;
    console.log('erc20AmountRecipients showing before estimating', erc20AmountRecipients);
    const { gasEstimateString, error } = await gasEstimateForUnprovenTransfer(
      NetworkName.EthereumGoerli,
      railgunWalletID,
      encryptionKey,
      memoText,
      erc20AmountRecipients,
      [], // nftAmountRecipients
      originalGasDetailsSerialized,
      feeTokenDetails,
      sendWithPublicWallet,
    );

    if (error) {
      setEstimateError(error);
      return;
    }

    setGasEstimate(BigNumber.from(gasEstimateString));
  }, [railgunAddresses, railgunWalletID, selectedTokenFeeAddress, selectedRelayer, signer]);

  return { gasEstimate, estimateError, fetchGasEstimate };
}
