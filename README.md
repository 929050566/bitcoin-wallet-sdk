# Blockchain Project

This project provides utilities and functionalities for working with Ethereum and Bitcoin blockchains. It includes functions for creating addresses, signing transactions, and fetching blockchain data.

## Features

- **Ethereum**
  - Create Ethereum addresses from seed
  - Sign Ethereum transactions
  - Fetch the latest nonce for an Ethereum address
  - Fetch the current gas price
  - Convert hexadecimal to decimal

- **Bitcoin**
  - Build and sign Bitcoin transactions
  - Build and sign multisig Bitcoin transactions

## Installation

To install the dependencies, run:

```bash
npm install
```

## Usage

### Ethereum

#### Create Ethereum Address

```typescript
import * as bip39 from 'bip39';
import { createEthAddress } from './src/ethereum/address';

const mnemonic = "your mnemonic phrase here";
const seed = bip39.mnemonicToSeedSync(mnemonic);
const account = createEthAddress(seed.toString("hex"), "0");
console.log(account);
```

#### Sign Ethereum Transaction

```typescript
import { signEthTransaction } from './src/ethereum/sign';

const rawHex = await signEthTransaction({
  privateKey: "your private key here",
  nonce: 1,
  from: "your from address here",
  to: "your to address here",
  gasLimit: 21000,
  amount: "0.001",
  gasPrice: 1000000000,
  decimal: 18,
  chainId: 1,
  tokenAddress: "0x00"
});
console.log(rawHex);
```

#### Fetch Latest Nonce

```typescript
import { getLatestNonce } from './src/ethereum/utils';

const nonce = await getLatestNonce("your address here");
console.log(nonce);
```

#### Fetch Current Gas Price

```typescript
import { getCurrentGasPrice } from './src/ethereum/utils';

const gasPrice = await getCurrentGasPrice();
console.log(gasPrice);
```

#### Convert Hexadecimal to Decimal

```typescript
import { hexToDecimal } from './src/ethereum/utils';

const decimalValue = hexToDecimal("0x88f2c5527");
console.log(decimalValue);
```

### Bitcoin

#### Build and Sign Bitcoin Transaction

```typescript
import { buildAndSignTx } from './src/bitcoin/sign';

const signedTx = buildAndSignTx({
  privateKey: "your private key here",
  signObj: {
    inputs: [
      {
        address: "your input address here",
        txid: "your input txid here",
        vout: 0,
        amount: 100000
      }
    ],
    outputs: [
      {
        address: "your output address here",
        amount: 90000
      }
    ]
  },
  network: "mainnet"
});
console.log(signedTx);
```

#### Build and Sign Multisig Bitcoin Transaction

```typescript
import { buildMultisigTx, signMultisigTx } from './src/bitcoin/sign';

const psbt = buildMultisigTx({
  pubKeys: ["your pubkey1 here", "your pubkey2 here"],
  signObj: {
    inputs: [
      {
        address: "your input address here",
        txid: "your input txid here",
        vout: 0,
        rawTx: "your raw transaction here"
      }
    ],
    outputs: [
      {
        address: "your output address here",
        amount: 90000
      }
    ]
  },
  network: "mainnet",
  requiredSignaturesNumbers: 2
});

const signedTx = signMultisigTx(psbt, ["your WIF key1 here", "your WIF key2 here"], "mainnet");
console.log(signedTx);
```

## Running Tests

To run the tests, use the following command:

```bash
npm test
```

## License

This project is licensed under the MIT License.
