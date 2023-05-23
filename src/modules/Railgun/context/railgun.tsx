import react from 'react';
import { Chain, useAccount } from 'wagmi';

import {
  BalancesUpdatedCallback,
  Groth16,
  createRailgunWallet,
  getProver,
  loadWalletByID,
  setOnBalanceUpdateCallback,
} from '@railgun-community/quickstart';
import { IAccount } from '../../../types';
import { initializeRailgun, loadProviders } from '../utils/setup';

import { LoadRailgunWalletResponse, NetworkName } from '@railgun-community/shared-models';
import { BigNumber } from 'ethers';
import { entropyToMnemonic, randomBytes } from 'ethers/lib/utils';
import { toast } from 'react-toastify';

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

const RailgunContext = react.createContext<{
  isProviderLoaded: boolean;
  account?: IAccount;
  createWallet?: () => void;
  wallet?: LoadRailgunWalletResponse;
  balances: Balances;
}>({
  isProviderLoaded: false,
  balances: {},
});

const RailgunProvider = ({ children }: { children: react.ReactNode }) => {
  const account = useAccount();
  const [isProviderLoaded, setProviderLoaded] = react.useState<boolean>(false);
  const [railgunWallet, setRailgunWallet] = react.useState<LoadRailgunWalletResponse>();
  const [balances, setBalances] = react.useState<Balances>({});

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
      balances: balances,
    };
  }, [account.address, isProviderLoaded, railgunWallet, balances]);

  return <RailgunContext.Provider value={value}>{children}</RailgunContext.Provider>;
};

export { RailgunProvider };

export default RailgunContext;
