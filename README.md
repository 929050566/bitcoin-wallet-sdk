# Bitcoin Transaction Library

This library provides comprehensive tools for Bitcoin transaction management, including address generation, single/multi-signature transactions, and various address type support. Built using BitcoinJS and Bitcore libraries.

## Features

- Address generation for P2PKH, P2SH, P2WPKH formats
- Multi-signature transaction support (m-of-n)
- Single-signature transaction support
- Testnet and Mainnet support
- PSBT (Partially Signed Bitcoin Transaction) implementation
- BIP32 hierarchical deterministic wallet support
- Support for legacy and SegWit address formats
- Multi-signature address creation

## Installation

```bash
npm install
```

## Usage

### Importing the Library

```typescript
import { 
  createAddress,
  createMultiSignAddress,
  buildAndSignTx,
  buildMultisigTx,
  signMultisigTx
} from './src';
```

### Address Generation

```typescript
// Single-signature address
const address = createAddress({
  seedHex: 'your-seed-hex',
  receiveOrChange: '0', // 0 for receive, 1 for change
  addressIndex: 0,
  network: 'testnet',
  method: 'p2pkh' // or 'p2sh', 'p2wpkh'
});

// Multi-signature address
const multisigAddress = createMultiSignAddress({
  pubkeys: ['pubkey1', 'pubkey2', 'pubkey3'],
  network: 'testnet',
  method: 'p2sh',
  threshold: 2 // 2-of-3
});
```

### Transaction Creation

```typescript
// Single-signature transaction
const signedTx = buildAndSignTx({
  privateKey: 'your-private-key',
  signObj: {
    inputs: [...],
    outputs: [...]
  },
  network: 'testnet'
});

// Multi-signature transaction
const psbt = buildMultisigTx({
  pubKeys: ['pubkey1', 'pubkey2', 'pubkey3'],
  signObj: {
    inputs: [...],
    outputs: [...]
  },
  network: 'testnet',
  requiredSignaturesNumbers: 2 // 2-of-3
});

// Sign multi-signature transaction
const signedTx = signMultisigTx(psbt, ['privateKey1', 'privateKey2'], 'testnet');
```

## API Documentation

### Address Functions

#### createAddress(params)
Creates a single-signature address with specified parameters.

#### createMultiSignAddress(params)
Creates a multi-signature address with specified parameters.

### Transaction Functions

#### buildAndSignTx(params)
Creates and signs a standard Bitcoin transaction.

#### buildMultisigTx(params)
Creates a multi-signature PSBT transaction.

#### signMultisigTx(psbt, keyPairs, network)
Signs a multi-signature PSBT transaction.

## Testing

Run the test suite:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
