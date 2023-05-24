import react, { useCallback, useEffect, useState } from 'react';
import { Chain, useAccount, useProvider, useSigner } from 'wagmi';

import {
  getProver,
  Groth16,
  createRailgunWallet,
  loadWalletByID,
  setOnBalanceUpdateCallback,
  BalancesUpdatedCallback,
  gasEstimateForUnprovenTransfer,
  generateTransferProof,
  populateProvedTransfer,
} from '@railgun-community/quickstart';
import { IAccount } from '../../../types';
import { initializeRailgun, loadProviders } from '../utils/setup';

import {
  NetworkName,
  FeeTokenDetails,
  RailgunERC20AmountRecipient,
  TransactionGasDetailsSerialized,
  EVMGasType,
  LoadRailgunWalletResponse,
  deserializeTransaction,
} from '@railgun-community/shared-models';
import { entropyToMnemonic, randomBytes } from 'ethers/lib/utils';
import { BigNumber, ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useExecuteTransaction } from '../hooks/useExecuteTransaction';

const tokenAddress = '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60'.toLowerCase();

// export const erc20AmountRecipients: RailgunERC20AmountRecipient[] = ;

declare global {
  interface Window {
    snarkjs: { groth16: Groth16 };
  }
}

interface localStoreWallet {
  encryptionKey: string;
  railgunWalletInfo: {
    id: string;
    railgunAddress: string;
  };
  fetchGasEstimate: () => Promise<void>;
  gasEstimate: BigNumber | null;
  executeGenerateTransferProof: () => Promise<void>;
  createPopulateProvedTransfer: (gasEstimate: BigNumber | null) => Promise<void>;
  serializedTransaction: string | undefined;
  executeSendTransaction: (serializedTransaction: string | undefined) => Promise<void>;
  executeChainOfFunctions: () => Promise<void>;
}

export interface Balances {
  [key: string]: string;
}

const RailgunContext = react.createContext<{
  isProviderLoaded: boolean;
  account?: IAccount;
  createWallet?: () => void;
  wallet?: LoadRailgunWalletResponse;
  fetchGasEstimate?: () => Promise<void>;
  gasEstimate?: BigNumber | null;
  executeGenerateTransferProof?: () => Promise<void>;
  createPopulateProvedTransfer?: (gasEstimate: BigNumber | null) => Promise<void>;
  serializedTransaction?: string;
  executeSendTransaction: (serializedTransaction: string | undefined) => Promise<void>;
  balances: Balances;
  erc20AmountRecipients?: RailgunERC20AmountRecipient[];
  setErc20AmountRecipients?: (erc20AmountRecipients: RailgunERC20AmountRecipient[]) => void;
  executeChainOfFunctions?: () => Promise<void>;
  isPaid?: boolean;
}>({
  isProviderLoaded: false,
  balances: {},
  executeSendTransaction: function (serializedTransaction: string | undefined): Promise<void> {
    throw new Error('Function not implemented.');
  },
});

