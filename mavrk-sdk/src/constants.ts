/**
 * Contract addresses and constants for Mavrk protocol on Ink L2
 */

export const INK_CHAIN_ID = 57073;

export const CONTRACT_ADDRESSES = {
  TOKEN_FACTORY: '0xD827F74E292060D4B495b7b82d6f2470C59ce89d',
  TOKEN_LOCKER: '0xd2C5947A6777500D9b7ad55a4D48AeF855AE6aBA',
  LINEAR_VESTING: '0x9496Ff7A7BE0A91F582Baa96ac12a0A36300750c',
  WETH: '0x4200000000000000000000000000000000000006',
} as const;

export const RPC_URLS = {
  PRIMARY: 'https://rpc-gel.inkonchain.com',
  FALLBACK: [
    'https://ink.rpc.grove.city/v1/01fdb492',
    'https://ink.drpc.org',
  ],
} as const;

export const EXPLORER_URL = 'https://explorer.inkonchain.com';

