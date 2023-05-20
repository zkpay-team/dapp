import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

import {
  getProver,
  Groth16,
  createRailgunWallet,
  loadWalletByID,
} from '@railgun-community/quickstart';
import { IAccount } from '../../../types';
import { initializeRailgun, loadProviders } from '../utils/setup';
import { LoadRailgunWalletResponse } from '@railgun-community/shared-models';
import { entropyToMnemonic, randomBytes } from 'ethers/lib/utils';
import { NetworkName } from '@railgun-community/shared-models';
import { useGasEstimateMultiTransfer } from '../hooks/useGasEstimateMultiTransfer';

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

const RailgunContext = createContext<{
  isProviderLoaded: boolean;
  account?: IAccount;
  createWallet?: () => void;
  wallet?: LoadRailgunWalletResponse;
}>({
  isProviderLoaded: false,
});

const RailgunProvider = ({ children }: { children: ReactNode }) => {
  const account = useAccount();
  const [isProviderLoaded, setProviderLoaded] = useState<boolean>(false);
  const [wallet, setWallet] = useState<LoadRailgunWalletResponse>();

  useEffect(() => {
    console.log('wallet?.railgunWalletInfo?.id ', wallet?.railgunWalletInfo?.id);
  }, [wallet?.railgunWalletInfo?.id, wallet, wallet?.railgunWalletInfo]);

  console.log('RailgunProvider', { isProviderLoaded });

  const { gasEstimate, error } = useGasEstimateMultiTransfer({
    railgunAddress:
      '0zk1qys0zt254k74g7mqes8r7jvef70f0tmd0fqkjewwx2r899z7tn75nrv7j6fe3z53l7t2husz9nhr80w2tvvq4kyml85j2uenvt83an8j3y0nwvc80xkh2cltfel' ||
      '',
    railgunWalletID: wallet?.railgunWalletInfo?.id || '0xnoWalletIDFound',
    selectedTokenFeeAddress: '0x00000000000000000000000',
    selectedRelayer: {
      feePerUnitGas: '0',
    },
  });

  useEffect(() => {
    console.log('logging gasEstimate returned from hook: ', { gasEstimate });
  }, [gasEstimate]);

  useEffect(() => {
    console.log('Errrrorrrrrrrrrrrrrrrrr logging error returned from hook: ', { error });
  }, [error]);

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
        if (!savedWallet.encryptionKey || savedWallet.railgunWalletInfo.id) {
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
    console.log('setting the wallet');
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

  const value = useMemo(() => {
    return {
      account: account ? account : undefined,
      isProviderLoaded: isProviderLoaded,
      createWallet: createWallet,
      wallet: wallet,
    };
  }, [account.address, isProviderLoaded, wallet]);

  return <RailgunContext.Provider value={value}>{children}</RailgunContext.Provider>;
};

export { RailgunProvider };

export default RailgunContext;
