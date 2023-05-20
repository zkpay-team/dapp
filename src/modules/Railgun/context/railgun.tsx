import { createContext, ReactNode, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';

import { getProver, Groth16 } from '@railgun-community/quickstart';
import { IAccount } from '../../../types';
import { initializeRailgun } from '../services/setupRailgunEngine';

declare global {
  interface Window {
    snarkjs: { groth16: Groth16 };
  }
}

const RailgunContext = createContext<{
  account?: IAccount;
}>({
  account: undefined,
});

const RailgunProvider = ({ children }: { children: ReactNode }) => {
  const account = useAccount();

  const value = useMemo(() => {
    return {
      account: account ? account : undefined,
    };
  }, [account.address]);

  useEffect(() => {
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
  }, []);

  return <RailgunContext.Provider value={value}>{children}</RailgunContext.Provider>;
};

export { RailgunProvider };

export default RailgunContext;
