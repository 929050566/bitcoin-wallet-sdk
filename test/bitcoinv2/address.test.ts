import * as bip39 from 'bip39';
import * as assert from 'assert';
import { createSchnorrAddress } from '../../src/bitcoinv2/address';



describe('btc unit test case', () => {
    test('createTaprootAddress mainnet',async () => {
        const mnemonic = "sort what document outdoor plastic little country witness output beauty upon pudding";
        const seedHex = bip39.mnemonicToSeedSync(mnemonic);
        const params = {
            seedHex: seedHex,
            receiveOrChange: 0,
            addressIndex: 0,
            network: "mainnet"
        }
        const account = await createSchnorrAddress(params)
        console.log("account==", account)
        assert.strictEqual(account.address, 'bc1pp4802jvzr9vswddm4msstqdfgsjg5f9yvfh458q4e9xw0qcacrzs49sw25');
        assert.strictEqual(account.privateKey, 'f428b745e84757d24eca18eb662d9063394353afa6e27f4bea9a632dd53f4c7f');
        assert.strictEqual(account.publicKey, '02f98454c31779f6b40780e06acfe9722793dfe3090098ec6574749a4dcf398050');
    });

    test('createTaprootAddress testnet',async () => {
        const mnemonic = "sort what document outdoor plastic little country witness output beauty upon pudding";
        const seedHex = bip39.mnemonicToSeedSync(mnemonic);
        const params = {
            seedHex: seedHex,
            receiveOrChange: 0,
            addressIndex: 0,
            network: "testnet"
        }
        const account = await createSchnorrAddress(params)
        console.log("account==", account)
        assert.strictEqual(account.address, 'tb1pp4802jvzr9vswddm4msstqdfgsjg5f9yvfh458q4e9xw0qcacrzszdxpsm');
        assert.strictEqual(account.privateKey, 'f428b745e84757d24eca18eb662d9063394353afa6e27f4bea9a632dd53f4c7f');
        assert.strictEqual(account.publicKey, '02f98454c31779f6b40780e06acfe9722793dfe3090098ec6574749a4dcf398050');
    });

});
