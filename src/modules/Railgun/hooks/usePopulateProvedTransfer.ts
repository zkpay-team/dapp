import { useState, useCallback, useEffect } from 'react';
import { populateProvedTransfer } from '@railgun-community/quickstart';

import {
  NetworkName,
  TransactionGasDetailsSerialized,
  RailgunERC20AmountRecipient,
  EVMGasType,
} from '@railgun-community/shared-models';

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

  const createPopulateProvedTransfer = useCallback(async () => {
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

    const gasDetailsSerialized: TransactionGasDetailsSerialized = {
      evmGasType: EVMGasType.Type1, // Depends on the chain (BNB uses type 0) Goerli is type 1.
      gasEstimateString: '0x0100', // Output from gasEstimateForDeposit
      gasPriceString: '0x0100000000', // Current gas price   (This one is needed for type 1 tx)
      // maxFeePerGasString: '0x100000', // Current gas Max Fee    (This one is needed for type 2 tx)
      // maxPriorityFeePerGasString: '0x010000', // Current gas Max Priority Fee (This one is needed for type 2 tx)
    };
    const erc20AmountRecipients = tokenAmountRecipients;
    const showSenderAddressToRecipient = true;
    console.log(
      '++++++++++++++++++++++++++++ preparing the populateProvedTransfer function ++++++++++++++++++++++++++++',
    );
    // log all paramameters for the populateProvedTransfer function
    console.log('NetworkName.EthereumGoerli', NetworkName.EthereumGoerli);
    console.log('railgunWalletID', railgunWalletID);
    console.log('showSenderAddressToRecipient', showSenderAddressToRecipient);
    console.log('memoText', memoText);
    console.log('erc20AmountRecipients', erc20AmountRecipients);
    console.log('sendWithPublicWallet', sendWithPublicWallet);
    console.log('overallBatchMinGasPrice', overallBatchMinGasPrice);
    console.log('gasDetailsSerialized', gasDetailsSerialized);
    console.log(
      '++++++++++++++++++++++++++++ calling the populateProvedTransfer function ++++++++++++++++++++++++++++',
    );
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

    console.log(
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!finished the populateProvedTransfer function!!!!!!!§!!!!!!!!!!!!!!!!!!!!',
    );

    if (error) {
      console.log('There is ano error creating the populate Proof transaction');
      console.error(error);
      setTransactionError(error);
    } else if (serializedTx) {
      console.log('There is no error creating the populate Proof transaction');
      console.log('serializedTransaction', serializedTx);
      setSerializedTransaction(serializedTx);
    }
  }, [railgunWalletID, tokenAmountRecipients, sendWithPublicWallet, overallBatchMinGasPrice]);

  return { createPopulateProvedTransfer, transactionError, serializedTransaction };
}
