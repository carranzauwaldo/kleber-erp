# OAuth Setup Guide

## Google OAuth

### 1. Create Project in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: "KLEBER ERP"
3. Enable OAuth 2.0

### 2. Create OAuth 2.0 Credentials

1. Go to: Credentials → Create Credentials → OAuth client ID
2. Application type: Web application
3. Authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://kleber-erp-frontend.vercel.app`
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://kleber-erp-frontend.vercel.app/api/auth/callback/google`

### 3. Copy Credentials

- Copy `Client ID` → `GOOGLE_ID`
- Copy `Client Secret` → `GOOGLE_SECRET`

### 4. Add to Environment

```env
GOOGLE_ID=your_client_id.apps.googleusercontent.com
GOOGLE_SECRET=your_client_secret
```

### 5. Update auth.ts

```typescript
import GoogleProvider from 'next-auth/providers/google';

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
  }),
  // ... other providers
]
```

---

## GitHub OAuth

### 1. Create OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Application name: KLEBER ERP
4. Homepage URL: `https://kleber-erp-frontend.vercel.app`
5. Authorization callback URL:
   - `http://localhost:3000/api/auth/callback/github`
   - `https://kleber-erp-frontend.vercel.app/api/auth/callback/github`

### 2. Copy Credentials

- Copy `Client ID` → `GITHUB_ID`
- Copy `Client Secret` → `GITHUB_SECRET`

### 3. Add to Environment

```env
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_secret
```

### 4. Update auth.ts

```typescript
import GitHubProvider from 'next-auth/providers/github';

providers: [
  GitHubProvider({
    clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
  }),
  // ... other providers
]
```

---

## Vercel Environment Variables

1. Go to Vercel Project Settings
2. Environment Variables
3. Add:
   - `GOOGLE_ID`
   - `GOOGLE_SECRET`
   - `GITHUB_ID`
   - `GITHUB_SECRET`
   - `NEXTAUTH_SECRET` (keep existing)
   - `NEXTAUTH_URL=https://kleber-erp-frontend.vercel.app`

---

## Testing Locally

1. Add .env.local:
```env
GOOGLE_ID=...
GOOGLE_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...
NEXTAUTH_SECRET=dev-secret-key
NEXTAUTH_URL=http://localhost:3000
```

2. Restart dev server
3. Click "Login with Google" or "Login with GitHub"

---

## Database Migration

Users created via OAuth have:
- email ✅
- name ✅  
- image (profile picture)
- role: VIEWER (default)
- password: null (OAuth users)

```prisma
model User {
  // ... existing fields
  image        String?  // OAuth profile picture
}
```

Then run:
```bash
npx prisma migrate dev --name add_oauth_image
```

---

## Security Notes

- Store secrets in environment variables only
- Never commit `.env.local`
- Use different credentials for dev/prod
- Regenerate secrets periodically
- GitHub: Set expiration for tokens

---

## Troubleshooting

**"Invalid redirect_uri"**
- Check callback URLs match exactly (including protocol/domain)

**"Client authentication failed"**
- Verify GOOGLE_ID/GOOGLE_SECRET or GITHUB_ID/GITHUB_SECRET

**"User already exists"**
- OAuth auto-creates users on first login
- Can link accounts via UI (future feature)

---

## Implementation Timeline

- Phase 1: Google OAuth ✅ (documented)
- Phase 2: GitHub OAuth ✅ (documented)
- Phase 3: Account linking
- Phase 4: Microsoft OAuth (enterprise)
