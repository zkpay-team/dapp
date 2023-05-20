import { entropyToMnemonic, randomBytes } from 'ethers/lib/utils';
import { useCallback } from 'react';
import { NetworkName } from '@railgun-community/shared-models';
import { createRailgunWallet } from '@railgun-community/quickstart';

function Home() {
  const createWallet = useCallback(async () => {
    const mnemonic = entropyToMnemonic(randomBytes(16));

    // Current block numbers for each chain when wallet was first created.
    // If unknown, provide undefined.
    const creationBlockNumberMap = {
      [NetworkName.EthereumGoerli]: undefined,
    };

    const encryptionKey = '0101010101010101010101010101010101010101010101010101010101010101';

    const railgunWallet = await createRailgunWallet(
      encryptionKey,
      mnemonic,
      creationBlockNumberMap,
    );
    console.log({ railgunWallet });
  }, []);

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-3xl font-medium tracking-wider mb-8'>
        Your <span className='text-zinc-600'>wallet </span>
      </p>
      <button
        type='button'
        className='hover:text-green-600 hover:bg-green-50 bg-green-500 text-white px-5 py-2 rounded-lg'
        onClick={createWallet}>
        Create your Wallet
      </button>
    </div>
  );
}

export default Home;
