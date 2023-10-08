import type { NetworkId } from '@/utils/types';

type NetworkComponents = {
  home: string;
};

export const componentsByNetworkId: Record<NetworkId, NetworkComponents | undefined> = {
  testnet: {
    home: 'blagabo.testnet/widget/Paralel',
  },

  mainnet: {
    home: '',
  },
};
