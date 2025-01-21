// const bitcoin = require('bitcoinjs-lib');
import * as bitcoin from 'bitcoinjs-lib';
const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);


/**
     *  1. P2PKH (Pay-to-Public-Key-Hash)
    格式: 以数字 1 开头。
    特点:
    传统的比特币地址类型。
    地址是公钥的哈希值。
    需要用户提供公钥和签名进行交易。
    优点: 简单易用，广泛支持。
    缺点: 交易费用相对较高，因为它使用较大的数据量。

    2. P2SH (Pay-to-Script-Hash)
    格式: 以数字 3 开头。
    特点:
    地址是脚本的哈希值，允许更复杂的交易。
    可以实现多重签名等高级功能。
    用户可以在交易中提供一个脚本，说明如何解锁资金。
    优点: 灵活性高，支持多种复杂的支付条件。
    缺点: 相对复杂，理解和实现需要更多的知识。

    3. P2WPKH (Pay-to-Witness-Public-Key-Hash)
    格式: 以 bc1 开头（Bech32格式）。
    特点:
    属于隔离见证（Segregated Witness）的一部分。
    地址是公钥的哈希值，且交易数据分离，减少了区块链上的数据量。
    优点:
    交易费用低，效率高。
    提高了区块链的容量。
    缺点: 并非所有钱包和交易所都支持。

    总结
    P2PKH: 传统，简单，广泛支持，但费用较高。
    P2SH: 灵活，支持复杂脚本，多重签名等，但复杂度高。
    P2WPKH: 现代，低费用，效率高，但支持度可能有限。
 */
export function createAddress(params: any): any {
    const { seedHex, receiveOrChange, addressIndex, network, method, path } = params;
    const root = bip32.fromSeed(Buffer.from(seedHex, 'hex'));
    // 比特币的path是m/44'/0'/0'/0/0
    console.log('path:', path);
    let path1 =  path ? path: "m/44'/0'/0'/0/" + addressIndex + '';
    if (receiveOrChange === '1') {
        path1 = "m/44'/0'/0'/1/" + addressIndex + '';
    }
    const child = root.derivePath(path1);
    let address: string;
    switch (method) {
        case 'p2pkh':
            // eslint-disable-next-line no-case-declarations
            const p2pkhAddress = bitcoin.payments.p2pkh({
                pubkey: child.publicKey,
                network: bitcoin.networks[network as keyof typeof bitcoin.networks]
            });
            address = p2pkhAddress.address;
            break;
        case 'p2wpkh':
            // eslint-disable-next-line no-case-declarations
            const p2wpkhAddress = bitcoin.payments.p2wpkh({
                pubkey: child.publicKey,
                network: bitcoin.networks[network as keyof typeof bitcoin.networks]
            });
            address = p2wpkhAddress.address;
            break;
        case 'p2sh':
            // eslint-disable-next-line no-case-declarations
            const p2shAddress = bitcoin.payments.p2sh({
                redeem: bitcoin.payments.p2wpkh({
                    pubkey: child.publicKey,
                    network: bitcoin.networks[network as keyof typeof bitcoin.networks]
                })
            });
            address = p2shAddress.address;
            break;
        default:
            console.log('This way can not support');
    }

    return {
        privateKey: Buffer.from(child.privateKey).toString('hex'),
        publicKey: Buffer.from(child.publicKey).toString('hex'),
        address
    };
}

/**
 * 
比特币的多签地址（Multi-Signature Address）并不是一开始就有的，而是通过 BIP（Bitcoin Improvement Proposal）协议新增的。

多签地址的历史
初始版本:

比特币最初的版本并不支持多签地址。
早期的比特币交易只支持简单的单签名（Single-Signature）地址，即一个私钥对应一个地址。
BIP-11: Multi-Signature Addresses:

多签地址的支持是通过 BIP-11 引入的。
BIP-11 提出了多签地址的概念，允许一个地址需要多个私钥的签名才能花费其中的比特币。
多签地址使用 P2SH（Pay-to-Script-Hash）脚本实现。
BIP-16: Pay to Script Hash (P2SH):

BIP-16 引入了 P2SH 地址，这使得多签地址的实现更加简便和灵活。
P2SH 地址允许将复杂的脚本嵌入到一个简单的地址中，从而支持多签名和其他复杂的交易条件。
BIP-45: Common Multisig:

BIP-45 提出了一个标准化的多签地址生成方案，特别适用于钱包和其他应用程序。
该提案定义了多签地址的生成和使用方法，确保不同钱包之间的兼容性。
 */
export function createMultiSignAddress (params: any): string {
    const { pubkeys, network, method, threshold } = params;
    switch (method) {
      case 'p2pkh':
        return bitcoin.payments.p2sh({
          redeem: bitcoin.payments.p2ms({
            m: threshold,
            network: bitcoin.networks[network as keyof typeof bitcoin.networks],
            pubkeys
          })
        }).address;
      case 'p2wpkh':
        return bitcoin.payments.p2wsh({
          redeem: bitcoin.payments.p2ms({
            m: threshold,
            network: bitcoin.networks[network as keyof typeof bitcoin.networks],
            pubkeys
          })
        }).address;
      case 'p2sh':
        return bitcoin.payments.p2sh({
          redeem: bitcoin.payments.p2wsh({
            redeem: bitcoin.payments.p2ms({
              m: threshold,
              network: bitcoin.networks[network as keyof typeof bitcoin.networks],
              pubkeys
            })
          })
        }).address;
      default:
        console.log('This way can not support');
        return '0x00';
    }
  }