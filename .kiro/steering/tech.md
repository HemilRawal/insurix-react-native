# Tech Stack

## Core
- **React Native** 0.81.5 with **Expo** ~54.0.34
- **React** 19.1.0
- Entry point: `index.js` → `App.js`

## Navigation
- `@react-navigation/native` v7 — `NavigationContainer`
- `@react-navigation/native-stack` — stack navigator
- `@react-navigation/bottom-tabs` — bottom tab navigator

## Backend / Data
- **Firebase** v12 — `firebase/auth` (email/password), `firebase/firestore` (user data, plans)
- Config exported from `src/config/firebase.js` as `auth` and `db`

## UI & Styling
- `StyleSheet.create()` for all component styles — no CSS-in-JS libraries
- Design tokens in `src/config/theme.js`: `COLORS`, `FONTS`, `SPACING`, `RADIUS`
- `@expo/vector-icons` (Ionicons) for all icons
- `react-native-svg` for custom graphics (donut charts, etc.)
- `@react-native-community/slider` for range inputs

## Animation
- `react-native-reanimated` ~4.1.1 with `react-native-worklets`

## Storage
- `@react-native-async-storage/async-storage` for local persistence (e.g. login lockout state)

## Dev Tooling
- Babel with `babel-preset-expo`
- No test framework configured

## Common Commands
```bash
# Start dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```
