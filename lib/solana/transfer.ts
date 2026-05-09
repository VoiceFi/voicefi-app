import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { USDC_MINT } from "./constants";

const USDC_DECIMALS = 6;

export async function buildSolTransferTx(args: {
  connection: Connection;
  sender: PublicKey;
  recipient: PublicKey;
  amountSol: number;
}): Promise<Uint8Array> {
  const { connection, sender, recipient, amountSol } = args;

  if (!(amountSol > 0)) {
    throw new Error("Amount must be greater than zero.");
  }

  const lamports = BigInt(Math.round(amountSol * LAMPORTS_PER_SOL));
  const instruction = SystemProgram.transfer({
    fromPubkey: sender,
    toPubkey: recipient,
    lamports,
  });

  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  const tx = new Transaction({ feePayer: sender, recentBlockhash: blockhash });
  tx.add(instruction);

  return tx.serialize({ requireAllSignatures: false });
}

export async function buildUsdcTransferTx(args: {
  connection: Connection;
  sender: PublicKey;
  recipient: PublicKey;
  amountUsdc: number;
}): Promise<Uint8Array> {
  const { connection, sender, recipient, amountUsdc } = args;

  if (!(amountUsdc > 0)) {
    throw new Error("Amount must be greater than zero.");
  }

  const senderAta = getAssociatedTokenAddressSync(USDC_MINT, sender);
  const recipientAta = getAssociatedTokenAddressSync(USDC_MINT, recipient);

  const instructions: TransactionInstruction[] = [];

  const recipientAtaInfo = await connection.getAccountInfo(recipientAta);
  if (!recipientAtaInfo) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        sender,
        recipientAta,
        recipient,
        USDC_MINT,
      ),
    );
  }

  const baseUnits = BigInt(Math.round(amountUsdc * 10 ** USDC_DECIMALS));
  instructions.push(
    createTransferCheckedInstruction(
      senderAta,
      USDC_MINT,
      recipientAta,
      sender,
      baseUnits,
      USDC_DECIMALS,
    ),
  );

  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  const tx = new Transaction({ feePayer: sender, recentBlockhash: blockhash });
  tx.add(...instructions);

  return tx.serialize({ requireAllSignatures: false });
}
