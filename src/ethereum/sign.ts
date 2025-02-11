
import { Interface } from '@ethersproject/abi';
const ethers = require('ethers');
import Common from '@ethereumjs/common'
import {FeeMarketEIP1559Transaction, Transaction} from '@ethereumjs/tx'


const BigNumber = require('BigNumber.js');

// ETH SDK 支持的 EVM链
const SUPPORT_CHAIN_NETWORK: { [key: number]: string } = {
    1: 'Ethereum',
    324: 'ZksyncEra',
    42161: 'Arbitrum',
    42170: 'ArbitrumNova',
    5000: 'Mantle',
    56: 'BscChain',
    128: 'Heco',
    137: 'Polygon',
    10001: 'EthereumPow',
    61: 'EthereumClassic',
    8217: 'klay',
    1101: 'PolygonZk',
    66: 'OkexChain',
    9001: 'Evmos',
    10: 'Optimism',
    59144: 'Linea',
    8453: 'Base',
    11155111: 'Sepolia'
  };

  export function numberToHex(value: any) {
    const number = BigNumber(value);
    const result = number.toString(16);
    return '0x' + result;
}

  
  /**
   * sign transaction
   * @param privateKeyHex
   * @param tx
   * @returns
   */
  export async function signEthTransaction (params: any): Promise<string> {
    let { privateKey, nonce, from, to, gasPrice, gasLimit, amount, tokenAddress, decimal, maxPriorityFeePerGas, maxFeePerGas, chainId, data } = params;
    const transactionNonce = numberToHex(nonce);
    const gasLimits = numberToHex(gasLimit);
    const chainIdHex = numberToHex(chainId);
    let newAmount = BigNumber(amount).times((BigNumber(10).pow(decimal)));
    const numBalanceHex = numberToHex(newAmount);
    let txData: any = {
        nonce: transactionNonce,
        gasLimit: gasLimits,
        to,
        from,
        chainId: chainIdHex,
        value: numBalanceHex
    }
    if (maxFeePerGas && maxPriorityFeePerGas) {
        txData.maxFeePerGas = numberToHex(maxFeePerGas);
        txData.maxPriorityFeePerGas = numberToHex(maxPriorityFeePerGas);
    } else {
        txData.gasPrice = numberToHex(gasPrice);
    }
    if (tokenAddress && tokenAddress !== "0x00") {
        const ABI = [
            "function transfer(address to, uint amount)"
        ];
        const iface = new Interface(ABI);
        txData.data = iface.encodeFunctionData("transfer", [to, numBalanceHex]);
        txData.to = tokenAddress;
        txData.value = 0;
    }
    if (data) {
        txData.data = data;
    }
    let common: any, tx: any;
    if (txData.maxFeePerGas && txData.maxPriorityFeePerGas) {
        common = (Common as any).custom({
            chainId: chainId,
            defaultHardfork: "london"
        });
        tx = FeeMarketEIP1559Transaction.fromTxData(txData, {
            common
        });
    } else {
        common = (Common as any).custom({ chainId: chainId })
        tx = Transaction.fromTxData(txData, {
            common
        });
    }
    const privateKeyBuffer = Buffer.from(privateKey, "hex");
    const signedTx = tx.sign(privateKeyBuffer);
    const serializedTx = signedTx.serialize();
    if (!serializedTx) {
        throw new Error("sign is null or undefined");
    }
    return `0x${serializedTx.toString('hex')}`;
  }
  
  /**
   * address
   * network type
   * @param params
   */
  export function verifyEthAddress (params: any) {
      const { address } = params;
      return ethers.utils.isAddress(address);
    }
    
    /**
     * import address
     * private key
     * network
     * @param privateKey
     */
    export function importEthAddress (privateKey: string) {
      const wallet = new ethers.Wallet(Buffer.from(privateKey, 'hex'));
      return JSON.stringify({
        privateKey,
        address: wallet.address
      });
    }