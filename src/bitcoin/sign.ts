const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
BIP32Factory(ecc);
const bitcoin = require('bitcoinjs-lib');
const bitcore = require('bitcore-lib');

/**
 * @returns
 * @param params
 */
export function buildAndSignTx(params: { privateKey: string; signObj: any; network: string; }): string {
  const { privateKey, signObj, network } = params;
  const net = bitcore.Networks[network];
  
  const inputs = signObj.inputs.map((input: any) => {
    return {
      address: input.address,
      txId: input.txid,
      outputIndex: input.vout,
      script: new bitcore.Script.fromAddress(input.address).toHex(),
      satoshis: input.amount
    };
  });

  const outputs = signObj.outputs.map((output: any) => {
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

export function buildUnsignTxAndSign(params: any) {
  const { privateKey1, privateKey2, signObj, network } = params;
  const bitcoinNetwork = bitcoin.networks[network as keyof typeof bitcoin.networks];
  const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });

  // 添加输入
  signObj.inputs.forEach((input: any) => {
    psbt.addInput({
      hash: input.txid,
      index: input.vout,
      nonWitnessUtxo: Buffer.from(input.rawTx, 'hex'), // 需要提供原始交易数据
      redeemScript: Buffer.from(new bitcore.Script.fromAddress(input.address).toHex(), 'hex')
    });
  });

  // 添加输出
  signObj.outputs.forEach((output: any) => {
    psbt.addOutput({
      address: output.address,
      value: output.amount
    });
  });

  // 签署输入
  psbt.signAllInputs(privateKey1);

  // 验证所有输入是否已签名
  psbt.validateSignaturesOfAllInputs();
  psbt.finalizeAllInputs();

  // 提取并返回签名后的交易
  const signedTransaction = psbt.extractTransaction().toHex();
  console.log('signedTransaction==', signedTransaction);
  return signedTransaction;
}


export function buildMultisigTx(params: any) {
  const { pubKeys, signObj, network, requiredSignaturesNumbers } = params;
  const bitcoinNetwork = bitcoin.networks[network as keyof typeof bitcoin.networks];
  const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });

  // 将公钥字符串转换为 Buffer
  const pubKeysBuffer = pubKeys.map((pubKey: string) => Buffer.from(pubKey, 'hex'));

  // 创建多签赎回脚本
  console.log('pubKeys==', pubKeys);
  const redeemScript = bitcoin.payments.p2ms({ m: requiredSignaturesNumbers, pubkeys: pubKeysBuffer, network: bitcoinNetwork }).output;
  console.log('redeemScript==', redeemScript);

  // 创建 P2SH 地址
  const p2sh = bitcoin.payments.p2sh({ redeem: { output: redeemScript, network: bitcoinNetwork }, network: bitcoinNetwork });
  console.log('p2sh==', p2sh);

  // 添加输入
  signObj.inputs.forEach((input: any) => {
    if (!input.rawTx) {
      throw new Error(`Missing rawTx for input with txid ${input.txid}`);
    }
    try {
      const rawTxBuffer = Buffer.from(input.rawTx, 'hex');
      console.log('rawTxBuffer==', rawTxBuffer.toString('hex'));
      psbt.addInput({
        hash: input.txid,
        index: input.vout,
        nonWitnessUtxo: rawTxBuffer,
        redeemScript: p2sh.redeem?.output
      });
    } catch (error) {
      console.error(`Error processing input with txid ${input.txid}:`, error);
      throw error;
    }
  });

  // 添加输出
  signObj.outputs.forEach((output: any) => {
    psbt.addOutput({
      address: output.address,
      value: output.amount
    });
  });

  return psbt;
}


export function signMultisigTx(psbt: any, keyPairs: string[], network: string) {
  const bitcoinNetwork = bitcoin.networks[network as keyof typeof bitcoin.networks];
  
  keyPairs.forEach(keyPair => {
    const keyPairObj = bitcoin.ECPair.fromWIF(keyPair, bitcoinNetwork);
    psbt.signAllInputs(keyPairObj);
  });

  psbt.validateSignaturesOfAllInputs();
  psbt.finalizeAllInputs();

  return psbt.extractTransaction().toHex();
}
