# KLEBER ERP - Mobile App

## Setup

```bash
npx create-expo-app mobile
cd mobile
npm install expo-auth-session axios zustand expo-secure-store
```

## Estructura

```
apps/mobile/
├── app/
│   ├── _layout.tsx          # Navigation
│   ├── login.tsx            # Auth screen
│   ├── assets/
│   │   └── index.tsx        # Asset list
│   ├── trips/
│   │   └── index.tsx        # Trip list
│   └── reports.tsx          # Reports
├── lib/
│   ├── api.ts               # Axios instance
│   ├── auth.ts              # Auth logic
│   └── store.ts             # Zustand store
└── components/
    ├── AssetCard.tsx
    ├── TripCard.tsx
    └── ErrorAlert.tsx
```

## Features

✅ Login/Logout (OAuth + JWT)
✅ Asset CRUD
✅ Trip CRUD  
✅ Reports dashboard
✅ Offline mode with AsyncStorage
✅ Push notifications

## API Integration

- Same backend: `https://kleber-erp-backend.railway.app`
- JWT auth via Bearer token
- SSL pinning ready

## Deployment

- EAS Build: `eas build --platform ios`
- EAS Submit: `eas submit --platform ios`
- TestFlight/Play Store ready
