/**
 * Contract addresses and constants for Mavrk protocol on Ink L2
 */

export const INK_CHAIN_ID = 57073;

export const CONTRACT_ADDRESSES = {
  TOKEN_FACTORY: '0xD827F74E292060D4B495b7b82d6f2470C59ce89d',
  TOKEN_LOCKER: '0xd2C5947A6777500D9b7ad55a4D48AeF855AE6aBA',
  LINEAR_VESTING: '0x9496Ff7A7BE0A91F582Baa96ac12a0A36300750c',
  MAVRK_LENS: '0x89C17fEBb23d78802c85B541275a5689aec5852D',
  SWAP_ROUTER: '0x255a501d300647134b8569Ff2772Fbdf5564a32b',
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

export const SUPABASE_CONFIG = {
  URL: 'https://esjrycmiokijtxnbfyox.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzanJ5Y21pb2tpanR4bmJmeW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NDc3OTIsImV4cCI6MjA3MDIyMzc5Mn0.mBXxIiC0cWzPufhvS6TyvZTC9H4AcxN0ljRYD-caEVk',
} as const;

export const RELAY_API_URL = 'https://api.relay.link';

