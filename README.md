# VoiceFi

Voice-first money assistant. Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Privy auth + Solana.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con lo siguiente:

```env
NEXT_PUBLIC_PRIVY_APP_ID=tu_app_id_de_privy
```

Para obtener tu App ID:
1. Ve a [dashboard.privy.io](https://dashboard.privy.io)
2. Crea una app o entra a la tuya
3. Copia el **App ID** desde Settings

## Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Otros comandos

```bash
npm run build   # build de producción
npm run start   # corre el build de producción
npm run lint    # lint
```

## Dependencias principales

| Paquete | Uso |
|---|---|
| `next` 15 | Framework principal (App Router) |
| `@privy-io/react-auth` | Autenticación (email, Google, wallets) |
| `tailwindcss` v4 | Estilos |
| `@radix-ui/*` | Componentes UI accesibles |
| `lucide-react` | Iconos |
| `@solana-program/memo` | Integración Solana (en progreso) |

## Estructura

```
app/
  page.tsx                    landing
  onboarding/page.tsx         flujo de login con Privy
  dashboard/
    page.tsx                  balance + voz + actividad
    contacts/page.tsx
    voice-settings/page.tsx
    security/page.tsx
components/
  providers/                  ClientPrivyProvider, PrivyProviderWrapper
  layout/                     Sidebar, BottomNav, Topbar
  ui/                         Button, Input, Card, Dialog, Slider, Switch
  voice/                      MicOrb, ConfirmationOverlay
lib/
  utils.ts                    helper cn()
  mock-data.ts                datos de prueba (transacciones, contactos, voces)
types/
  voice.ts                    VoiceState
```

## Integraciones pendientes

Busca `TODO:` en el código para ver los puntos de conexión:

- **ElevenLabs** — `components/voice/mic-orb.tsx` y `app/dashboard/page.tsx`
- **Solana web3.js + Jupiter v6 + Helius RPC** — `components/voice/confirmation-overlay.tsx`
