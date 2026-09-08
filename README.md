# App Builder Platform 🚀

Une plateforme complète pour créer des applications web, mobiles et des sites web en utilisant l'IA générative.

## Fonctionnalités

### 💡 Création d'Applications
- **Création Web** - Applications web modernes
- **Création Mobile** - Applications mobiles
- **Création Site Web** - Sites web statiques et dynamiques
- **Création Personnalisée** - Autres types de projets

### 🤖 Intégration IA
- **ChatGPT** - Génération avec OpenAI GPT-4
- **Claude** - Génération avec Anthropic Claude
- **Gemini** - Génération avec Google Gemini
- **Autres Modèles** - Extensible pour d'autres IA

### 💳 Plans d'Abonnement

#### Plan Gratuit (Free)
- 5 crédits
- Réinitialisation 24 heures
- Éditeur de base
- Sans domaine personnalisé

#### Plan Pro
- 50 crédits/mois
- Domaine personnalisé
- Publier sur App Store
- Éditeur avancé
- $9.99/mois

#### Plan Business
- 500 crédits/mois
- Domaines illimités
- Support prioritaire
- Édition complète
- API accès
- $29.99/mois

### 💰 Méthodes de Paiement
- **USDT** (Tether) - Wallet: `TDeQVGUMvveHaY8amuVcXR1etWZ7en3y4M`
- **PayPal** - Paiement sécurisé
- **Carte Bancaire** - Via Stripe

### ✨ Fonctionnalités Premium
- Overlay de génération en direct avec barre de progression
- Éditeur avec prévisualisation en temps réel
- Génération en arrière-plan avec Socket.io
- Gestion des crédits avec réinitialisation automatique
- Suppression et édition d'applications
- Domaines personnalisés

## Installation

### Prérequis
- Node.js 14+
- MongoDB
- Clés API pour OpenAI, Claude, Gemini

### Installation

```bash
# Cloner le repository
git clone https://github.com/djoachim671-coder/app-builder-platform.git
cd app-builder-platform

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés API

# Démarrer le serveur
npm start

# Pour le développement
npm run dev
```

## Structure du Projet

```
app-builder-platform/
├── models/              # Modèles MongoDB
│   ├── User.js         # Schéma utilisateur
│   └── App.js          # Schéma application
├── routes/             # Endpoints API
│   ├── auth.js         # Authentification
│   ├── apps.js         # Gestion des apps
│   ├── payments.js     # Paiements
│   └── ai.js           # Génération IA
├── middleware/         # Middlewares
│   └── auth.js         # Vérification JWT
├── public/             # Frontend
│   ├── index.html      # Page principale
│   ├── styles.css      # Styles
│   └── main.js         # Logique frontend
├── server.js           # Serveur Express
├── package.json        # Dépendances
└── .env.example        # Variables d'environnement
```

## API Endpoints

### Authentification
```
POST /api/auth/register     # Inscription
POST /api/auth/login        # Connexion
```

### Applications
```
GET  /api/apps              # Lister les apps
POST /api/apps              # Créer une app
POST /api/apps/:id/generate # Générer une app
POST /api/apps/:id/publish  # Publier une app
```

### Paiements
```
POST /api/payments/checkout       # Checkout Stripe
POST /api/payments/usdt-payment   # Paiement USDT
POST /api/payments/paypal-payment # Paiement PayPal
GET  /api/payments/credits        # Obtenir crédits
POST /api/payments/reset-credits  # Réinitialiser crédits
```

### IA
```
POST /api/ai/generate      # Générer avec IA
```

## Configuration des Variables d'Environnement

```env
MONGODB_URI=mongodb://localhost:27017/app-builder
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:3000

# IA APIs
OPENAI_API_KEY=sk-...
CLAUDE_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...

# Paiements
STRIPE_SECRET_KEY=sk_test_...
USDT_WALLET=TDeQVGUMvveHaY8amuVcXR1etWZ7en3y4M

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password
```

## Accès Propriétaire

Pour accorder un accès propriétaire complet (toutes les fonctionnalités gratuites):

```bash
# Modifier directement dans la base de données
db.users.updateOne(
  { email: "owner@example.com" },
  { $set: { isOwner: true, plan: "business", credits: 999999 } }
)
```

Ou via l'API (endpoint à implémenter):

```bash
POST /api/admin/set-owner
Body: { userId: "...", isOwner: true }
```

## Améliorations Futures

- [ ] Éditeur visuel drag-and-drop
- [ ] Templates pré-construits
- [ ] Système de plugins
- [ ] Collaboration en temps réel
- [ ] Versioning des applications
- [ ] Analytics et statistiques
- [ ] Intégration avec plus de services cloud
- [ ] Support multi-langues

## Licence

MIT License - Voir LICENSE.md

## Support

Pour toute question ou problème:
- Email: support@appbuilder.com
- Discord: [Rejoindre le serveur](https://discord.gg/appbuilder)
- GitHub Issues: [Ouvrir une issue](https://github.com/djoachim671-coder/app-builder-platform/issues)

## Crédits

Créé avec ❤️ par djoachim671-coder

Partenaires:
- OpenAI
- Anthropic Claude
- Google Gemini
- Stripe
- Tether (USDT)
