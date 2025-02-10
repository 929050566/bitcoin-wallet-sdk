import { buildMultisigTx, signMultisigTx, buildAndSignTx } from '../../src/bitcoin/sign';
import * as bitcoin from 'bitcoinjs-lib';

describe('Bitcoin Transaction Tests', () => {
  describe('Multisig Transactions', () => {
    it('should create and sign a 2-of-3 multisig transaction', async () => {
      // Testnet keys
      const key1 = 'cVjz7y1Y9g5j2K9g5j2K9g5j2K9g5j2K9g5j2K9g5j2K9g5j2K9g5j2K9g5j2K';
      const key2 = 'cVjz7y1Y9g5j2K9g5j2K9g5j2K9g5j2K9g5j2K9g5j2K9g5j2K9g5j2K9g5j2L';
      const key3 = 'cVjz7y1Y9g5j2K9g5j2K9g5j2K9g5j2K9g5j2K9g5j2K9g5j2K9g5j2K9g5j2M';
      
      const pubKey1 = '02f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9';
      const pubKey2 = '03d01115d548e7561b15c38f004d734633687cf4419620095bc5b0f47070afe85a';
      const pubKey3 = '03f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8';

      const signObj = {
        inputs: [{
          txid: 'a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2',
          vout: 0,
          amount: 100000,
          address: '2N8hwP1WmJrFF5QWABn38y63uYLhnJYJYTF',
          rawTx: '8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8d8e8'
        }],
        outputs: [{
          address: '2N8hwP1WmJrFF5QWABn38y63uYLhnJYJYTF',
          amount: 99000
        }]
      };
      

      // 构建未签名的交易
      const psbt = buildMultisigTx({
        pubKeys: [pubKey1, pubKey2, pubKey3],
        signObj,
        network: 'testnet',
        requiredSignaturesNumbers: 2
      });

      // Sign with two keys
      const signedTx = signMultisigTx(psbt, [key1, key2], 'testnet');

      // Verify the signed transaction
      expect(signedTx).toBeDefined();
      expect(signedTx.length).toBeGreaterThan(0);
      expect(signedTx).toMatch(/^[0-9a-fA-F]+$/); // Should be a valid hex string
    });
  });

  describe('Single Sign Transactions', () => {
    it('should create and sign a single signature transaction', async () => {
      const data = {
        inputs: [{
          address: "1H7AcqzvVQunYftUcJMxF9KUrFayEnf83T",
          txid: "368dc2eba45bcbaf6533ccf119edf2342aeb4d503cdecfb269049c353b02c1c3",
          amount: 546,
          vout: 0
        }],
        outputs: [{
          amount: 500,
          address: "1H7AcqzvVQunYftUcJMxF9KUrFayEnf83T"
        }]
      };

      const rawHex = buildAndSignTx({
        privateKey: "60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e",
        signObj: data,
        network: "mainnet"
      });

      expect(rawHex).toBeDefined();
      expect(rawHex.length).toBeGreaterThan(0);
      expect(rawHex).toMatch(/^[0-9a-fA-F]+$/);
    });
  })
});
