# Project Structure

```
insurix-rn/
├── index.js                  # App entry point (registers root component)
├── App.js                    # Root component (StatusBar + AppNavigator)
├── app.json                  # Expo config
├── babel.config.js
├── assets/                   # Static images and icons
└── src/
    ├── components/           # Reusable UI components
    │   ├── ChatWindow.js     # Slide-up chat UI panel
    │   └── FloatingChatIcon.js  # FAB chat trigger with unread badge
    ├── config/
    │   ├── firebase.js       # Firebase init; exports `auth` and `db`
    │   └── theme.js          # Design tokens: COLORS, FONTS, SPACING, RADIUS
    ├── context/
    │   └── ChatContext.js    # Global chat state (messages, open/close, bot triggers)
    ├── navigation/
    │   └── AppNavigator.js   # All navigators + chatbot overlay logic
    ├── screens/
    │   ├── SplashScreen.js
    │   ├── LoginScreen.js
    │   ├── SignupScreen.js
    │   ├── ProfileSetupScreen.js
    │   ├── HealthDetailsScreen.js
    │   ├── RiskResultsScreen.js
    │   ├── DashboardScreen.js
    │   ├── PlansScreen.js
    │   ├── ComparePlansScreen.js
    │   └── ProfileScreen.js
    └── utils/
        ├── riskCalculator.js       # Weighted risk score (0–100) from health profile
        ├── recommendationEngine.js # Filters + ranks plans by user profile
        └── seedFirestore.js        # Dev utility to seed Firestore with plan data
```

## Conventions

- **Screens** are default exports, named after the screen (e.g. `export default function DashboardScreen`).
- **Styles** live at the bottom of each file in a `StyleSheet.create()` call, typically named `styles` or `s`.
- **Theme tokens** (`COLORS`, `RADIUS`, etc.) are always imported from `src/config/theme.js` — no hardcoded color values.
- **Navigation** uses `navigation.replace()` for auth transitions and `navigation.navigate()` for normal flow.
- **Firebase reads** use `getDoc` / `doc` from `firebase/firestore`; `auth.currentUser?.uid` guards all user-specific queries.
- **Context** is the only global state mechanism — no Redux or Zustand.
- The chatbot overlay (`FloatingChatIcon` + `ChatWindow`) is rendered inside `AppNavigator` and hidden on auth/onboarding screens via a `hiddenRoutes` list.