const RailgunProvider = ({ children }: { children: react.ReactNode }) => {
  const account = useAccount();
  const [isProviderLoaded, setProviderLoaded] = react.useState<boolean>(false);
  const [railgunWallet, setRailgunWallet] = react.useState<LoadRailgunWalletResponse>();
  const [balances, setBalances] = react.useState<Balances>({});

  const [erc20AmountRecipients, setErc20AmountRecipients] = react.useState<
    RailgunERC20AmountRecipient[]
  >([
    {
      tokenAddress, // GOERLI DAI
      amountString: '100', // hexadecimal amount decimal meaning 16
      recipientAddress:
        '0zk1qys0zt254k74g7mqes8r7jvef70f0tmd0fqkjewwx2r899z7tn75nrv7j6fe3z53l7t2husz9nhr80w2tvvq4kyml85j2uenvt83an8j3y0nwvc80xkh2cltfel',
    },
    {
      tokenAddress, // GOERLI DAI
      amountString: '100', // hexadecimal amount decimal meaning 16
      recipientAddress:
        '0zk1qyvlgs4m2q8dnahhzrryjtrku0rev59gvkfa8uf8a2w7am56u3u4nrv7j6fe3z53l7y8lxedn5j7ttxvk2kqcu604kl4h33mfs3xgkagac9evc0kmy9r2fn82n8',
    },
  ]);

  react.useEffect(() => {
    console.log('wallet?.railgunWalletInfo?.id ', railgunWallet?.railgunWalletInfo?.id);
  }, [railgunWallet?.railgunWalletInfo?.id, railgunWallet, railgunWallet?.railgunWalletInfo]);

  console.log('RailgunProvider', { isProviderLoaded });

  // =================== START GAS ESTIMATE ===================

  const [gasEstimate, setGasEstimate] = useState<BigNumber | null>(null);
  const [estimateError, setEstimateError] = useState<string | null>(null);

  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const provider = useProvider({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const fetchGasEstimate = useCallback(async () => {
    const wallet: string | null = localStorage.getItem('wallet');

    if (wallet === null) {
      console.error("No 'wallet' object in local storage.");
      return;
    }

    const walletObject: { encryptionKey?: string } = JSON.parse(wallet);

    if (!('encryptionKey' in walletObject)) {
      console.error('encryptionKey does not exist in the wallet object.');
      return;
    }

    const encryptionKey: string = walletObject?.encryptionKey ?? 'no-ecryption-key-present';

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

    const railgunWalletID = railgunWallet?.railgunWalletInfo?.id || '0xnoWalletIDFound';

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
  }, [railgunWallet, signer]);

  // const { gasEstimate, estimateError, fetchGasEstimate } = useGasEstimateMultiTransfer({
  //   railgunAddresses: [
  //     '0zk1qys0zt254k74g7mqes8r7jvef70f0tmd0fqkjewwx2r899z7tn75nrv7j6fe3z53l7t2husz9nhr80w2tvvq4kyml85j2uenvt83an8j3y0nwvc80xkh2cltfel',
  //     '0zk1qyvlgs4m2q8dnahhzrryjtrku0rev59gvkfa8uf8a2w7am56u3u4nrv7j6fe3z53l7y8lxedn5j7ttxvk2kqcu604kl4h33mfs3xgkagac9evc0kmy9r2fn82n8',
  //   ],
  //   railgunWalletID: wallet?.railgunWalletInfo?.id || '0xnoWalletIDFound',
  //   selectedTokenFeeAddress: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60', //goerli dai
  //   selectedRelayer: {
  //     feePerUnitGas: '0',
  //   },
  // });

  react.useEffect(() => {
    console.log('Errrrorrrrrrrrrrrrrrrrr logging error returned from hook: ', { estimateError });
  }, [estimateError]);

  // =================== END GAS ESTIMATE ===================

  const [proofError, setProofError] = useState<string | null>(null);

  const executeGenerateTransferProof = useCallback(async () => {
    const wallet: string | null = localStorage.getItem('wallet');
    if (wallet === null) {
      console.error("No 'wallet' object in local storage.");
      return;
    }

    const walletObject: { encryptionKey?: string } = JSON.parse(wallet);

    if (!('encryptionKey' in walletObject)) {
      console.error('encryptionKey does not exist in the wallet object.');
      return;
    }

    const encryptionKey: string = walletObject?.encryptionKey ?? 'no-ecryption-key-present';

    const memoText = 'Getting the salariess! 🍝😋';

    const progressCallback = (progress: number) => {
      // Handle proof progress (show in UI).
      // Proofs can take 20-30 seconds on slower devices.
      console.log(`Proof generation progress: ${progress}%`);
    };

    const showSenderAddressToRecipient = true;
    const sendWithPublicWallet = true;
    const railgunWalletID = railgunWallet?.railgunWalletInfo?.id || '0xnoWalletIDFound';
    const overallBatchMinGasPrice = '0';
    const tokenAmountRecipients = erc20AmountRecipients;
    console.log('tokenAmountRecipients showing before generating', tokenAmountRecipients);
    const { error } = await generateTransferProof(
      NetworkName.EthereumGoerli,
      railgunWalletID,
      encryptionKey,
      showSenderAddressToRecipient,
      memoText,
      tokenAmountRecipients,
      [], // nftAmountRecipients
      undefined,
      sendWithPublicWallet,
      overallBatchMinGasPrice,
      progressCallback,
    );

    if (error) {
      console.log('the error comes from generateTransferProof');
      console.log('railgunWalletID', railgunWalletID);
      console.log('encryptionKey', encryptionKey);
      console.log('tokenAmountRecipients', tokenAmountRecipients);

      console.error(error);
      setProofError(error);
    }
  }, [railgunWallet, erc20AmountRecipients]);

  // const { proofError, executeGenerateTransferProof } = useGenerateTransferProof({
  //   railgunWalletID: railgunWallet?.railgunWalletInfo?.id || '0xnoWalletIDFound',
  //   tokenAmountRecipients: erc20AmountRecipients,
  //   sendWithPublicWallet: true,
  //   overallBatchMinGasPrice: '0',
  // });

  useEffect(() => {
    console.log('checking executeGenerateTransferProof: ', executeGenerateTransferProof);
  }, [executeGenerateTransferProof]);

  react.useEffect(() => {
    console.log('proofError: ', proofError);
  }, [proofError]);

  // =================== END GENERATE PROOF ===================

  // =================== START POPULATE PROOF ===================

  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [serializedTransaction, setSerializedTransaction] = useState<string | undefined>(undefined);

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
      const railgunWalletID = railgunWallet?.railgunWalletInfo?.id || '0xnoWalletIDFound';
      const sendWithPublicWallet = true;
      const overallBatchMinGasPrice = '0';

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
    [railgunWallet, erc20AmountRecipients],
  );

  // // console.log('erc20AmountRecipients: when calling hook', erc20AmountRecipients);
  // const { createPopulateProvedTransfer, transactionError, serializedTransaction } =
  //   usePopulateProvedTransfer({
  //     railgunWalletID: railgunWallet?.railgunWalletInfo?.id || '0xnoWalletIDFound',
  //     tokenAmountRecipients: erc20AmountRecipients,
  //     sendWithPublicWallet: true,
  //     overallBatchMinGasPrice: '0',
  //   });

  react.useEffect(() => {
    console.log('transactionError: ', transactionError);
  }, [transactionError]);

  // =================== END POPULATE PROOF ===================

  // =================== START EXECUTE TRANSACTION ===================
  const executeSendTransaction = useCallback(
    async (serializedTransaction: string | undefined) => {
      console.log('entered executeSendTransaction');
      try {
        if (!serializedTransaction) {
          console.error('Missing serializedTransaction.');
          return;
        }
        if (!provider) {
          console.error('Missing provider.');
          return;
        }
        if (!signer) {
          console.error('Missing signer.');
          return;
        }

        const address = await signer.getAddress();
        const nonce = await provider.getTransactionCount(address, 'pending');

        // Deserialize the transaction
        const transactionReq = deserializeTransaction(serializedTransaction, nonce, 5);
        console.log('🚀 ~ file: useExecuteTransaction.ts:36 ~ transactionReq:', transactionReq);

        transactionReq.from = await signer.getAddress();

        console.log('await signer.getAddress()', await signer.getAddress());

        // Send the transaction
        let txResponse;
        try {
          txResponse = await signer.sendTransaction(transactionReq);
        } catch (error) {
          console.log('Error sending transaction:', error);
        }

        // Wait for the transaction to be mined
        if (!txResponse) {
          console.error('Missing txResponse.');
          return;
        }

        console.log('waiting...');
        const receipt = await txResponse.wait();

        console.log('Transaction successfully mined:', receipt);
      } catch (err) {
        console.error('Error sending transaction:', err);
      }
    },
    [signer, provider],
  );

  // const executeSendTransaction = useExecuteTransaction();

  // =================== END EXECUTE TRANSACTION ===================

  // =================== START CHAIN OF FUNCTIONS ===================

  const [proofCreated, setProofCreated] = useState<boolean>(false);
  const executeChainOfFunctions = useCallback(async () => {
    try {
      console.log('Get the gas estimate!');
      console.log('should call function exposed from context.');
      console.log('this: ', { fetchGasEstimate });
      if (fetchGasEstimate) {
        console.log("it exists, let's call it.");
        await fetchGasEstimate();
      }

      console.log('create the Proof');
      console.log('should call function exposed from context.');
      console.log('this: ', { executeGenerateTransferProof });
      if (executeGenerateTransferProof) {
        console.log("it exists, let's call it.");
        await executeGenerateTransferProof();
      }

      // Wait for the executeTransferProof extra
      // await new Promise(resolve => setTimeout(resolve, 4000));

      console.log('proof created');
      setProofCreated(true);

      // console.log('create the Populated Transaction');
      // console.log('should call function exposed from context.');
      // console.log('this: ', { executeGenerateTransferProof });
      // if (!gasEstimate) {
      //   console.log('no gas estimate, so we cannot create the populated transaction.');
      //   return;
      // }
      // if (createPopulateProvedTransfer) {
      //   console.log("it exists, let's call it.");
      //   await createPopulateProvedTransfer(gasEstimate);
      // } else {
      //   console.log("createPopulateProvedTransfer doesn't exist, so we can't call it.");
      // }

      // // Wait for the createPopulateProvedTransfer extra
      // await new Promise(resolve => setTimeout(resolve, 10000));

      // console.log('run the executeSendTransaction');
      // console.log('should call function exposed from context.');
      // console.log('this: ', { executeSendTransaction });

      // console.log('serializedTransaction: ', serializedTransaction);

      // if (executeSendTransaction && serializedTransaction) {
      //   console.log("it exists, let's call it.");
      //   await executeSendTransaction(serializedTransaction);
      // } else {
      //   console.log("executeSendTransaction doesn't exist, so we can't call it.");
      // }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [
    fetchGasEstimate,
    executeGenerateTransferProof,
    gasEstimate,
    createPopulateProvedTransfer,
    serializedTransaction,
    executeSendTransaction,
  ]);

  const [isPaid, setIsPaid] = useState<boolean>(false);
  useEffect(() => {
    const asyncCallSendAfterProving = async () => {
      if (!proofCreated) {
        console.log('proof not created yet');
        return;
      }

      try {
        console.log('create the Populated Transaction');
        console.log('should call function exposed from context.');
        console.log('this: ', { executeGenerateTransferProof });
        if (!gasEstimate) {
          console.log('no gas estimate, so we cannot create the populated transaction.');
          return;
        }
        if (createPopulateProvedTransfer) {
          console.log("it exists, let's call it.");
          await createPopulateProvedTransfer(gasEstimate);
        } else {
          console.log("createPopulateProvedTransfer doesn't exist, so we can't call it.");
        }

        // Wait for the createPopulateProvedTransfer extra
        // await new Promise(resolve => setTimeout(resolve, 10000));

        console.log('run the executeSendTransaction');
        console.log('should call function exposed from context.');
        console.log('this: ', { executeSendTransaction });

        console.log('serializedTransaction: ', serializedTransaction);

        if (executeSendTransaction && serializedTransaction) {
          console.log("it exists, let's call it.");
          await executeSendTransaction(serializedTransaction);
          setIsPaid(true);
          setProofCreated(false);
        } else {
          console.log("executeSendTransaction doesn't exist, so we can't call it.");
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    asyncCallSendAfterProving();
  }, [
    fetchGasEstimate,
    executeGenerateTransferProof,
    gasEstimate,
    createPopulateProvedTransfer,
    proofCreated,
    serializedTransaction,
  ]);

  // =================== END CHAIN OF FUNCTIONS ===================

  react.useEffect(() => {
    const fn = async () => {
      console.log('initializeRailgun');
      const response = initializeRailgun();

      // Note: SnarkJS library is not properly typed.
      try {
        const groth16 = window.snarkjs.groth16;
        getProver().setSnarkJSGroth16(groth16);
      } catch (e) {
        console.log('error while getting the prover');
        console.log(e);
      }

      if (response.error) {
        console.error(`Failed to start the Railgun Engine: ${response.error}`);
      } else {
        console.log('Successfully started the Railgun Engine!');
      }

      // LOAD Provider
      const res = await loadProviders();
      console.log({ res });

      // Provider is done loading.
      setProviderLoaded(true);

      // LOAD Wallet if there is one
      const savedWalletString = localStorage.getItem('wallet');
      if (savedWalletString) {
        const savedWallet = JSON.parse(savedWalletString) as localStoreWallet;
        console.log('savedWallet', savedWallet);
        if (!savedWallet.encryptionKey || !savedWallet.railgunWalletInfo.id) {
          return;
        }
        const railgunWallet = await loadWalletByID(
          savedWallet.encryptionKey,
          savedWallet.railgunWalletInfo.id,
          false,
        );
        console.log('loadWalletByID');
        console.log({ railgunWallet });
        setRailgunWallet(railgunWallet);
      }
    };
    fn();
  }, []);

  const createWallet = react.useCallback(async () => {
    const mnemonic = entropyToMnemonic(randomBytes(16));

    // Current block numbers for each chain when wallet was first created.
    // If unknown, provide undefined.
    const creationBlockNumberMap = {
      [NetworkName.EthereumGoerli]: undefined,
    };

    // let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);

    const encryptionKey = Buffer.from(randomBytes(32)).toString('hex');

    const railgunWallet = await createRailgunWallet(
      encryptionKey,
      mnemonic,
      creationBlockNumberMap,
    );
    setRailgunWallet(railgunWallet);
    localStorage.setItem(
      'wallet',
      JSON.stringify({
        encryptionKey,
        ...railgunWallet,
      }),
    );

    toast('New wallet created!', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: 'dark',
    });
  }, []);

  react.useEffect(() => {
    if (!railgunWallet) {
      return;
    }

    console.log('GET BALANCES', railgunWallet);

    const onBalanceUpdateCallback = ({
      chain,
      railgunWalletID,
      erc20Amounts,
    }: {
      chain: Chain;
      railgunWalletID: string;
      erc20Amounts: {
        tokenAddress: string;
        amountString: string;
      }[];
    }): void => {
      // Do something with the private token balances.
      console.log('onBalanceUpdateCallback', { erc20Amounts, chain, railgunWalletID });
      console.log('erc20Amounts', erc20Amounts);
      const balances: Balances = {};
      erc20Amounts.map(erc20Amount => {
        balances[erc20Amount.tokenAddress] = BigNumber.from(erc20Amount.amountString).toString();
      });
      setBalances(balances);
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setOnBalanceUpdateCallback(onBalanceUpdateCallback as BalancesUpdatedCallback);
  }, [railgunWallet]);

  const value = react.useMemo(() => {
    return {
      account: account ? account : undefined,
      isProviderLoaded: isProviderLoaded,
      createWallet: createWallet,
      wallet: railgunWallet,
      fetchGasEstimate: fetchGasEstimate,
      gasEstimate: gasEstimate,
      executeGenerateTransferProof: executeGenerateTransferProof,
      createPopulateProvedTransfer: createPopulateProvedTransfer,
      balances: balances,
      executeSendTransaction,
      serializedTransaction,
      erc20AmountRecipients,
      setErc20AmountRecipients,
      executeChainOfFunctions,
      isPaid,
    };
  }, [
    account.address,
    isProviderLoaded,
    railgunWallet,
    fetchGasEstimate,
    gasEstimate,
    executeGenerateTransferProof,
    createPopulateProvedTransfer,
    serializedTransaction,
    executeSendTransaction,
    balances,
    erc20AmountRecipients,
    setErc20AmountRecipients,
    isPaid,
  ]);

  return <RailgunContext.Provider value={value}>{children}</RailgunContext.Provider>;
};

export { RailgunProvider };

export default RailgunContext;
