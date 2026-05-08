"use client";

import dynamic from "next/dynamic";

// PrivyProvider must only run on the client — ssr: false prevents the server-side
// rendering of components that depend on browser APIs (e.g., localStorage, window).
const PrivyProviderWrapper = dynamic(
  () => import("./PrivyProviderWrapper").then((m) => ({ default: m.PrivyProviderWrapper })),
  { ssr: false }
);

export function ClientPrivyProvider({ children }: { children: React.ReactNode }) {
  return <PrivyProviderWrapper>{children}</PrivyProviderWrapper>;
}
