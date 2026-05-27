# GameZone Mobile

Application mobile React Native (Expo) pour GameZone SaaS.

## Installation

```bash
cd mobile
npm install
```

## Configuration

Modifier `src/constants/config.ts` :
- `API_BASE_URL` : URL du backend (ex: `http://192.168.1.100:3000` pour le dev local)
- `PAYMENT_CONFIG` : Clés API pour Wave, Orange Money, MTN MoMo

## Lancement

```bash
# Démarrer le serveur Expo
npx expo start

# Scanner le QR code avec l'app Expo Go sur votre téléphone
# Ou appuyer sur 'a' pour Android / 'i' pour iOS
```

## Structure

```
mobile/
├── App.tsx                    # Point d'entrée + Navigation
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx    # Connexion
│   │   ├── DashboardScreen.tsx # Tableau de bord
│   │   ├── StationsScreen.tsx  # Gestion des stations
│   │   ├── PaymentsScreen.tsx  # Historique paiements
│   │   └── SettingsScreen.tsx  # Paramètres + intégrations
│   ├── components/
│   │   ├── GradientBackground.tsx
│   │   ├── StatCard.tsx
│   │   └── StationCard.tsx
│   ├── services/
│   │   ├── api.ts             # Appels API backend
│   │   └── utils.ts           # Fonctions utilitaires
│   ├── constants/
│   │   ├── theme.ts           # Couleurs, tailles
│   │   └── config.ts          # Configuration API
│   ├── hooks/
│   │   └── useAuth.ts         # Context d'authentification
│   └── types/
│       └── index.ts           # Types TypeScript
```

## Intégration des APIs de Paiement

Les placeholders sont prêts dans `src/services/api.ts` :
- `initiateWavePayment()` - Wave API
- `initiateOrangeMoneyPayment()` - Orange Money API
- `initiateMTNMomoPayment()` - MTN MoMo API

Pour activer une intégration :
1. Obtenir les clés API du fournisseur
2. Mettre à jour `src/constants/config.ts`
3. Implémenter la logique dans `src/services/api.ts`

## Build pour Production

```bash
# Build APK Android
npx expo build:android

# Build iOS (nécessite un compte Apple Developer)
npx expo build:ios
```
