import { formatUnits } from 'ethers/lib/utils.js';
import { Balances } from '../context/railgun';

interface Token {
  id: number;
  name: string;
  code: string;
  logo: string;
  decimals: number;
  address: string;
}

export const tokens: Token[] = [
  {
    id: 1,
    name: 'Dai',
    code: 'DAI',
    logo: 'https://app.railway.xyz/static/media/DAI.c5fb9e18b42bfe440070.png',
    decimals: 6,
    address: '0xdc31ee1784292379fbb2964b3b9c4124d8f89c60',
  },
  {
    id: 2,
    name: 'USD Coin',
    code: 'USDC',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=025',
    decimals: 6,
    address: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
  },
  {
    id: 3,
    name: 'Wrapped Ether',
    code: 'WETH',
    logo: 'https://app.railway.xyz/static/media/WETH.eb87cb2ae5074812267d.png',
    decimals: 12,
    address: '0x07861c6e87b9f70255377e024ace6630c1eaa37f',
  },
  // Add more token objects as needed
];

function TokenList({ balances }: { balances: Balances }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {tokens.map(token => (
        <div
          key={token.id}
          className='border border-gray-200 shadow rounded p-4 flex items-center bg-endnight'>
          <img src={token.logo} alt={token.address} className='w-8 h-8 rounded-full mr-4' />
          <div>
            <p className='font-bold'>{token.name}</p>
            <p>
              {balances[token.address]
                ? formatUnits(balances[token.address] as string, token.decimals)
                : '0'}{' '}
              {token.code}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TokenList;
