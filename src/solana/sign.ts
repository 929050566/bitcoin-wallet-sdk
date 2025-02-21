import {
    clusterApiUrl,
    Connection,
    Keypair,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Message,
    NONCE_ACCOUNT_LENGTH,
    PublicKey,
    NonceAccount
  } from "@solana/web3.js";
import * as nacl from "tweetnacl";
import * as bs58 from "bs58";
import BigNumber from "bignumber.js";
import { number } from "bitcoinjs-lib/src/script";
import * as SPLToken from "@solana/spl-token"
   
  // To complete an offline transaction, I will separate them into four steps
  // 1. Create Transaction
  // 2. Sign Transaction
  // 3. Recover Transaction
  // 4. Send Transaction
   

export async function signSolanaTransaction(from: Keypair, to: Keypair, feePayer: Keypair) {
    // create connection
    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
    const amount: any = await connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH)
    // 1. Create Transaction
    let tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to.publicKey,
        lamports: amount * LAMPORTS_PER_SOL,
      }),
    );
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = feePayer.publicKey;
    let realDataNeedToSign = tx.serializeMessage(); // the real data singer need to sign.
   
    // 2. Sign Transaction
    // use any lib you like, the main idea is to use ed25519 to sign it.
    // the return signature should be 64 bytes.
    let feePayerSignature = nacl.sign.detached(
      realDataNeedToSign,
      feePayer.secretKey,
    );
    
    let fromSignature = nacl.sign.detached(realDataNeedToSign, from.secretKey);
   
    // 3. Recover Transaction
   
    // you can verify signatures before you recovering the transaction
    let verifyFeePayerSignatureResult = nacl.sign.detached.verify(
      realDataNeedToSign,
      feePayerSignature,
      feePayer.publicKey.toBytes(), // you should use the raw pubkey (32 bytes) to verify
    );
    console.log(`verify feePayer signature: ${verifyFeePayerSignatureResult}`);
   
    let verifyfromSignatureResult = nacl.sign.detached.verify(
      realDataNeedToSign,
      fromSignature,
      from.publicKey.toBytes(),
    );
    console.log(`verify from signature: ${verifyfromSignatureResult}`);
   
    // there are two ways you can recover the tx
    // 3.a Recover Transaction (use populate then addSignature)
    {
      let recoverTx = Transaction.populate(Message.from(realDataNeedToSign));
      recoverTx.addSignature(feePayer.publicKey, Buffer.from(feePayerSignature));
      recoverTx.addSignature(from.publicKey, Buffer.from(fromSignature));
   
      // 4. Send transaction
      console.log(
        `txhash: ${await connection.sendRawTransaction(recoverTx.serialize())}`,
      );
    }
   
    // // or
   
    // // 3.b. Recover Transaction (use populate with signature)
    // {
    //   let recoverTx = Transaction.populate(Message.from(realDataNeedToSign), [
    //     bs58.encode(feePayerSignature),
    //     bs58.encode(fromSignature),
    //   ]);
   
    //   // 4. Send transaction
    //   console.log(
    //     `txhash: ${await connection.sendRawTransaction(recoverTx.serialize())}`,
    //   );
    // }
   
    // if this process takes too long, your recent blockhash will expire (after 150 blocks).
    // you can use `durable nonce` to get rid of it.
  }

  export async function signSolTransaction(params: any){
    const {
        txObj:{from, amount, to, nonce, decimal},
        privateKey,
    } = params;
    if(!privateKey) throw new Error("privateKey 为空");
    const fromAccount = Keypair.fromSecretKey(new Uint8Array(Buffer.from(privateKey, "hex")));

    const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString();
    if (calcAmount.indexOf(".") !== -1) throw new Error("decimal 无效");

    let tx = new Transaction();

    const toPubkey = new PublicKey(to);

    tx.add(
        SystemProgram.nonceAdvance({
          noncePubkey: new PublicKey("86gqUCZ6hK5ZKKPYrFYTvZgyghJb5NwdUxx7PNwtLFFF"),
          authorizedPubkey: fromAccount.publicKey,
        }),
        SystemProgram.transfer({
            fromPubkey: fromAccount.publicKey,
            toPubkey: toPubkey,
            lamports: new BigNumber(calcAmount).toNumber(),
        })
    );
    tx.recentBlockhash = nonce;
    tx.sign(fromAccount);
    return tx.serialize().toString("base64");
}

export function prepareAccount (params:any) {
  const {
      authorAddress, nonceAccountAddress, recentBlockhash, minBalanceForRentExemption, privs
  } = params;

  const authorPrivateKey = (privs?.find((ele: { address: any; }) => ele.address === authorAddress))?.key;
  if (!authorPrivateKey) throw new Error('authorPrivateKey 为空');

  const nonceAcctPrivateKey = (privs?.find((ele: { address: any; }) => ele.address === nonceAccountAddress))?.key;
  if (!nonceAcctPrivateKey) throw new Error('nonceAcctPrivateKey 为空');

  const author = Keypair.fromSecretKey(new Uint8Array(Buffer.from(authorPrivateKey, 'hex')));
  const nonceAccount = Keypair.fromSecretKey(new Uint8Array(Buffer.from(nonceAcctPrivateKey, 'hex')));

  const tx = new Transaction();
  tx.add(
      SystemProgram.createAccount({
          fromPubkey: author.publicKey,
          newAccountPubkey: nonceAccount.publicKey,
          lamports: minBalanceForRentExemption,
          space: NONCE_ACCOUNT_LENGTH,
          programId: SystemProgram.programId
      }),

      SystemProgram.nonceInitialize({
          noncePubkey: nonceAccount.publicKey,
          authorizedPubkey: author.publicKey
      })
  );
  tx.recentBlockhash = recentBlockhash;

  tx.sign(author, nonceAccount);
  return tx.serialize().toString('base64');
}

