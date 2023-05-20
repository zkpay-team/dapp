import {
  startRailgunEngine,
  ArtifactStore,
  loadProvider,
  setLoggers,
} from '@railgun-community/quickstart';
import { StartRailgunEngineResponse, NetworkName } from '@railgun-community/shared-models';
import localforage from 'localforage';
import LevelDB from 'level-js';
import { ETH_PROVIDERS_JSON } from './networks';

type Optional<T> = T | undefined;

const DB_PATH = './myDatabaseName';

export const loadProviders = async () => {
  const shouldDebug = true;

  return await loadProvider(ETH_PROVIDERS_JSON, NetworkName.EthereumGoerli, shouldDebug);
};

const artifactStore = new ArtifactStore(
  async (path: string) => {
    return localforage.getItem(path);
  },
  async (dir: string, path: string, item: string | Buffer) => {
    await localforage.setItem(path, item);
  },
  async (path: string) => (await localforage.getItem(path)) != null,
);

const initialize = (): StartRailgunEngineResponse => {
  // Name for your wallet implementation.
  // Encrypted and viewable in private transaction history.
  // Maximum of 16 characters, lowercase.
  const walletSource = 'quickstart demo';

  // LevelDOWN compatible database for storing encrypted wallets.
  const db = LevelDB(DB_PATH);
  // Whether to forward Engine debug logs to Logger.
  const shouldDebug = true;

  // Whether to download native C++ or web-assembly artifacts.
  // True for mobile. False for nodejs and browser.
  const useNativeArtifacts = false;

  // Whether to skip merkletree scans and private balance scans.
  // Only set to TRUE in shield-only applications that don't
  //  load private wallets or balances.
  const skipMerkletreeScans = false;

  const logMessage: Optional<(msg: any) => void> = console.log;
  const logError: Optional<(err: any) => void> = console.error;

  setLoggers(logMessage, logError);

  return startRailgunEngine(
    walletSource,
    db,
    shouldDebug,
    artifactStore,
    useNativeArtifacts,
    skipMerkletreeScans,
  );
};

export const initializeRailgun = initialize;
