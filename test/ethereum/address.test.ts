import * as bip39 from 'bip39';
import { getLatestNonce, getCurrentGasPrice, hexToDecimal } from '../../src/ethereum/utils';
import { signEthTransaction } from '../../src/ethereum/sign';
import { createEthAddress } from '../../src/ethereum/address';

describe('ethereum sign', () => {   
    test("create eth address", () => {
        const mnemonic = "harvest laugh adjust scare buyer town nerve flat note bicycle aware disorder";
        const seed = bip39.mnemonicToSeedSync(mnemonic)
        const account = createEthAddress(seed.toString("hex"), "0")
        console.log(account)
    });

    test('sign eth', async () => {
        // const nonce = await getLatestNonce("0x5C07fc28a3Ac1cc1C16D3A23645d981Dd81415e3");
        // console.log("nonce==", nonce)
        // const gasPrice = await getCurrentGasPrice()
        // console.log("gasPrice==", gasPrice)
        const rawHex = await signEthTransaction({
            "privateKey": "9984fc141d602ee178bf822427c118cb606ef774b13acb0a5f6e3c1ad32fc940", // 确保这是一个有效的私钥
            "nonce": 1,
            "from": "0x5C07fc28a3Ac1cc1C16D3A23645d981Dd81415e3",
            "to": "0xcaf6F47744b0C951307aB2CF36f80a09a5a17D36",
            "gasLimit": 21000,
            "amount": "0.001",
            "gasPrice": 1479747801300,
            "decimal": 18,
            "chainId": 11155111,
            "tokenAddress": "0x00"
        });
        console.log(rawHex);
    });
});
