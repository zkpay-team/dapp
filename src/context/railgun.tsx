import { createContext, ReactNode, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { IAccount } from '../types';

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

  return <RailgunContext.Provider value={value}>{children}</RailgunContext.Provider>;
};

export { RailgunProvider };

export default RailgunContext;
