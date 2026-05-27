# GameZone SaaS - Architecture Document

## Vue d'ensemble

GameZone est un SaaS de gestion de salles de jeux vidéo/cyber cafés, spécialement conçu pour le marché africain (Abidjan, Côte d'Ivoire). Le système fonctionne avec un dashboard web admin et un backend cloud.

---

## Stack Technique

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| Frontend Web | Next.js 14 (App Router) | SSR, performance, DX moderne |
| Styling | Tailwind CSS + Framer Motion | Design rapide, animations fluides |
| Backend | Next.js API Routes | Intégré, simple, scalable |
| Base de données | SQLite (dev) / PostgreSQL (prod) | Prisma ORM pour abstraction |
| ORM | Prisma | Type-safe, migrations auto |
| Auth | NextAuth.js | Multi-provider, sécurisé |
| Charts | Recharts | Léger, responsive |
| Icons | Lucide React | Moderne, léger |
| Temps réel | Polling + Server Actions | Simple, fiable |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              Client (Browser)                │
│  ┌─────────────────────────────────────────┐ │
│  │     Next.js Frontend (React)            │ │
│  │  - Dashboard Admin                      │ │
│  │  - Gestion Sessions                     │ │
│  │  - Gestion Stations                     │ │
│  │  - Paiements                            │ │
│  │  - Statistiques                         │ │
│  └──────────────┬──────────────────────────┘ │
└─────────────────┼───────────────────────────┘
                  │ HTTP/API
┌─────────────────┼───────────────────────────┐
│  Next.js API Routes (Backend)               │
│  ┌──────────────┴──────────────────────────┐ │
│  │  - Auth (NextAuth.js)                   │ │
│  │  - REST API Endpoints                   │ │
│  │  - Business Logic                       │ │
│  │  - Validation                           │ │
│  └──────────────┬──────────────────────────┘ │
└─────────────────┼───────────────────────────┘
                  │ Prisma ORM
┌─────────────────┼───────────────────────────┐
│  Database (PostgreSQL)                       │
│  - Users, Rooms, Stations                    │
│  - Sessions, Payments                        │
│  - Activity Logs                             │
└─────────────────────────────────────────────┘
```

---

## Schéma Base de Données

### User
- id, email, name, password, role (ADMIN/EMPLOYEE), avatar
- roomId (salle assignée)

### GameRoom
- id, name, address, phone, ownerId
- hourlyRate (tarif horaire par défaut)

### Station
- id, name, type (PS4/PS5/XBOX/PC), status (FREE/OCCUPIED/OUT_OF_SERVICE)
- roomId, hourlyRate (tarif spécifique optionnel)

### GameSession
- id, stationId, startedById (employé)
- startTime, endTime, pausedAt, totalPausedDuration
- status (ACTIVE/PAUSED/COMPLETED/CANCELLED)
- customerName (optionnel)

### Payment
- id, sessionId, amount, method (CASH/WAVE/ORANGE_MONEY/MTN_MONEY)
- createdById

### ActivityLog
- id, userId, action, description, metadata

### Notification
- id, roomId, type, title, message, read

---

## Pages de l'Application

1. `/login` - Connexion
2. `/dashboard` - Vue d'ensemble (stats, revenus, activité)
3. `/stations` - Gestion des postes (grille visuelle)
4. `/sessions` - Sessions actives et historique
5. `/payments` - Historique des paiements
6. `/employees` - Gestion des employés
7. `/settings` - Paramètres de la salle

---

## API Endpoints

### Auth
- `POST /api/auth/signin` - Connexion
- `POST /api/auth/signout` - Déconnexion

### Stations
- `GET /api/stations` - Liste des stations
- `POST /api/stations` - Créer une station
- `PATCH /api/stations/[id]` - Modifier une station
- `DELETE /api/stations/[id]` - Supprimer une station

### Sessions
- `GET /api/sessions` - Liste des sessions
- `POST /api/sessions` - Démarrer une session
- `PATCH /api/sessions/[id]/pause` - Pause
- `PATCH /api/sessions/[id]/resume` - Reprendre
- `PATCH /api/sessions/[id]/stop` - Arrêter

### Payments
- `GET /api/payments` - Liste des paiements
- `POST /api/payments` - Enregistrer un paiement

### Dashboard
- `GET /api/dashboard/stats` - Statistiques

### Employees
- `GET /api/employees` - Liste
- `POST /api/employees` - Créer
- `PATCH /api/employees/[id]` - Modifier
- `DELETE /api/employees/[id]` - Supprimer

---

## Sécurité

- Authentification JWT via NextAuth.js
- Hashing bcrypt pour les mots de passe
- Middleware de protection des routes
- Validation des entrées (Zod)
- CORS configuré
- Rate limiting sur les API
- Rôles et permissions (ADMIN vs EMPLOYEE)

---

## Estimation Coûts Serveur (MVP)

| Service | Coût mensuel |
|---------|-------------|
| Vercel (hosting) | Gratuit (hobby) / $20 (pro) |
| Supabase/Neon PostgreSQL | Gratuit (500MB) |
| Domain | ~$10/an |
| **Total MVP** | **$0-20/mois** |

---

## Plan de Rentabilité

### Modèle Freemium
- **Gratuit** : 1 salle, 5 stations, fonctionnalités de base
- **Pro ($15/mois)** : Illimité, analytics avancés, multi-salle
- **Enterprise ($50/mois)** : API, intégrations, support prioritaire

### Fonctionnalités Premium Futures
- Application mobile native (React Native)
- Intégration paiements mobile money réelle
- Système de fidélité clients
- Réservation en ligne
- Gestion de tournois
- Comptabilité et export fiscal
- Multi-langue
- Mode hors-ligne
- Intégration WhatsApp pour notifications

---

## Roadmap

### Phase 1 - MVP (Semaines 1-2)
- Dashboard admin
- Gestion stations
- Sessions avec timer
- Paiements basiques
- Auth simple

### Phase 2 - Amélioration (Semaines 3-4)
- App mobile (Expo/React Native)
- Notifications push
- Analytics avancés
- Multi-salle

### Phase 3 - Monétisation (Mois 2-3)
- Système d'abonnement
- Intégration paiements réels
- Onboarding automatisé
- Marketing et landing page
