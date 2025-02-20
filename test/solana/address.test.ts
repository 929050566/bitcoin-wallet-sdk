import { createAddress, createAddressByMnemonic, importAddress } from "../../src/solana/address";
import { uint8ArrayToString } from "../../common/utils/conversion";
import * as assert from 'assert';

describe('solana unit test case', () => {
    test('createAddress', async () => {
        const keyPair = await createAddress({})
        const publicKey = await importAddress({privateKey: keyPair.secretKey});
        const publicKeyStr = uint8ArrayToString(publicKey.publicKey.toBytes());
        const privateKey = uint8ArrayToString(publicKey.secretKey);
        console.log("privateKey==", privateKey);
        console.log("publicKeyStr==", publicKeyStr);
    });

    test('importAddress', async () => {
        const account = await importAddress({privateKey: ""});
        console.log("account==", account);
    });



    test('createAddressByMnoemonic', async () => {
        const params =  { mnemonic:"bus crowd gun upgrade educate barrel snap duck health bleak outer broken"} 
        // const params =  { mnemonic:"harvest laugh adjust scare buyer town nerve flat note bicycle aware disorder"} 
        // const params = {mnemonic: "flip allow hammer valve elevator scrub inflict upon identify page orbit token"}
        const account = await createAddressByMnemonic(params);
        const {privateKey , publicKey, address} = account;
        console.log("account==", account);
        assert.strictEqual(address, "8C6xzZPT3UKxgf7dUBvnbbLwF5u64hM3gqDKDz4KXTV8");
        assert.strictEqual(privateKey, "aaad9398934126d3f4c6c530806a16da69122057d7ad67d3f31f9fd38db014ef6ad9f14590589c71f4fc7b393b8dee8d8d39c7da9da3be9cd658f461c57afcf7"); 
        assert.strictEqual(publicKey, "6ad9f14590589c71f4fc7b393b8dee8d8d39c7da9da3be9cd658f461c57afcf7");
    });
});