export async function signSolTransactionComplete(params: any){
  const {
      txObj:{from, amount, to, nonce, nonceAccount, decimal, mintAddress, hasCreatedTokenAddr},
      privateKey,
  } = params;

  if(!privateKey) throw new Error("privateKey 为空");
  const fromAccount = Keypair.fromSecretKey(new Uint8Array(Buffer.from(privateKey, "hex")));

  const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString();
  if (calcAmount.indexOf(".") !== -1) throw new Error("decimal 无效");

  let tx = new Transaction();
  let tx1 = new Transaction();
  const toPubkey = new PublicKey(to);
  const fromPubkey = new PublicKey(from);

  if(mintAddress != "0x00"){
      const mint = new PublicKey(mintAddress);
      const fromTokenAccount = await SPLToken.Token.getAssociatedTokenAddress(
          SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
          SPLToken.TOKEN_PROGRAM_ID,
          mint,
          fromPubkey
      );
      const toTokenAccount = await SPLToken.Token.getAssociatedTokenAddress(
          SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
          SPLToken.TOKEN_PROGRAM_ID,
          mint,
          toPubkey
      );
      if(nonceAccount){
        tx.add(
          SystemProgram.nonceAdvance({
            noncePubkey: new PublicKey(nonceAccount),
            authorizedPubkey: fromAccount.publicKey,
          }),
          SPLToken.Token.createTransferInstruction(
              SPLToken.TOKEN_PROGRAM_ID,
              fromTokenAccount,
              toTokenAccount,
              fromPubkey,
              [fromAccount],
              new BigNumber(calcAmount).toNumber()
          ),
        );
      }else{
        SPLToken.Token.createTransferInstruction(
          SPLToken.TOKEN_PROGRAM_ID,
          fromTokenAccount,
          toTokenAccount,
          fromPubkey,
          [fromAccount],
          new BigNumber(calcAmount).toNumber()
        )
      }
      if(!hasCreatedTokenAddr){
        if(nonceAccount){
          tx1.add(
            SystemProgram.nonceAdvance({
              noncePubkey: new PublicKey(nonceAccount),
              authorizedPubkey: fromAccount.publicKey,
            }),
            SPLToken.Token.createAssociatedTokenAccountInstruction(
                SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
                SPLToken.TOKEN_PROGRAM_ID,
                mint,
                toTokenAccount,
                toPubkey,
                fromAccount.publicKey
            ),
            SPLToken.Token.createTransferInstruction(
                SPLToken.TOKEN_PROGRAM_ID,
                fromTokenAccount,
                toTokenAccount,
                fromPubkey,
                [fromAccount], // mutiple signers需要带
                new BigNumber(calcAmount).toNumber()
            )
          );
        }else{
          tx1.add(
            SPLToken.Token.createAssociatedTokenAccountInstruction(
                SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
                SPLToken.TOKEN_PROGRAM_ID,
                mint,
                toTokenAccount,
                toPubkey,
                fromAccount.publicKey
            ),
            SPLToken.Token.createTransferInstruction(
                SPLToken.TOKEN_PROGRAM_ID,
                fromTokenAccount,
                toTokenAccount,
                fromPubkey,
                [fromAccount], // mutiple signers需要带
                new BigNumber(calcAmount).toNumber()
            )
         );
        }
      }
  }else{
      if(nonceAccount){
        console.log("========nonceAccount========")
        tx.add(
          SystemProgram.nonceAdvance({
            noncePubkey: new PublicKey("86gqUCZ6hK5ZKKPYrFYTvZgyghJb5NwdUxx7PNwtLFFF"),
            authorizedPubkey: fromAccount.publicKey,
          }),
          SystemProgram.transfer({
              fromPubkey: fromAccount.publicKey,
              toPubkey: toPubkey,
              lamports: new BigNumber(calcAmount).toNumber(),
          })
        );
      }else{
        tx.add(
          SystemProgram.transfer({
              fromPubkey: fromAccount.publicKey,
              toPubkey: toPubkey,
              lamports: new BigNumber(calcAmount).toNumber(),
          })
        );
      }
      
  }
  tx.recentBlockhash = nonce;
  tx.sign(fromAccount);
  const serializeMsg = tx.serialize().toString("base64");
  if(mintAddress != "0x00"){
      if(!hasCreatedTokenAddr){
          tx1.recentBlockhash = nonce;
          tx1.sign(fromAccount);
          const serializeMsg1 = tx1.serialize().toString("base64");
          return JSON.stringify([serializeMsg1, serializeMsg]);
      }else{
          return JSON.stringify([serializeMsg]);
      }
  }
  return serializeMsg;
}