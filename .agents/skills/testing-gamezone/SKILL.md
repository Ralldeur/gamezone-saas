---
name: testing-gamezone
description: Test the GameZone SaaS app end-to-end. Use when verifying backend API, web dashboard, or mobile app changes.
---

# Testing GameZone SaaS

## Prerequisites

- Node.js 22+
- SQLite (dev database at `prisma/dev.db`)

## Backend Setup

```bash
cd /home/ubuntu/gamezone-saas
npm install
npx prisma generate
npx prisma db push
npx prisma db seed  # Seeds demo users and stations
npm run dev          # Starts on port 3000
```

If port 3000 is already in use:
```bash
fuser -k 3000/tcp
# Then retry npm run dev
```

Note: `lsof` may not be available — use `fuser` instead.

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gamezone.ci | admin123 |
| Employee | moussa@gamezone.ci | employee123 |

## Web Dashboard Testing

The web app runs at `http://localhost:3000`. Key pages:
- `/login` — Login page
- `/dashboard` — Stats overview
- `/stations` — Station management (start/pause/stop sessions)
- `/sessions` — Session history
- `/payments` — Payment history
- `/employees` — Employee management (admin only)

## Mobile App Testing

The mobile app is in `/mobile` and uses Expo (React Native).

### API-only testing (headless/CI)
Test the mobile-login JWT endpoint directly:
```bash
# Valid login
curl -s -X POST http://localhost:3000/api/auth/mobile-login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@gamezone.ci","password":"admin123"}'
# Expect: HTTP 200 with {token, user}

# Invalid credentials
curl -s -X POST http://localhost:3000/api/auth/mobile-login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@gamezone.ci","password":"wrong"}'
# Expect: HTTP 401 with {error: "Identifiants incorrects"}
```

### Known Limitation: Expo Web Mode
Expo web mode (`npx expo start --web`) requires `react-native-web` and `react-dom`, which may have peer dependency conflicts with newer React/React Native versions. If this happens, UI testing requires a physical device with Expo Go app.

### Known Limitation: JWT vs NextAuth
The mobile-login endpoint returns JWT tokens, but existing API routes (`/api/stations`, `/api/sessions`, etc.) use NextAuth session-based auth. JWT Bearer tokens are NOT accepted by these routes. Full mobile API integration will need middleware to accept both auth methods.

## Build & Lint Checks

```bash
# Lint (covers both web and mobile)
npm run lint

# Build (web app + API routes)
npm run build

# Mobile TypeScript check
cd mobile && npx tsc --noEmit
```

## Common Lint Issues

- `react-hooks/set-state-in-effect`: Don't call setState directly in useEffect body. Wrap in `setTimeout(fn, 0)` or `setInterval` callback.
- `react/no-unescaped-entities`: Use `{"text with apostrophe's"}` instead of bare text in JSX.
- Unused imports: Remove or add `// eslint-disable-next-line` with justification.

## Devin Secrets Needed

No secrets required for local development testing. The app uses SQLite with seeded demo data.
