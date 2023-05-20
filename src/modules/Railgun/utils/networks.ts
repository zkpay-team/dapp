import { FallbackProviderJsonConfig } from '@railgun-community/shared-models';

export const ETH_PROVIDERS_JSON: FallbackProviderJsonConfig = {
  chainId: 5,
  providers: [
    {
      provider: `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_URL_GOERLI}`,
      priority: 1,
      weight: 1,
    },
  ],
};
