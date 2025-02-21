import { Ed25519Keypair, } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

export function createKeypair() {
    const keypair = new Ed25519Keypair();
    keypair.signTransaction
}

export function createKeypairFromSeed(seedHex: string) {
    const tx = new Transaction();
}

