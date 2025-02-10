import { createMnemonic } from '../../sdk/bip39';
import * as bip39 from 'bip39';
import {createAddress,createMultiSignAddress } from "../../src/bitcoin/address";
import * as assert from 'assert';



describe('btc unit test case', () => {
  test('createAddress by p2pkh mainnet', () => {
      const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
      const seed = bip39.mnemonicToSeedSync(mnemonic, "")
    const param = {
        seedHex: seed.toString("hex"),
        receiveOrChange: "0",
        addressIndex: "0",
        network: "mainnet",
        method: "p2pkh",
        path: "m/44'/0'/0'/0/0"
    }
      const account = createAddress(param)
      console.log(account.address);
      assert.strictEqual(account.address, '1H7AcqzvVQunYftUcJMxF9KUrFayEnf83T');
      assert.strictEqual(account.privateKey, '60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e');
      assert.strictEqual(account.publicKey, '030e93482fd0037d589b08c36bb22afc041338ba444f9f9d7ba129348f9be731c1');
      param["path"] = "m/44'/0'/1'/0/0";
      const account1 = createAddress(param)
      console.log("account1==", account1)
      assert.strictEqual(account1.address, '17LUBm3kbKXGknbrDMbZxXEFDHvZ3iBsrU');
      assert.strictEqual(account1.privateKey, '75889ba8b86a0585f9c47b004e8de17d53113c0c41be52feca04cf0716c10637');
      assert.strictEqual(account1.publicKey, '028fa670518cf872b9a9464f0ade08eda6c2b6015fea4d3d49ea847113f1f84d19');
      param["path"] = "m/44'/0'/2'/0/0";
      const account2 = createAddress(param)
      console.log("accoun2t==", account2)
      assert.strictEqual(account2.address, '1HMtaTmVEj22rvYArCWVApAguqVSViPsN4');
      assert.strictEqual(account2.privateKey, '291ca062f3c1fb3260bcba3e2dda8bb75484c1661433a143dbee660ead975e62');
      assert.strictEqual(account2.publicKey, '02fe5cb46b4057851d78440ebfe43769a546c3a2941a43f4c912aff4854f3f7fff');
  });

  test('createEthereumAddress by p2pkh mainnet ', () => {
    const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
    const seed = bip39.mnemonicToSeedSync(mnemonic, "")
    const param = {
        seedHex: seed.toString("hex"),
        receiveOrChange: "0",
        addressIndex: "0",
        network: "mainnet",
        method: "p2pkh",
        path: "m/44'/60'/0'/0/0"
    }
    const account1 = createAddress(param)
    console.log("account1==", account1)
    assert.strictEqual(account1.address, '138CBAx3KaS6yq77RCCtoCvP3viUtni6T7');
    assert.strictEqual(account1.privateKey, 'c539a16d74b731e11da642f25fb8e86a1489647839ab413327f3cc529fa60079');
    assert.strictEqual(account1.publicKey, '022505a03b55f896c0948f35a2c63b46f6a4cdb8221164bc27bb9980617dacbce7');
});

  test('createAddress by p2pkh testnet', () => {
      const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
      const seed = bip39.mnemonicToSeedSync(mnemonic, "")
      const param = {
          seedHex: seed.toString("hex"),
          receiveOrChange: "0",
          addressIndex: "0",
          network: "testnet",
          method: "p2pkh"
      }
      const account = createAddress(param)
      console.log(account.address);
      assert.strictEqual(account.address, 'mwd7uu5uJSM3KnN6KsLL54XoiFBg4JYX7o');
      assert.strictEqual(account.privateKey, '60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e');
      assert.strictEqual(account.publicKey, '030e93482fd0037d589b08c36bb22afc041338ba444f9f9d7ba129348f9be731c1');
  });

  test('createAddress by p2wpkh maninet', () => {
      const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
      const seed = bip39.mnemonicToSeedSync(mnemonic, "")
      const param = {
          seedHex: seed.toString("hex"),
          receiveOrChange: "0",
          addressIndex: "0",
          network: "mainnet",
          method: "p2wpkh"
      }
      const account = createAddress(param)
      assert.strictEqual(account.address, 'bc1qkzkgj7n4n72yhyjmpzs3a6uzy5kj3cmkad2dk7');
      assert.strictEqual(account.privateKey, '60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e');
      assert.strictEqual(account.publicKey, '030e93482fd0037d589b08c36bb22afc041338ba444f9f9d7ba129348f9be731c1');
  });

  test('createAddress by p2wpkh testnet', () => {
      const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
      const seed = bip39.mnemonicToSeedSync(mnemonic, "")
      const param = {
          seedHex: seed.toString("hex"),
          receiveOrChange: "0",
          addressIndex: "0",
          network: "testnet",
          method: "p2wpkh"
      }
      const account = createAddress(param)
      console.log("account==", account)
      assert.strictEqual(account.address, 'tb1qkzkgj7n4n72yhyjmpzs3a6uzy5kj3cmkht37dd');
      assert.strictEqual(account.privateKey, '60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e');
      assert.strictEqual(account.publicKey, '030e93482fd0037d589b08c36bb22afc041338ba444f9f9d7ba129348f9be731c1');
  });

  test('createAddress by p2sh mainnet', () => {
      const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
      const seed = bip39.mnemonicToSeedSync(mnemonic, "")
      const param = {
          seedHex: seed.toString("hex"),
          receiveOrChange: "0",
          addressIndex: "0",
          network: "mainnet",
          method: "p2sh"
      }
      const account = createAddress(param)
      assert.strictEqual(account.address, '35iXFVdZb5qxeqxgkZHBaS3KjaP89e79kP');
      assert.strictEqual(account.privateKey, '60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e');
      assert.strictEqual(account.publicKey, '030e93482fd0037d589b08c36bb22afc041338ba444f9f9d7ba129348f9be731c1');
  });

  test('createAddress by p2sh testnet', () => {
      const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
      const seed = bip39.mnemonicToSeedSync(mnemonic, "")
      const param = {
          seedHex: seed.toString("hex"),
          receiveOrChange: "0",
          addressIndex: "0",
          network: "testnet",
          method: "p2sh"
      }
      const account = createAddress(param)
      assert.strictEqual(account.address, '2MwGjKEZbCYMJrdbERgu4CP2awvbHyHgyqt');
      assert.strictEqual(account.privateKey, '60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e');
      assert.strictEqual(account.publicKey, '030e93482fd0037d589b08c36bb22afc041338ba444f9f9d7ba129348f9be731c1');
  });

  test('p2pkh multi sign 3-2 address', () => {
      const param = {
          pubkeys: [
              '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
              '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
              '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
          ].map(hex => Buffer.from(hex, 'hex')),
          network: "mainnet",
          method: "p2pkh",
          threshold: 2
      }
      const address = createMultiSignAddress(param)
      assert.strictEqual(address, '36NUkt6FWUi3LAWBqWRdDmdTWbt91Yvfu7');
  });

  test('p2wpkh multi sign 3-2 address', () => {
      const param = {
          pubkeys: [
              '02f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
              '03d01115d548e7561b15c38f004d734633687cf4419620095bc5b0f47070afe85a',
              '03f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8',
          ].map(hex => Buffer.from(hex, 'hex')),
          network: "mainnet",
          method: "p2wpkh",
          threshold: 2
      }
      const address = createMultiSignAddress(param)
      assert.strictEqual(address, 'bc1qj67d3x5sv3cqdnfje67f9kdlavv7fv6xreznweymj3nqj493pulqz8e6gj');
  });

  test('p2sh multi sign 3-2 address', () => {
      const param = {
        pubkeys: [
            '02f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
            '03d01115d548e7561b15c38f004d734633687cf4419620095bc5b0f47070afe85a',
            '03f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8',
        ].map(hex => Buffer.from(hex, 'hex')),
          network: "mainnet",
          method: "p2sh",
          threshold: 2
      }
      const address = createMultiSignAddress(param)
      console.log("address==", address)
      assert.strictEqual(address, '3543a1Jqa4MWHvtSQ6H6ttPxptyzBPZxRN');
  });

});
