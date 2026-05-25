# GameZone SaaS

SaaS moderne de gestion de salles de jeux video et cyber cafes, specialement concu pour le marche africain (Abidjan, Cote d'Ivoire).

![Dashboard](https://img.shields.io/badge/Stack-Next.js_16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/ORM-Prisma_5-2D3748?style=flat-square&logo=prisma)
![Tailwind](https://img.shields.io/badge/CSS-Tailwind_4-38B2AC?style=flat-square&logo=tailwindcss)

## Fonctionnalites

- **Gestion des stations** : PS4, PS5, Xbox, PC Gamer avec statuts en temps reel
- **Sessions de jeu** : Demarrer, Pause, Reprendre, Arreter avec chronometre automatique
- **Paiements** : Especes, Wave, Orange Money, MTN Money avec historique complet
- **Dashboard analytics** : Revenus, statistiques, graphiques, machines populaires
- **Gestion employes** : Comptes, permissions, historique d'actions
- **Notifications** : Fin de session, alertes, machine inactive
- **UI Gaming** : Design futuriste sombre avec neons bleu/violet, inspire PlayStation/Netflix

## Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 + Framer Motion |
| Backend | Next.js API Routes |
| Base de donnees | SQLite (dev) / PostgreSQL (prod) |
| ORM | Prisma 5 |
| Auth | NextAuth.js 4 |
| Charts | Recharts |
| Icons | Lucide React |

## Installation

```bash
# Cloner le repo
git clone <repo-url>
cd gamezone-saas

# Installer les dependances
npm install

# Configurer l'environnement
cp .env.example .env

# Initialiser la base de donnees
npx prisma migrate dev

# Ajouter les donnees de demo
npm run db:seed

# Lancer le serveur de developpement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Comptes de demo

| Role | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@gamezone.ci | admin123 |
| Employe | moussa@gamezone.ci | employee123 |
| Employe | awa@gamezone.ci | employee123 |

## Structure du projet

```
gamezone-saas/
├── prisma/
│   ├── schema.prisma      # Schema de la base de donnees
│   ├── seed.ts             # Donnees de demo
│   └── migrations/         # Migrations SQL
├── src/
│   ├── app/
│   │   ├── (auth)/login/   # Page de connexion
│   │   ├── (dashboard)/    # Pages du dashboard
│   │   │   ├── dashboard/  # Vue d'ensemble
│   │   │   ├── stations/   # Gestion des postes
│   │   │   ├── sessions/   # Historique sessions
│   │   │   ├── payments/   # Paiements
│   │   │   ├── employees/  # Employes
│   │   │   └── settings/   # Parametres
│   │   └── api/            # Routes API
│   ├── components/
│   │   ├── ui/             # Composants reutilisables
│   │   └── layout/         # Sidebar, header
│   ├── hooks/              # Custom hooks (useApi)
│   ├── lib/                # Utilitaires, Prisma, Auth
│   └── types/              # Types TypeScript
├── ARCHITECTURE.md          # Documentation technique
└── package.json
```

## Scripts

```bash
npm run dev          # Serveur de developpement
npm run build        # Build production
npm run lint         # Verification ESLint
npm run db:migrate   # Lancer les migrations
npm run db:seed      # Ajouter les donnees de demo
npm run db:reset     # Reset complet de la base
```

## Deploiement

### Vercel (recommande)

1. Connecter le repo a Vercel
2. Configurer les variables d'environnement :
   - `DATABASE_URL` : URL PostgreSQL (Neon, Supabase, etc.)
   - `NEXTAUTH_SECRET` : Cle secrete pour JWT
   - `NEXTAUTH_URL` : URL de l'application
3. Deployer

### Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de la base de donnees | `file:./dev.db` |
| `NEXTAUTH_SECRET` | Cle JWT | `votre-cle-secrete` |
| `NEXTAUTH_URL` | URL de l'app | `http://localhost:3000` |

## Licence

MIT
