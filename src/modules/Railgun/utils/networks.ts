import { FallbackProviderJsonConfig } from '@railgun-community/shared-models';

export const ETH_PROVIDERS_JSON_GOERLI: FallbackProviderJsonConfig = {
  chainId: 5,
  providers: [
    {
      provider: `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_GOERLI}`,
      priority: 1,
      weight: 1,
    },
  ],
};

export const ETH_PROVIDERS_JSON_POLYGON: FallbackProviderJsonConfig = {
  chainId: 5,
  providers: [
    {
      provider: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_GOERLI}`,
      priority: 1,
      weight: 1,
    },
  ],
};
