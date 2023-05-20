import { useState, useCallback } from 'react';
import { populateProvedTransfer } from '@railgun-community/quickstart';

import {
  NetworkName,
  TransactionGasDetailsSerialized,
  RailgunERC20AmountRecipient,
  EVMGasType,
} from '@railgun-community/shared-models';
import { useSigner } from 'wagmi';
import { BigNumber, ethers } from 'ethers';
import { erc20AmountRecipients } from '../context/railgun';

type Optional<T> = T | undefined;

type UsePopulateProvedTransferParams = {
  railgunWalletID: string;
  tokenAmountRecipients: RailgunERC20AmountRecipient[];
  sendWithPublicWallet: boolean;
  overallBatchMinGasPrice: Optional<string>;
};

export function usePopulateProvedTransfer({
  railgunWalletID,
  tokenAmountRecipients,
  sendWithPublicWallet,
  overallBatchMinGasPrice,
}: UsePopulateProvedTransferParams) {
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [serializedTransaction, setSerializedTransaction] = useState<string | undefined>(undefined);

  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const createPopulateProvedTransfer = useCallback(
    async (gasEstimate: BigNumber | null) => {
      if (!gasEstimate) {
        console.error('Missing gasEstimate.');
        return;
      }

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
      // const erc20AmountRecipients = tokenAmountRecipients;
      const showSenderAddressToRecipient = true;
      console.log('erc20AmountRecipients showing before populating', erc20AmountRecipients);
      const { serializedTransaction: serializedTx, error } = await populateProvedTransfer(
        NetworkName.EthereumGoerli,
        railgunWalletID,
        showSenderAddressToRecipient,
        memoText,
        erc20AmountRecipients,
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
        setTransactionError(error);
      } else if (serializedTx) {
        console.log('There is no error creating the populate Proof transaction');
        console.log('serializedTransaction', serializedTx);
        setSerializedTransaction(serializedTx);
      }
    },
    [railgunWalletID, tokenAmountRecipients, sendWithPublicWallet, overallBatchMinGasPrice],
  );

  return { createPopulateProvedTransfer, transactionError, serializedTransaction };
}
