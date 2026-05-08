import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SOLANA_RPC_URL, USDC_MINT } from "./constants";

function getConnection(): Connection {
  return new Connection(SOLANA_RPC_URL, "confirmed");
}

export async function getSolBalance(walletAddress: string): Promise<number> {
  const connection = getConnection();
  const pubkey = new PublicKey(walletAddress);
  const lamports = await connection.getBalance(pubkey);
  return lamports / LAMPORTS_PER_SOL;
}

export async function getUsdcBalance(walletAddress: string): Promise<number> {
  const connection = getConnection();
  const pubkey = new PublicKey(walletAddress);

  const accounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
    mint: USDC_MINT,
  });

  if (accounts.value.length === 0) return 0;

  const amount =
    accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
  return amount ?? 0;
}
