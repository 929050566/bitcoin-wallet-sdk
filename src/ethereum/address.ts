import { Interface } from '@ethersproject/abi';
const ethers = require('ethers');

// import ethers from 'ethers';

/**
 * Get address from seed
 * @param seedHex
 * @param addressIndex
 * @returns
 */
export function createEthAddress (seedHex: string, addressIndex: string) {
  const hdNode = ethers.utils.HDNode.fromSeed(Buffer.from(seedHex, 'hex'));
  const {
    privateKey,
    publicKey,
    address
  } = hdNode.derivePath("m/44'/60'/0'/0/" + addressIndex + '');
  return JSON.stringify({
    privateKey,
    publicKey,
    address
  });
}
