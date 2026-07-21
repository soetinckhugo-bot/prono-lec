# Déployer Prono LEC en ligne (Vercel + Supabase)

Guide étape par étape pour déployer le site et le rendre accessible à tes potes.

---

## 1. Préparer le code côté Supabase/Vercel

Le projet est prêt. J'ai créé un fichier `prisma/schema.prisma.postgresql` qui contient la configuration PostgreSQL pour la production.

Tu vas juste devoir le renommer avant de déployer.

---

## 2. Mettre le code sur GitHub

### 2.1 Créer le repo

1. Va sur [github.com](https://github.com)
2. Clique sur le **+** en haut à droite → **New repository**
3. Nom du repo : `prono-lec` (ou ce que tu veux)
4. **Important** : coche **Public** et ne coche PAS "Add a README file"
5. Clique sur **Create repository**

### 2.2 Envoyer le code depuis ton PC

Ouvre ton terminal (Git Bash, PowerShell ou CMD) et exécute ces commandes une par une :

```bash
cd "C:\Users\soeti\Desktop\SCOUTGG\prono"
git init
git add .
git commit -m "Initial commit Prono LEC"
```

Retourne sur GitHub, tu dois voir une section **"…or push an existing repository from the command line"** avec deux lignes. Copie-les et colle-les dans ton terminal. Ça ressemble à :

```bash
git remote add origin https://github.com/TON_PSEUDO/prono-lec.git
git branch -M main
git push -u origin main
```

Si ça demande ton identifiant GitHub, entre-le.

---

## 3. Créer la base de données sur Supabase

1. Va sur [supabase.com](https://supabase.com) et connecte-toi
2. Clique sur **New project**
3. Choisis un nom, par exemple `prono-lec`
4. Choisis un mot de passe **fort** pour la base de données (note-le bien)
5. Clique sur **Create new project**
6. Attends que le projet soit créé (environ 1-2 minutes)

### Récupérer l'URL de connexion

1. Dans le menu de gauche, clique sur **Project Settings** (icône engrenage)
2. Clique sur **Database**
3. Tu vois une section **Connection string**
4. Choisis le mode **URI**
5. Copie la ligne qui ressemble à :
   ```
   postgresql://postgres.[reference]:[password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```
6. Remplace `[password]` par le mot de passe que tu as choisi

Garde cette URL précieusement, tu vas en avoir besoin.

---

## 4. Préparer le projet pour PostgreSQL

Dans ton dossier `prono`, il y a deux fichiers de schéma Prisma :
- `prisma/schema.prisma` → utilisé en local avec SQLite
- `prisma/schema.prisma.postgresql` → à utiliser pour le déploiement

Tu dois échanger les deux. Dans ton terminal :

```bash
cd "C:\Users\soeti\Desktop\SCOUTGG\prono"
move prisma\schema.prisma prisma\schema.prisma.sqlite
move prisma\schema.prisma.postgresql prisma\schema.prisma
```

Puis crée un fichier `.env` à la racine du dossier `prono` avec ce contenu :

```env
DATABASE_URL="postgresql://postgres.TON_REF:TON_MDP@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="une_tres_tres_longue_cle_aleatoire_ici_min_32_caracteres"
NEXTAUTH_URL="http://localhost:3000"
```

Remplace `DATABASE_URL` par l'URL Supabase que tu as copiée.

Pour `NEXTAUTH_SECRET`, ouvre un générateur de mot de passe en ligne ou copie-colle une chaîne très longue et aléatoire.

### Appliquer le schéma à la base Supabase

Toujours dans ton terminal :

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Si tout se passe bien, tu vois :
- `Compte admin mis à jour` (ou `Compte admin créé`)

Ça signifie que la base de données en ligne est prête avec le compte admin.

---

## 5. Déployer sur Vercel

1. Va sur [vercel.com](https://vercel.com) et connecte-toi
2. Clique sur **Add New Project**
3. Dans la liste, clique sur **Import** à côté de ton repo `prono-lec`
4. Configure comme ceci :
   - **Framework Preset** : `Next.js`
   - **Root Directory** : laisse vide (ton repo contient directement les fichiers du projet)
   - **Build Command** : `npx prisma generate && npm run build` (déjà configuré dans `vercel.json`)
5. Clique sur **Deploy**

### Ajouter les variables d'environnement

1. Pendant le déploiement, ou après, va dans l'onglet **Settings** de ton projet Vercel
2. Clique sur **Environment Variables**
3. Ajoute ces 3 variables :

| Name | Value |
|------|-------|
| `DATABASE_URL` | L'URL Supabase complète |
| `NEXTAUTH_SECRET` | La même clé très longue que dans ton `.env` |
| `NEXTAUTH_URL` | L'URL de ton site Vercel (ex: `https://prono-lec.vercel.app`) |

Pour `NEXTAUTH_URL`, si tu ne la connais pas encore, mets n'importe quoi pour l'instant (`https://prono-lec.vercel.app`), tu la corrigeras après le premier déploiement.

4. Clique sur **Save**
5. Redéploie : va dans l'onglet **Deployments**, clique sur les **...** de la dernière version, puis **Redeploy**

---

## 6. Récupérer l'URL du site

1. Quand le déploiement est fini, Vercel affiche une URL du type :
   ```
   https://prono-lec-xyz123.vercel.app
   ```
2. Copie cette URL
3. Mets-la à jour dans les variables d'environnement Vercel pour `NEXTAUTH_URL`
4. Redéploie encore une fois pour être sûr

---

## 7. Tester le site en ligne

Ouvre l'URL Vercel dans ton navigateur.

Connecte-toi avec :
- **Pseudo** : `admin`
- **Mot de passe** : `admin123`

Tu peux maintenant :
- Ajouter des matchs dans `/admin`
- Gérer les utilisateurs dans `/admin/users`

---

## 8. Partager à tes potes

Envoie-leur simplement l'URL Vercel. Ils peuvent s'inscrire et faire leurs pronos directement.

---

## Si tu veux revenir en arrière (dev local)

Si tu veux relancer le site en local avec SQLite, remets le schéma SQLite :

```bash
cd "C:\Users\soeti\Desktop\SCOUTGG\prono"
move prisma\schema.prisma prisma\schema.prisma.postgresql
move prisma\schema.prisma.sqlite prisma\schema.prisma
npx prisma generate
npm run dev
```

---

## Besoin d'aide ?

Si tu bloques à une étape, dis-moi exactement où tu es et quel message d'erreur tu vois. Je te guide pas à pas.
