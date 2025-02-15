const bitcore = require('bitcore-lib');
// @ts-ignore
import * as bitcoin from 'bitcoinjs-lib';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';

import { toXOnly, tapTreeToList, tapTreeFromList } from "bitcoinjs-lib/src/psbt/bip371"

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

interface TransactionInput {
    address: string;
    txid: string;
    amount: number;
    vout: number;
}

interface TransactionOutput {
    address: string;
    amount: number;
}


interface SignObj {
    inputs: TransactionInput[];
    outputs: TransactionOutput[];
}


/**
 * 签名，暂不支持taproot签名
 * @returns
 * @param params
 */
export function signUtxoTransaction (params: { privateKey: string; signObj: SignObj; network: string; }): string {
    const { privateKey, signObj, network } = params;
    const net = bitcore.Networks[network];
    const inputs = signObj.inputs.map(input => {
        return {
            address: input.address,
            txId: input.txid,
            outputIndex: input.vout,
            script: new bitcore.Script.fromAddress(input.address).toHex(),
            satoshis: input.amount
        }
    });
    const outputs = signObj.outputs.map(output => {
        return {
            address: output.address,
            satoshis: output.amount
        };
    });
    const transaction = new bitcore.Transaction(net).from(inputs).to(outputs);
    transaction.version = 2;
    transaction.sign(privateKey);
    return transaction.toString();
}


export async function signBtcTaprootTransaction(params: any) {
    const { signObj, privateKey } = params
    const psbt = new bitcoin.Psbt({network: bitcoin.networks.bitcoin});

    const inputs = signObj.inputs.map((input: any) => {
        return {
            hash: input.txid,
            index: input.index,
            witnessUtxo: {value: input.amount, script: input.output!},
            tapInternalKey: toXOnly(input.publicKey),
        }
    });
    psbt.addInputs(inputs);

    const sendInternalKey = bip32.fromPrivateKey(privateKey, Buffer.from("0"));

    const output = signObj.output.map((output : any) => {
        return {
            value: output.value,
            address: output.sendAddress!,
            tapInternalKey: output.sendPubKey,
        }
    });

    psbt.addOutputs(output);

    const tweakedSigner = sendInternalKey.tweak(
        bitcoin.crypto.taggedHash('TapTweak', toXOnly(sendInternalKey.publicKey)),
    );

    await psbt.signInputAsync(0, tweakedSigner);
    psbt.finalizeAllInputs();
    const tx = psbt.extractTransaction();
    return tx.toBuffer().toString('hex');
}