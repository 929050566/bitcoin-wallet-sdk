import { importAddress, importAddressFromSeed, privateKeyToSecreKey } from '../../src/solana/address';
import { prepareAccount, signSolTransaction, signSolTransactionComplete } from '../../src/solana/sign';
import {NonceAccount, Connection, PublicKey} from "@solana/web3.js"
import * as bip39 from "bip39"
import { derivePath, getPublicKey } from 'ed25519-hd-key';


describe('ethereum sign', () => {   
    test('sign solana transcation', async () => {
        
        const params = {
            txObj: {
                from: "6ad9f14590589c71f4fc7b393b8dee8d8d39c7da9da3be9cd658f461c57afcf7",
                to: "9rBHkSU6Pj7BAQackKjDU21P58JiXAFGj6kZrEnrjp1f",
                amount: "0.0001",
                nonce: "J65ckbiSAv3humHPK1gbmdw4QYkBt6f1jo5de9Dre6eG",
                decimal: 9,
            },
            privateKey: "aaad9398934126d3f4c6c530806a16da69122057d7ad67d3f31f9fd38db014ef6ad9f14590589c71f4fc7b393b8dee8d8d39c7da9da3be9cd658f461c57afcf7"
        }
        const rawTranscation = await signSolTransaction(params)
        console.log(rawTranscation);
    });

    test('sign prepareNonceAccount transcation', async () => {
        // const nonce = await getLatestNonce("0x5C07fc28a3Ac1cc1C16D3A23645d981Dd81415e3");
        // console.log("nonce==", nonce)
        // const gasPrice = await getCurrentGasPrice()
        // console.log("gasPrice==", gasPrice)
        const params = {
            authorAddress: "9rBHkSU6Pj7BAQackKjDU21P58JiXAFGj6kZrEnrjp1f" , 
            nonceAccountAddress: "86gqUCZ6hK5ZKKPYrFYTvZgyghJb5NwdUxx7PNwtLFFF", 
            recentBlockhash: "AaukVYecudc7uV7gWt9U2o1YGsmL3mXbto1snwtPp3uS", 
            minBalanceForRentExemption: "1638880", 
            privs: [
                {
                    address: "9rBHkSU6Pj7BAQackKjDU21P58JiXAFGj6kZrEnrjp1f",
                    key: "a6074a8602d61da76bbdf43185ef5d713fad9132a7f4034ee96bcfa8c96ae5fe837696af2d0b6c41f0edbb170d00eae09fc4a886f44dc9f69d82b8dcca13e742"
                },
                {
                    address: "86gqUCZ6hK5ZKKPYrFYTvZgyghJb5NwdUxx7PNwtLFFF",
                    key: "17ff2e7c4c48a545391f2951bf1a1824dc6babc0b3eacfcc57f68229559f60106976c13efba9e506e942eed39cf4be91b52c7bf747df510cee9623a25e7f905a"
                }
            ]
        };
        const rawTranscation = await prepareAccount(params)
        console.log(rawTranscation);
    });

    test('sign accountNonce transcation', async () => {
        var connection = new Connection("https://api.zan.top/node/v1/solana/mainnet/8ebb66a54df04529869739b307a43384","confirmed");
        // const buff = Buffer.from("6976c13efba9e506e942eed39cf4be91b52c7bf747df510cee9623a25e7f905a")
        const nonce = await connection.getNonce(new PublicKey("86gqUCZ6hK5ZKKPYrFYTvZgyghJb5NwdUxx7PNwtLFFF"))
        console.log("nonce == ", nonce)
        const nonceAccount = NonceAccount.fromAccountData(Buffer.from("df8aQUMTjGto7ynuFCN5e8VocYmBc3wevRo1Ki4ow93hsmjTpNscFbvnQ8AjPfdM3BLL6rSKhvitpqpuuc92uEka2kY13ZV8bGAD7L76Agi3"))
        console.log(nonceAccount)
        console.log(nonceAccount.authorizedPubkey)
        const params = {
            txObj: {
                from: "9rBHkSU6Pj7BAQackKjDU21P58JiXAFGj6kZrEnrjp1f",
                to: "8C6xzZPT3UKxgf7dUBvnbbLwF5u64hM3gqDKDz4KXTV8",
                amount: "0.0001",
                nonceAccount: nonce.nonce,
                nonce: nonce.nonce,
                decimal: 9,
                mintAddress: "0x00"
            },
            privateKey: "a6074a8602d61da76bbdf43185ef5d713fad9132a7f4034ee96bcfa8c96ae5fe837696af2d0b6c41f0edbb170d00eae09fc4a886f44dc9f69d82b8dcca13e742"
        }
        const rawTranscation = await signSolTransactionComplete(params)
        console.log(rawTranscation);
    });

    test('sign accountNonce2 transcation', async () => {
        var connection = new Connection("https://api.zan.top/node/v1/solana/mainnet/8ebb66a54df04529869739b307a43384","confirmed");
        // const buff = Buffer.from("6976c13efba9e506e942eed39cf4be91b52c7bf747df510cee9623a25e7f905a")
        const nonce = await connection.getNonce(new PublicKey("86gqUCZ6hK5ZKKPYrFYTvZgyghJb5NwdUxx7PNwtLFFF"))
        console.log("nonce == ", nonce)
        const params = {
            txObj: {
                from: "9rBHkSU6Pj7BAQackKjDU21P58JiXAFGj6kZrEnrjp1f",
                to: "8C6xzZPT3UKxgf7dUBvnbbLwF5u64hM3gqDKDz4KXTV8",
                amount: "0.0001",
                nonce: nonce.nonce,
                decimal: 9,
            },
            privateKey: "a6074a8602d61da76bbdf43185ef5d713fad9132a7f4034ee96bcfa8c96ae5fe837696af2d0b6c41f0edbb170d00eae09fc4a886f44dc9f69d82b8dcca13e742"
        }
        const rawTranscation = await signSolTransaction(params)
        console.log(rawTranscation);
    });



    /**  
     * account== {
      privateKey: '17ff2e7c4c48a545391f2951bf1a1824dc6babc0b3eacfcc57f68229559f60106976c13efba9e506e942eed39cf4be91b52c7bf747df510cee9623a25e7f905a',
      publicKey: '6976c13efba9e506e942eed39cf4be91b52c7bf747df510cee9623a25e7f905a',
      address: '86gqUCZ6hK5ZKKPYrFYTvZgyghJb5NwdUxx7PNwtLFFF'
    } */  

    /**
     *  account== {
      privateKey: 'a6074a8602d61da76bbdf43185ef5d713fad9132a7f4034ee96bcfa8c96ae5fe837696af2d0b6c41f0edbb170d00eae09fc4a886f44dc9f69d82b8dcca13e742',
      publicKey: '837696af2d0b6c41f0edbb170d00eae09fc4a886f44dc9f69d82b8dcca13e742',
      address: '9rBHkSU6Pj7BAQackKjDU21P58JiXAFGj6kZrEnrjp1f'
    }
     */
});
