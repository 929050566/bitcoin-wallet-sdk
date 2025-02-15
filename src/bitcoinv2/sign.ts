const bitcore = require('bitcore-lib');
// @ts-ignore

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