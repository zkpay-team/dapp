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

// Define the parameters for the hook
type UseGasEstimateMultiTransferParams = {
  railgunAddress: string; // RAILGUN wallet to transfer to.
  railgunWalletID: string; // Database encryption key. Keep this very safe.
  selectedTokenFeeAddress: string; // Token Fee for selected Relayer.
  selectedRelayer: { feePerUnitGas: string }; // Fee per unit gas for the selected relayer
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
      const encryptionKey = '0101010101010101010101010101010101010101010101010101010101010101';
      const memoText = 'Getting the salariess! 🍝😋'; // Optional encrypted memo text only readable by the sender and receiver.

      // Formatted token amounts to transfer.
      const erc20AmountRecipients: RailgunERC20AmountRecipient[] = [
        {
          tokenAddress: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60', // GOERLI DAI
          amountString: '0x10', // hexadecimal amount decimal meaning 16
          recipientAddress: railgunAddress,
        },
        {
          tokenAddress: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60', // GOERLI DAI
          amountString: '0x10', // hexadecimal amount meaning 16
          recipientAddress: railgunAddress,
        },
      ];

      // Gas price, used to calculate Relayer Fee iteratively.
      const originalGasDetailsSerialized: TransactionGasDetailsSerialized = {
        evmGasType: EVMGasType.Type2, // Depends on the chain (BNB uses type 0)
        gasEstimateString: '0x00', // Always 0, we don't have this yet.
        maxFeePerGasString: '0x100000', // Current gas Max Fee
        maxPriorityFeePerGasString: '0x010000', // Current gas Max Priority Fee
      };

      // Token Fee for selected Relayer.
      const feeTokenDetails: FeeTokenDetails = {
        tokenAddress: selectedTokenFeeAddress,
        feePerUnitGas: selectedRelayer.feePerUnitGas,
      };

      // Whether to use a Relayer or self-signing wallet. True for self-signing, false for Relayer.
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
        setError(error); // Handle gas estimate error.
        return;
      }

      setGasEstimate(BigNumber.from(gasEstimateString)); // Save the gas estimate
    };

    fetchGasEstimate();
  }, [railgunAddress, railgunWalletID, selectedTokenFeeAddress, selectedRelayer]);

  return { gasEstimate, error }; // Return the gas estimate and error if any
}
