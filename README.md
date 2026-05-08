# Proven

Voice-first money assistant. Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui patterns + lucide-react.

## Run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Integration points

Search the codebase for `TODO:` comments — wire-in spots for:

- **ElevenLabs Conversational Agents** (`@elevenlabs/react`) — see `components/voice/MicOrb.tsx` and `app/dashboard/page.tsx`.
- **Privy embedded Solana wallets** (`@privy-io/react-auth`) — see `app/onboarding/page.tsx`.
- **Solana web3.js + Jupiter v6 + Helius RPC** — transaction-confirm path in `components/voice/ConfirmationOverlay.tsx` + `app/dashboard/page.tsx`.

## Structure

```
app/
  layout.tsx                          root layout, fonts, globals.css
  page.tsx                            landing
  globals.css                         design tokens + keyframes
  onboarding/page.tsx                 two-step onboarding
  dashboard/
    layout.tsx                        sidebar + bottom nav shell
    page.tsx                          balance + voice + activity
    contacts/page.tsx
    voice-settings/page.tsx
    security/page.tsx
components/
  brand/                              BrandMark
  layout/                             Sidebar, BottomNav, Topbar
  ui/                                 shadcn-style primitives (Button, Input, Toggle, Slider, Dialog)
  voice/                              MicOrb, ConfirmationOverlay
lib/
  utils.ts                            cn() helper
  mock-data.ts                        transactions, contacts, voices, sessions
types/
  voice.ts                            VoiceState union
```
