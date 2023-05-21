import react, { useEffect } from 'react';
import { Chain, useAccount } from 'wagmi';

import {
  getProver,
  Groth16,
  createRailgunWallet,
  loadWalletByID,
  setOnBalanceUpdateCallback,
  BalancesUpdatedCallback,
} from '@railgun-community/quickstart';
import { IAccount } from '../../../types';
import { initializeRailgun, loadProviders } from '../utils/setup';
import { LoadRailgunWalletResponse } from '@railgun-community/shared-models';
import { entropyToMnemonic, randomBytes } from 'ethers/lib/utils';
import { NetworkName, RailgunERC20AmountRecipient } from '@railgun-community/shared-models';
import { useGasEstimateMultiTransfer } from '../hooks/useGasEstimateMultiTransfer';
import { useGenerateTransferProof } from '../hooks/useGenerateTransferProof';
import { usePopulateProvedTransfer } from '../hooks/usePopulateProvedTransfer';
import { BigNumber } from 'ethers';
import { useExecuteTransaction } from '../hooks/useExecuteTransaction';
import { toast } from 'react-toastify';

const tokenAddress = '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60'.toLowerCase();

export const erc20AmountRecipients: RailgunERC20AmountRecipient[] = [
  {
    tokenAddress, // GOERLI DAI
    amountString: '100', // hexadecimal amount decimal meaning 16
    // recipientAddress: railgunAddresses[0],
    recipientAddress:
      '0zk1qys0zt254k74g7mqes8r7jvef70f0tmd0fqkjewwx2r899z7tn75nrv7j6fe3z53l7t2husz9nhr80w2tvvq4kyml85j2uenvt83an8j3y0nwvc80xkh2cltfel',
  },
  {
    tokenAddress, // GOERLI DAI
    amountString: '100', // hexadecimal amount decimal meaning 16
    // recipientAddress: railgunAddresses[1],
    recipientAddress:
      '0zk1qyvlgs4m2q8dnahhzrryjtrku0rev59gvkfa8uf8a2w7am56u3u4nrv7j6fe3z53l7y8lxedn5j7ttxvk2kqcu604kl4h33mfs3xgkagac9evc0kmy9r2fn82n8',
  },
];

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
  const [wallet, setWallet] = react.useState<LoadRailgunWalletResponse>();
  const [balances, setBalances] = react.useState<Balances>({});

  react.useEffect(() => {
    console.log('wallet?.railgunWalletInfo?.id ', wallet?.railgunWalletInfo?.id);
  }, [wallet?.railgunWalletInfo?.id, wallet, wallet?.railgunWalletInfo]);

  console.log('RailgunProvider', { isProviderLoaded });

  const { gasEstimate, estimateError, fetchGasEstimate } = useGasEstimateMultiTransfer({
    railgunAddresses: [
      '0zk1qys0zt254k74g7mqes8r7jvef70f0tmd0fqkjewwx2r899z7tn75nrv7j6fe3z53l7t2husz9nhr80w2tvvq4kyml85j2uenvt83an8j3y0nwvc80xkh2cltfel',
      '0zk1qyvlgs4m2q8dnahhzrryjtrku0rev59gvkfa8uf8a2w7am56u3u4nrv7j6fe3z53l7y8lxedn5j7ttxvk2kqcu604kl4h33mfs3xgkagac9evc0kmy9r2fn82n8',
    ],
    railgunWalletID: wallet?.railgunWalletInfo?.id || '0xnoWalletIDFound',
    selectedTokenFeeAddress: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60', //goerli dai
    selectedRelayer: {
      feePerUnitGas: '0',
    },
  });

  react.useEffect(() => {
    console.log('Errrrorrrrrrrrrrrrrrrrr logging error returned from hook: ', { estimateError });
  }, [estimateError]);

  // const tokenAmountRecipients: RailgunERC20AmountRecipient[] = [
  //   {
  //     tokenAddress: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60', // GOERLI DAI
  //     amountString: '0x10', // hexadecimal amount decimal meaning 16
  //     recipientAddress:
  //       '0zk1qys0zt254k74g7mqes8r7jvef70f0tmd0fqkjewwx2r899z7tn75nrv7j6fe3z53l7t2husz9nhr80w2tvvq4kyml85j2uenvt83an8j3y0nwvc80xkh2cltfel',
  //   },
  //   {
  //     tokenAddress: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60', // GOERLI DAI
  //     amountString: '0x10', // hexadecimal amount decimal meaning 16
  //     recipientAddress:
  //       '0zk1qyvlgs4m2q8dnahhzrryjtrku0rev59gvkfa8uf8a2w7am56u3u4nrv7j6fe3z53l7y8lxedn5j7ttxvk2kqcu604kl4h33mfs3xgkagac9evc0kmy9r2fn82n8',
  //   },
  // ];

  const { proofError, executeGenerateTransferProof } = useGenerateTransferProof({
    railgunWalletID: wallet?.railgunWalletInfo?.id || '0xnoWalletIDFound',
    tokenAmountRecipients: erc20AmountRecipients,
    sendWithPublicWallet: true,
    overallBatchMinGasPrice: '0',
  });

  useEffect(() => {
    console.log('checking executeGenerateTransferProof: ', executeGenerateTransferProof);
  }, [executeGenerateTransferProof]);

  react.useEffect(() => {
    console.log('proofError: ', proofError);
  }, [proofError]);

  // console.log('erc20AmountRecipients: when calling hook', erc20AmountRecipients);
  const { createPopulateProvedTransfer, transactionError, serializedTransaction } =
    usePopulateProvedTransfer({
      railgunWalletID: wallet?.railgunWalletInfo?.id || '0xnoWalletIDFound',
      tokenAmountRecipients: erc20AmountRecipients,
      sendWithPublicWallet: true,
      overallBatchMinGasPrice: '0',
    });

  react.useEffect(() => {
    console.log('transactionError: ', transactionError);
  }, [transactionError]);

  const executeSendTransaction = useExecuteTransaction();

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
        setWallet(railgunWallet);
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
    setWallet(railgunWallet);
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
    if (!wallet) {
      return;
    }

    console.log('GET BALANCES', wallet);

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
      const balances: Balances = {};
      erc20Amounts.map(erc20Amount => {
        balances[erc20Amount.tokenAddress] = BigNumber.from(erc20Amount.amountString).toString();
      });
      setBalances(balances);
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setOnBalanceUpdateCallback(onBalanceUpdateCallback as BalancesUpdatedCallback);
  }, [wallet]);

  const value = react.useMemo(() => {
    return {
      account: account ? account : undefined,
      isProviderLoaded: isProviderLoaded,
      createWallet: createWallet,
      wallet: wallet,
      fetchGasEstimate: fetchGasEstimate,
      gasEstimate: gasEstimate,
      executeGenerateTransferProof: executeGenerateTransferProof,
      createPopulateProvedTransfer: createPopulateProvedTransfer,
      balances: balances,
      executeSendTransaction,
      serializedTransaction,
    };
  }, [
    account.address,
    isProviderLoaded,
    wallet,
    fetchGasEstimate,
    gasEstimate,
    executeGenerateTransferProof,
    createPopulateProvedTransfer,
    serializedTransaction,
    executeSendTransaction,
    balances,
  ]);

  return <RailgunContext.Provider value={value}>{children}</RailgunContext.Provider>;
};

export { RailgunProvider };

export default RailgunContext;
