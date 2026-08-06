# 🛍️ YannShop - E-commerce Camerounais

![YannShop Logo](/public/logo.webp)

**YannShop** est une plateforme e-commerce moderne, rapide et sécurisée, conçue spécialement pour le marché camerounais (Yaoundé & Douala).  
Elle permet aux clients de commander des produits en ligne avec une interface fluide, et aux administrateurs de gérer l'intégralité de la boutique via un tableau de bord puissant.

---

## 🚀 Technologies utilisées

### Backend
- **Laravel 13** (PHP 8.3+)
- **MySQL / SQLite** (Base de données)
- **Inertia.js** (Pont entre Laravel et React)
- **Infobip API** (Notifications WhatsApp pour l'admin et les livreurs)

### Frontend
- **React 19** (TypeScript)
- **Tailwind CSS v4** (Design système)
- **FontAwesome** (Icônes)
- **Vite** (Build et développement)

---

## ✨ Fonctionnalités principales

### Côté Public (Clients)
- 🏠 Page d'accueil avec produits populaires et promotions
- 🛒 Catalogue de produits avec filtre par catégorie
- 📦 Page détail produit (Carrousel d'images, vidéos, prix)
- 🛍️ Panier flottant (géré en LocalStorage)
- 📝 Checkout avec formulaire de livraison en pavé (Ville, Quartier, Repère)
- 📋 Historique des commandes (recherche par numéro de téléphone)
- ✏️ Modification d'adresse et annulation de commande (si modifiable)
- 📞 Page de contact avec formulaire et liens WhatsApp dynamiques

### Côté Admin (Tableau de bord)
- 📊 Dashboard avec statistiques (Commandes, Produits, Visites, Messages)
- 📦 Gestion des commandes (Assignation de livreur, changement de statut)
- 🏷️ Gestion des catégories (CRUD complet)
- 📦 Gestion des produits (CRUD avec upload d'images/vidéos)
- 🚚 Gestion des livreurs (CRUD complet)
- 💬 Gestion des messages clients (Lecture, WhatsApp, suppression)
- 🔐 Authentification sécurisée avec rate limiting (5 tentatives en 2 min)
- 👤 Profil Admin (Modification du nom, email et mot de passe)

### Notifications & Livraison
- 📲 Notification WhatsApp à l'Admin pour chaque nouvelle commande
- 📲 Notification WhatsApp à l'Admin pour chaque modification/annulation client
- 🚚 Génération automatique de lien WhatsApp pré-rempli pour le livreur

---

## 📦 Installation et configuration

### Prérequis
- PHP 8.3+
- Composer
- Node.js 20+
- NPM ou Yarn

### Étapes

1. **Cloner le dépôt**
```bash
git clone https://github.com/ton-repo/yannshop.git
cd yannshop
