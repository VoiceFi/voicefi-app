"use client";

import { useMemo } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";
import { SOLANA_RPC_URL } from "@/lib/solana/constants";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

const DEVNET_WS_URL = SOLANA_RPC_URL.replace(/^http/, "ws");

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  const solanaConfig = useMemo(
    () => ({
      rpcs: {
        "solana:devnet": {
          rpc: createSolanaRpc(SOLANA_RPC_URL),
          rpcSubscriptions: createSolanaRpcSubscriptions(DEVNET_WS_URL),
          blockExplorerUrl: "https://explorer.solana.com",
        },
      },
    }),
    [],
  );

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#4A90D9",
        },
        loginMethods: ["email", "google"],
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        solana: solanaConfig,
      }}
    >
      {children}
    </PrivyProvider>
  );
}
