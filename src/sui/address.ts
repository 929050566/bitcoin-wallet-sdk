import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';


export function createKeypair() {
    const keypair = new Ed25519Keypair();
    const address = keypair.toSuiAddress();
    const privateKey = keypair.getSecretKey();
    const publicKey = keypair.getPublicKey();
    return { address, privateKey, publicKey };
}

export function createKeypairFromSeed(seedHex: string) {
    const keypair = Ed25519Keypair.deriveKeypairFromSeed(seedHex)
    const address = keypair.toSuiAddress();
    const privateKey = keypair.getSecretKey();
    const publicKey = keypair.getPublicKey();
    return { address, privateKey, publicKey };
}


export function createKeypairFromSeed2(nemonic: string ,path: string) {
    const keypair = Ed25519Keypair.deriveKeypair(nemonic, null)
    const address = keypair.toSuiAddress();
    const privateKey = keypair.getSecretKey();
    const publicKey = keypair.getPublicKey();
    return { address, privateKey, publicKey };
}


export function createKeypairFromPrivateKey(privateKey: string) {
    const keypair = Ed25519Keypair.fromSecretKey(privateKey);
    const address = keypair.toSuiAddress();
    const secretKey = keypair.getSecretKey();
    const publicKey = keypair.getPublicKey();
    return { address, privateKey: secretKey, publicKey };
}