import { useState, useCallback } from 'react';
import { BigNumber } from 'ethers';
import { gasEstimateForUnprovenTransfer } from '@railgun-community/quickstart';
import {
  NetworkName,
  FeeTokenDetails,
  RailgunERC20AmountRecipient,
  TransactionGasDetailsSerialized,
  EVMGasType,
} from '@railgun-community/shared-models';

type UseGasEstimateMultiTransferParams = {
  railgunAddress: string;
  railgunWalletID: string;
  selectedTokenFeeAddress: string;
  selectedRelayer: { feePerUnitGas: string };
};

export function useGasEstimateMultiTransfer({
  railgunAddress,
  railgunWalletID,
  selectedTokenFeeAddress,
  selectedRelayer,
}: UseGasEstimateMultiTransferParams) {
  const [gasEstimate, setGasEstimate] = useState<BigNumber | null>(null);
  const [estimateError, setEstimateError] = useState<string | null>(null);

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

    const erc20AmountRecipients: RailgunERC20AmountRecipient[] = [
      {
        tokenAddress: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60', // GOERLI DAI
        amountString: '0x10', // hexadecimal amount decimal meaning 16
        recipientAddress: railgunAddress,
      },
    ];

    const originalGasDetailsSerialized: TransactionGasDetailsSerialized = {
      evmGasType: EVMGasType.Type2,
      gasEstimateString: '0x00',
      maxFeePerGasString: '0x100000',
      maxPriorityFeePerGasString: '0x010000',
    };

    const feeTokenDetails: FeeTokenDetails = {
      tokenAddress: selectedTokenFeeAddress,
      feePerUnitGas: selectedRelayer.feePerUnitGas,
    };

    const sendWithPublicWallet = false;

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
  }, [railgunAddress, railgunWalletID, selectedTokenFeeAddress, selectedRelayer]);

  return { gasEstimate, estimateError, fetchGasEstimate };
}
