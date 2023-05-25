import { localStoreWallet } from '../context/railgun';

export const getEncryptionKey = (): string | null => {
  const savedWalletString = localStorage.getItem('wallet');
  if (!savedWalletString) {
    return null;
  }
  const savedWallet = JSON.parse(savedWalletString) as localStoreWallet;
  return savedWallet.encryptionKey;
};
