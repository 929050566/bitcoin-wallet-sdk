import { createKeypair, createKeypairFromSeed, createKeypairFromPrivateKey, createKeypairFromSeed2 } from '../../src/sui/address';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { derivePath } from 'ed25519-hd-key';

describe('Sui Address Module', () => {
  test('createKeypair should generate a valid keypair', () => {
    const kp = createKeypair();
    expect(kp.address).toBeDefined();
    expect(kp.privateKey).toBeDefined();
    expect(kp.publicKey).toBeDefined();
    expect(typeof kp.address).toBe('string');
    expect(kp.address.length).toBeGreaterThan(0);
  });

  test('createKeypairFromSeed should generate a consistent keypair from seed', () => {
    // 使用 bip39 生成助记词
    // const mnemonic = bip39.generateMnemonic();
    const mnemonic = "bus crowd gun upgrade educate barrel snap duck health bleak outer broken"
    // 使用 bip39 将助记词转换为种子
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    // 使用 bip44 派生路径 m/44'/784'/0'/0'/0' 生成 seedHex
    const path = "m/74'/784'/0'/0'/0'"; // 默认路径
    const kp0 = createKeypairFromSeed(seed.toString('hex'));
    console.log('kp0===:', kp0);
    const kp = createKeypairFromSeed2(mnemonic, path);
    console.log('kp===:', kp);
    expect(kp.address).toBeDefined();
    expect(typeof kp.address).toBe('string');
    expect(kp.address.length).toBeGreaterThan(0);
  });

  test('createKeypairFromPrivateKey should recover the keypair correctly', () => {
    const original = createKeypair();
    const recovered = createKeypairFromPrivateKey(original.privateKey);
    expect(recovered.address).toEqual(original.address);
  });
});
0xe5b22f50be1b40ca00a8a452ed9ae68c47ab80c90c70d6cd651b06f3e9eaaed6