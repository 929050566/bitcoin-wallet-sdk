import * as bip39 from 'bip39';
import bs58 from 'bs58';
import { derivePath, getPublicKey } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import * as fs from "fs"


type Account = {
  privateKey: Uint8Array,
  publicKey: Uint8Array,
  address: string
}

// function Keypair2Account(keypair: Keypair): Account {
//     return {
//         privateKey: keypair.secretKey,
//         publicKey: keypair.publicKey,
//         address: keypair.publicKey.toBase58()
//     };
// }

/**
 * 创建一个新的 Solana 地址
 * @param params - 参数对象
 * @returns 返回包含私钥、公钥和地址的账户对象
 */
export async function createAddress(params: any): Promise<Keypair> {
  const keypair = Keypair.generate();
  return keypair;
}

/**
 * 导入一个已有的 Solana 地址
 * @param params - 参数对象，包含私钥
 * @returns 返回包含私钥、公钥和地址的账户对象
 */
export async function importAddress(params: any): Promise<Keypair> {
  const { privateKey } = params;
  const keypair = Keypair.fromSecretKey(privateKey);
  return keypair;
}

/**
 * 导入一个已有的 Solana 地址
 * @param params - 参数对象，包含私钥
 * @returns 返回包含私钥、公钥和地址的账户对象
 */
export async function importAddressFromSeed(params: any): Promise<Keypair> {
    const { seed } = params;
    console.log("seedddd")
    const keypair = Keypair.fromSeed(seed);
    return keypair;
  }
  

/**
 * 使用助记词生成 Solana 地址
 * @param params - 参数对象，包含助记词和派生路径
 * @returns 返回包含私钥、公钥和地址的账户对象
 */
export async function createAddressByMnemonic(params: any): Promise<any> {
  const { mnemonic, derivationPath } = params;

  // 检查助记词是否有效
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }
  // 生成种子
  const seed = await bip39.mnemonicToSeed(mnemonic);
  // 派生路径
  const path = derivationPath || "m/44'/501'/0'/0'"; // 默认路径
  const keys = derivePath(path, seed.toString('hex'));
  // 从派生的种子生成密钥对
  const publicKey = getPublicKey(<Buffer> new Uint8Array(keys.key), false).toString('hex');
  const buffer = Buffer.from(publicKey, 'hex');
  const address = bs58.encode(buffer);
  const hdWallet = {
    privateKey: keys.key.toString('hex') + publicKey,
    publicKey,
    address
  };
  // 返回账户对象
  return hdWallet;
}

/**
 * 获取 Solana 地址的公钥、私钥和地址
 * @param keypair - Solana Keypair 对象
 * @returns 返回包含私钥、公钥和地址的对象
 */
export function getSolanaAccountInfo(keypair: Keypair): Account {
  const privateKey = keypair.secretKey;
  const publicKey = keypair.publicKey.toBytes();
  const address = keypair.publicKey.toBase58();
  return { privateKey, publicKey, address };
}


function uint8ArrayToString(fileData: Uint8Array){
    const pk = fileData.join(',');
    const privateKey = '[' + pk + ']';
    return privateKey;
  }
  
export function privateKeyToSecreKey(privateKey: string) {
    const secretKey = bs58.decode(privateKey);
    const secretStr = uint8ArrayToString(secretKey);
    return secretStr
}