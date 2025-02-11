import axios from 'axios';

/**
 * Get the latest nonce for an Ethereum address using a direct RPC call
 * @param address - The Ethereum address
 * @returns The latest nonce
 */
export async function getLatestNonce(address: string): Promise<number> {
  const url = 'https://ethereum-sepolia-rpc.publicnode.com/';
  const data = {
    jsonrpc: '2.0',
    method: 'eth_getTransactionCount',
    params: [address, 'latest'],
    id: 1
  };

  const response = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.data.error) {
    throw new Error(`Error fetching nonce: ${response.data.error.message}`);
  }

  return parseInt(response.data.result, 16);
}

/**
 * Get the current gas price from the Ethereum network
 * @returns The current gas price in wei
 */
export async function getCurrentGasPrice(): Promise<string> {
  const url = 'https://ethereum-sepolia-rpc.publicnode.com/';
  const data = {
    jsonrpc: '2.0',
    method: 'eth_gasPrice',
    params: [] as any[],
    id: 73
  };

  const response = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.data.error) {
    throw new Error(`Error fetching gas price: ${response.data.error.message}`);
  }

  return response.data.result;
}

/**
 * Convert a hexadecimal string to a decimal number
 * @param hex - The hexadecimal string
 * @returns The decimal number
 */
export function hexToDecimal(hex: string): number {
  if (hex.startsWith('0x')) {
    hex = hex.slice(2);
  }
  return parseInt(hex, 16);
}
