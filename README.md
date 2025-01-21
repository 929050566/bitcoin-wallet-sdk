# Bitcoin Multi-Signature Transaction Library

This library provides tools for creating and signing Bitcoin transactions, with a focus on multi-signature (multisig) functionality. It supports both single-signature and multi-signature transactions using BitcoinJS and Bitcore libraries.

## Features

- Create and sign standard Bitcoin transactions
- Multi-signature transaction support (2-of-3, 3-of-5, etc.)
- Testnet and Mainnet support
- PSBT (Partially Signed Bitcoin Transaction) implementation
- Address generation and validation
- BIP32 hierarchical deterministic wallet support

## Installation

```bash
npm install
```

## Usage

### Importing the Library

```typescript
import { 
  buildAndSignTx,
  buildUnsignTxAndSign,
  buildUnsignTxAndSign2 
} from './src/sign';
```

### Creating a Single-Signature Transaction

```typescript
const signedTx = buildAndSignTx({
  privateKey: 'your-private-key',
  signObj: {
    inputs: [...],
    outputs: [...]
  },
  network: 'testnet'
});
```

### Creating a Multi-Signature Transaction

```typescript
const signedTx = buildUnsignTxAndSign2({
  keyPair: 'your-private-key',
  signObj: {
    inputs: [...],
    outputs: [...]
  },
  network: 'testnet'
});
```

## API Documentation

### buildAndSignTx(params)
Creates and signs a standard Bitcoin transaction.

### buildUnsignTxAndSign(params)
Creates and signs a multi-signature transaction (2-of-2).

### buildUnsignTxAndSign2(params)
Creates and signs a multi-signature transaction with flexible signing requirements.

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
