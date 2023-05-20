import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
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
import { NetworkName } from '@railgun-community/shared-models';
import { BigNumber } from 'ethers';

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
}

export interface Balances {
  [key: string]: string;
}

const RailgunContext = createContext<{
  isProviderLoaded: boolean;
  account?: IAccount;
  createWallet?: () => void;
  wallet?: LoadRailgunWalletResponse;
  balances: Balances;
}>({
  isProviderLoaded: false,
  balances: {},
});

const RailgunProvider = ({ children }: { children: ReactNode }) => {
  const account = useAccount();
  const [isProviderLoaded, setProviderLoaded] = useState<boolean>(false);
  const [wallet, setWallet] = useState<LoadRailgunWalletResponse>();
  const [balances, setBalances] = useState<Balances>({});

  console.log('RailgunProvider', { isProviderLoaded });

  useEffect(() => {
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
        setWallet(railgunWallet);
      }
    };
    fn();
  }, []);

  const createWallet = useCallback(async () => {
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
    console.log({ railgunWallet });
    setWallet(railgunWallet);
    localStorage.setItem(
      'wallet',
      JSON.stringify({
        encryptionKey,
        ...railgunWallet,
      }),
    );
  }, []);

  useEffect(() => {
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

  const value = useMemo(() => {
    return {
      account: account ? account : undefined,
      isProviderLoaded: isProviderLoaded,
      createWallet: createWallet,
      wallet: wallet,
      balances: balances,
    };
  }, [account.address, isProviderLoaded, wallet, balances]);

  return <RailgunContext.Provider value={value}>{children}</RailgunContext.Provider>;
};

export { RailgunProvider };

export default RailgunContext;
