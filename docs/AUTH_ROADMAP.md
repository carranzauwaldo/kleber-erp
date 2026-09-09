# Authentication Roadmap

## Phase 1: Current ✅
- [x] Email/password login
- [x] JWT tokens
- [x] Session management
- [x] RBAC (roles)
- [x] Password hashing

## Phase 2: 2FA (Next)

### Two-Factor Authentication
```
1. User logs in with email/password
2. Server generates TOTP secret
3. User scans QR code with authenticator app
4. User enters 6-digit code to verify
5. 2FA enabled in user profile
6. Future logins require TOTP
```

### Implementation
- Backend: speakeasy library for TOTP
- Frontend: qrcode library for QR display
- DB: add `twoFactorSecret` to User model
- Endpoint: POST /api/auth/2fa/setup, /api/auth/2fa/verify

## Phase 3: OAuth Providers

### Google OAuth
- Use next-auth GoogleProvider
- User: {email, name, image}
- Auto-create account on first login

### GitHub OAuth
- Use next-auth GithubProvider
- User: {email, name, image}
- Link to existing account

### Microsoft OAuth
- Use next-auth AzureADProvider
- Enterprise SSO support
- B2B scenarios

### Implementation
```typescript
// pages/api/auth/[...nextauth].ts
providers: [
  GoogleProvider({...}),
  GitHubProvider({...}),
  AzureADProvider({...}),
]
```

## Phase 4: Security Enhancements

- [ ] Rate limiting on login (5 attempts/min)
- [ ] Account lockout after N failed attempts
- [ ] Session revocation
- [ ] Device fingerprinting
- [ ] IP whitelist (optional)

## Timeline

- 2FA: 1-2 days
- OAuth: 1-2 days  
- Security: 1 day
- Testing: 1 day

Total: 1 week for full auth suite
