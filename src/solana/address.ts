import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

type Account = {
    privateKey: string,
    publicKey: string,
    address: string
}

function Keypair2Account(keypair: Keypair): Account {
    return {
        privateKey: keypair.secretKey.toString(),
        publicKey: keypair.publicKey.toBase58(),
        address: keypair.publicKey.toBase58()
    };
}

/**
 * 创建一个新的 Solana 地址
 * @param params - 参数对象
 * @returns 返回包含私钥、公钥和地址的账户对象
 */
export async function createAddress(params: any): Promise<Account> {
    const keypair = Keypair.generate();
    const account = Keypair2Account(keypair);
    return account;
}

/**
 * 导入一个已有的 Solana 地址
 * @param params - 参数对象，包含私钥
 * @returns 返回包含私钥、公钥和地址的账户对象
 */
export async function importAddress(params: any): Promise<Account> {
    const { privateKey } = params;
    const keypair = Keypair.fromSecretKey(privateKey);
    const account = Keypair2Account(keypair);
    return account;
}

/**
 * 使用助记词生成 Solana 地址
 * @param params - 参数对象，包含助记词和派生路径
 * @returns 返回包含私钥、公钥和地址的账户对象
 */
export async function createAddressByMnemonic(params: any): Promise<Account> {
    const { mnemonic, derivationPath } = params;

    // 检查助记词是否有效
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic');
    }

    // 生成种子
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // 派生路径
    const path = derivationPath || "m/44'/501'/0'/0'"; // 默认路径
    const derivedSeed = derivePath(path, seed.toString('hex')).key;

    // 从派生的种子生成密钥对
    const keypair = Keypair.fromSeed(derivedSeed);

    // 返回账户对象
    return Keypair2Account(keypair);
}