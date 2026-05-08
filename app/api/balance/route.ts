import { NextRequest, NextResponse } from "next/server";
import { getSolBalance, getUsdcBalance } from "@/lib/solana/balance";

async function getSolPriceUsd(): Promise<number> {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
    { next: { revalidate: 60 } }
  );
  const data = await res.json();
  return data?.solana?.usd ?? 0;
}

export async function GET(req: NextRequest) {
  const walletAddress = req.nextUrl.searchParams.get("walletAddress");

  if (!walletAddress) {
    return NextResponse.json({ error: "walletAddress required" }, { status: 400 });
  }

  try {
    const [sol, usdc, solPrice] = await Promise.all([
      getSolBalance(walletAddress),
      getUsdcBalance(walletAddress),
      getSolPriceUsd().catch(() => 0),
    ]);

    const totalUsd = sol * solPrice + usdc;

    return NextResponse.json({ sol, usdc, totalUsd });
  } catch (err) {
    console.error("[balance] fetch error:", err);
    return NextResponse.json({ sol: 0, usdc: 0, totalUsd: 0 });
  }
}
