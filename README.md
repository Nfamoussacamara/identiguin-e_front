# 🎨 IdentiGuinée Frontend — Interface Utilisateur Haute-Fidélité

Ce dossier contient l'interface utilisateur de la plateforme **IdentiGuinée V2**, développée avec une approche **"Mobile-First"** et une esthétique **Premium**.

## 🚀 Technologies Utilisées
- **Framework :** [React.js](https://reactjs.org/) avec **TypeScript** pour une robustesse maximale.
- **Styling :** [Tailwind CSS](https://tailwindcss.com/) pour un design système cohérent et rapide.
- **Animations :** [Framer Motion](https://www.framer.com/motion/) pour les transitions fluides et les effets de verre (Glassmorphism).
- **Gestion d'État :** [React Query (TanStack)](https://tanstack.com/query/latest) pour la synchronisation parfaite avec le backend et le cache des données.
- **Icônes :** [Lucide React](https://lucide.dev/) pour un set d'icônes vectorielles épurées.
- **Notifications :** [Sonner](https://sonner.emilkowal.ski/) pour des toasts élégants et non-intrusifs.

## 🏗️ Architecture du Projet
```text
src/
├── api/             # Fonctions d'appels API (Axios) - Centralisation du Backend
├── components/      # Composants réutilisables (Boutons, Cards, Skeletons)
│   ├── layout/      # Navbar, Footer, Sidebar
│   ├── ui/          # Éléments atomiques (DashboardCard, MeshBackground)
│   └── sections/    # Sections de la Landing Page
├── hooks/           # Hooks personnalisés (useAppInit, useAdminWebSocket)
├── layouts/         # Layouts parents (DashboardLayout)
├── pages/           # Pages principales de l'application
│   ├── admin/       # Dashboard administratif et gestion
│   ├── dashboard/   # Espace personnel du citoyen
│   └── PublicVerify # Interface de vérification tierce (Police/Écoles)
└── utils/           # Fonctions utilitaires et constantes
```

## ✨ Fonctionnalités Majeures

### 1. Landing Page Interactive
Une vitrine technologique présentant les enjeux du projet (Blockchain, ODD) avec un design immersif et des animations au scroll.

### 2. Dashboard Citoyen (Self-Service)
- **Gestion du Profil :** Mise à jour des informations biométriques et photo.
- **Demandes de Documents :** Interface simplifiée pour commander une CNI ou un Passeport.
- **Suivi Blockchain :** Visualisation de l'état d'avancement avec preuve blockchain (TxHash).

### 3. Portail Admin (Surveillance Live)
- **Flux WebSocket :** Réception en temps réel des activités sur NaissanceChain via `FeedNaissanceChain`.
- **KPI Automatisés :** Suivi du taux d'automatisation et détection des tentatives de fraude.
- **Statistiques Régionales :** Visualisation géographique du déploiement national.

### 4. Vérification Publique (Scanner)
Interface ultra-propre permettant aux tiers (Police, Banques) de valider l'authenticité d'un document via sa référence, interrogeant le backend sans authentification.

## 🛠️ Lancement en Développement
```bash
npm install
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

---

## 🎨 Design Système
- **Couleurs :** Vert Guinéen (`#009A44`), Jaune (`#FCD116`), Rouge (`#CE1126`).
- **Typographie :** Utilisation de polices modernes pour une lisibilité optimale sur écrans HD.
- **Glassmorphism :** Utilisation massive de flous d'arrière-plan et de transparences pour un effet "Future-Ready".
