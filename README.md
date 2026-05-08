# VoiceFi

A voice-first money assistant built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Privy authentication, and Solana.

## Requirements

- Node.js 18+
- npm

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env.local` file at the project root with the following variable:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

To obtain your App ID:

1. Go to [dashboard.privy.io](https://dashboard.privy.io)
2. Create a new app or select an existing one
3. Copy the **App ID** from the Settings page

---

## Google OAuth Configuration

> **Note:** Email login works out of the box with only the App ID, but **Google authentication requires additional setup** on both the Privy Dashboard and the Google Cloud Console.

### Authentication Flow Overview

```
Your App (Next.js)
       |
       | 1. Calls Privy login()
       v
   Privy (Server)
       |
       | 2. Redirects to Google
       v
 Google OAuth
       |
       | 3. User authorizes
       v
   Privy (Callback)
       |
       | 4. Returns session to app
       v
User Authenticated ✅
```

### Step 1: Enable Google in the Privy Dashboard

1. Navigate to [dashboard.privy.io](https://dashboard.privy.io) and select your application.
2. In the left sidebar, go to **Login Methods** (or *Authentication*).
3. Locate **Google** in the providers list and **enable the toggle**.
4. Once enabled, Privy will display fields for **Client ID** and **Client Secret**. You will obtain these credentials in Step 3.

> **Note:** If you skip Steps 2–4, your app will throw the runtime error:  
> `Login with Google not allowed`.

### Step 2: Create a Project in Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Create a new project (e.g., `voicefi-oauth`) or select an existing one.
3. Ensure the correct project is selected in the project selector dropdown (top bar).

### Step 3: Configure the OAuth Consent Screen

1. Within your project, navigate to **APIs & Services > OAuth consent screen**.
2. Select the user type:
   - **External**: allows any Google account to authenticate (requires publication review for production).
   - **Internal**: restricted to users within your Google Workspace organization.
3. Fill in the required fields:
   - **App name**: `VoiceFi`
   - **User support email**: your email address
   - **Developer contact information**: your email address
4. In the **Scopes** section, you do not need to add anything manually for Privy. Google automatically handles the following scopes:
   - `openid`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
5. In **Test users** (if using *External* mode), add your email address to allow testing before the app is published.
6. Save and continue.

### Step 4: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services > Credentials**.
2. Click **+ CREATE CREDENTIALS > OAuth client ID**.
3. For **Application type**, select **Web application**.
4. Complete the following fields:

#### Authorized JavaScript Origins

Add the domains from which your app will run:

```
http://localhost:3000          ← local development
https://your-domain.com        ← production (e.g., Vercel)
```

#### Authorized Redirect URIs ⚠️ Critical Field

Add the Privy callback URL **exactly** as follows:

```
https://auth.privy.io/oauth/callback
```

> **Common Mistake:** This URL belongs in **Authorized redirect URIs**, not in scopes or JavaScript origins. If placed incorrectly, Google returns:  
> `Error 400: invalid_scope`

5. Click **Create**.
6. Copy the **Client ID** and **Client Secret** immediately from the modal dialog.

### Step 5: Link Credentials to Privy

1. Return to the [Privy Dashboard](https://dashboard.privy.io).
2. Go to **Login Methods > Google**.
3. Paste the **Client ID** and **Client Secret** obtained in the previous step.
4. Save the changes. A confirmation indicator should appear, showing that Google is correctly configured.

### Step 6: Verify Environment Variables

Ensure your `.env.local` contains the correct App ID:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

> **Tip:** Restart the development server (`npm run dev`) after any changes to environment variables, as `NEXT_PUBLIC_*` variables are evaluated at build time.

### Step 7: Verify Code Integration

In your `PrivyProviderWrapper` component, confirm that `google` is included in the `loginMethods` array:

```tsx
<PrivyProvider
  appId={PRIVY_APP_ID}
  config={{
    loginMethods: ["email", "google"],
    embeddedWallets: {
      solana: {
        createOnLogin: "users-without-wallets",
      },
    },
  }}
>
```

### Common Errors & Troubleshooting

| Error | Cause | Solution |
|---|---|---|
| `Login with Google not allowed` | Google is not enabled in the Privy Dashboard. | Enable the Google toggle in *Login Methods* and complete the OAuth configuration. |
| `Error 400: invalid_scope` | The Privy callback URL was mistakenly added to the **Scopes** field instead of **Authorized redirect URIs** in Google Cloud. | Go to *Credentials > OAuth client ID* and ensure `https://auth.privy.io/oauth/callback` is placed in the correct field. |
| `redirect_uri_mismatch` | The callback URL does not match between Privy and Google Cloud, or the `https://` protocol is missing. | Verify that *Authorized redirect URIs* contains exactly `https://auth.privy.io/oauth/callback`. |
| App does not detect the App ID | The Next.js server has not reloaded the `.env.local` file. | Restart `npm run dev`. `NEXT_PUBLIC_*` variables are only read at build time. |

---

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # run ESLint
```

## Key Dependencies

| Package | Purpose |
|---|---|
| `next` 15 | Core framework (App Router) |
| `@privy-io/react-auth` | Authentication (email, Google, wallets) |
| `tailwindcss` v4 | Styling |
| `@radix-ui/*` | Accessible UI primitives |
| `lucide-react` | Icons |
| `@solana-program/memo` | Solana integration (in progress) |

## Project Structure

```
app/
  page.tsx                    landing page
  onboarding/page.tsx         Privy login flow
  dashboard/
    page.tsx                  balance + voice + activity
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
  mock-data.ts                test data (transactions, contacts, voices)
types/
  voice.ts                    VoiceState
```

## Pending Integrations

Search for `TODO:` throughout the codebase for planned integration points:

- **ElevenLabs** — `components/voice/mic-orb.tsx`, `app/dashboard/page.tsx`
- **Solana web3.js + Jupiter v6 + Helius RPC** — `components/voice/confirmation-overlay.tsx`
