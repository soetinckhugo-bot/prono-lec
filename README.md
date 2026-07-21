# Prono LEC

Application web de pronostics sur les matchs LEC. Les utilisateurs créent un compte sans email, parient sur le vainqueur et le score des matchs, et consultent un classement détaillé.

## Fonctionnalités

- Inscription / connexion simple (pseudo + mot de passe, pas d'email)
- Tout le monde peut créer un compte en 10 secondes
- Ajout de matchs par un compte admin (`admin`)
- Pronostics sur le vainqueur + score exact
- Formats supportés : BO1, BO3, BO5
- Système de points : 1 pt par bon vainqueur, +1 pt bonus score exact en BO1, +2 pts bonus score exact en BO3/BO5
- Classement avec points, bons pronos, pronos exacts et faux pronos
- Logos des équipes (fallback sur les initiales si pas de logo)
- **Bannissement d'utilisateurs** : l'admin peut bannir/débannir depuis `/admin/users`

## Stack

- Next.js 15 + React 19 + TypeScript
- NextAuth (credentials)
- Prisma + SQLite
- Tailwind CSS v4
- Lucide React

## Lancer en local

```bash
cd prono
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Compte admin

- **Pseudo** : `admin`
- **Mot de passe** : `admin123`

Connecte-toi avec ce compte pour accéder à :
- `/admin` : ajouter / gérer les matchs
- `/admin/users` : bannir ou débannir des utilisateurs

## Déploiement pour tes potes

Voir `DEPLOY.md` pour les étapes détaillées. La solution la plus simple est **Vercel + Supabase** (gratuit).

En résumé :
1. Push le projet sur GitHub
2. Crée une base PostgreSQL gratuite sur Supabase ou Neon
3. Importe le repo sur Vercel
4. Ajoute les variables d'environnement (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
5. Déploie

Tout le monde pourra alors créer un compte et faire ses pronos depuis n'importe où.

## Logos des équipes

Les 10 logos du LEC Summer 2026 sont déjà dans `public/teams/`. Si tu ajoutes une équipe, le nom du fichier doit correspondre au nom normalisé (minuscules, sans espaces ni accents).
