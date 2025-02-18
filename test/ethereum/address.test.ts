import * as bip39 from 'bip39';
import { getLatestNonce, getCurrentGasPrice, hexToDecimal } from '../../src/ethereum/utils';
import { createEthAddress } from '../../src/ethereum/address';

describe('ethereum sign', () => {   
    test("create eth address", () => {
        const mnemonic = "harvest laugh adjust scare buyer town nerve flat note bicycle aware disorder";
        const seed = bip39.mnemonicToSeedSync(mnemonic)
        const account = createEthAddress(seed.toString("hex"), "0")
        console.log(account)
    });
});
