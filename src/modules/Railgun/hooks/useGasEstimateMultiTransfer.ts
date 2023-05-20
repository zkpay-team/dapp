import { useState, useEffect } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGasEstimate = async () => {
      // Constants can be replaced with dynamic values as necessary
      const encryptionKey = '0101010101010101010101010101010101010101010101010101010101010101';
      const memoText = 'Getting the salariess! 🍝😋';

      const erc20AmountRecipients: RailgunERC20AmountRecipient[] = [
        {
          tokenAddress: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60', // GOERLI DAI
          amountString: '0x10', // hexadecimal amount decimal amout meaning 16
          recipientAddress: railgunAddress,
        },
        {
          tokenAddress: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60', // GOERLI DAI
          amountString: '0x10', // hexadecimal amount meaning 16
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
        [],
        originalGasDetailsSerialized,
        feeTokenDetails,
        sendWithPublicWallet,
      );

      if (error) {
        setError(error);
        return;
      }

      setGasEstimate(BigNumber.from(gasEstimateString));
    };

    fetchGasEstimate();
  }, [railgunAddress, railgunWalletID, selectedTokenFeeAddress, selectedRelayer]);

  return { gasEstimate, error };
}
