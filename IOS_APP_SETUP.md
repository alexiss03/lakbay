# iOS App Setup (Full Feature Parity)

This project now includes a Capacitor wrapper so the iOS app uses the same frontend and backend features as web, with aligned UI/UX.

## Prerequisites
- macOS with Xcode installed
- Node.js 20+
- Apple Developer account (for device/TestFlight distribution)

## 1) Install Capacitor CLI (once)

```bash
npm i -D @capacitor/cli @capacitor/core
```

## 2) Build web assets

```bash
npm run build
```

## 3) Create native iOS project (first time only)

```bash
npm run mobile:ios:add
```

## 4) Sync latest web build into iOS shell

```bash
npm run mobile:sync
```

## 5) Open in Xcode

```bash
npm run mobile:ios
```

## 6) Configure app in Xcode
- Set your Team and Bundle Identifier
- Set signing profile
- Build and run on simulator/device

## Environment variables
Set production variables in your backend host (Render/Fly):
- `DATABASE_URL`
- `SESSION_SECRET`
- `GOOGLE_MAPS_API_KEY` (for live map rendering)

If maps key is unavailable, the app now shows a designed fallback journey snapshot instead of a hard error state.
