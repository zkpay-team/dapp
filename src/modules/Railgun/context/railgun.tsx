import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

import { getProver, Groth16 } from '@railgun-community/quickstart';
import { IAccount } from '../../../types';
import { initializeRailgun, loadProviders } from '../utils/setup';

declare global {
  interface Window {
    snarkjs: { groth16: Groth16 };
  }
}

const RailgunContext = createContext<{
  isProviderLoaded: boolean;
  account?: IAccount;
}>({
  isProviderLoaded: false,
  account: undefined,
});

const RailgunProvider = ({ children }: { children: ReactNode }) => {
  const account = useAccount();
  const [isProviderLoaded, setProviderLoaded] = useState<boolean>(false);
  // const [wallet, setWallet] = useState<LoadRailgunWalletResponse>();

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
    };
    fn();
  }, []);

  const value = useMemo(() => {
    return {
      account: account ? account : undefined,
      isProviderLoaded: isProviderLoaded,
    };
  }, [account.address, isProviderLoaded]);

  return <RailgunContext.Provider value={value}>{children}</RailgunContext.Provider>;
};

export { RailgunProvider };

export default RailgunContext;
