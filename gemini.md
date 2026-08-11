# IziFacture - Project Overview & AI Assistant Guide

Ce document sert de point de référence pour comprendre le projet **IziFacture**. Il est destiné à tout développeur ou modèle d'intelligence artificielle (comme Gemini) qui reprendrait le projet à l'avenir, afin de lui donner tout le contexte nécessaire en un coup d'œil.

---

## 1. Description du projet

**IziFacture** est une application web SaaS (Software as a Service) moderne conçue pour simplifier la création, la gestion et le suivi des factures pour les freelances et les petites entreprises. Elle met l'accent sur une expérience utilisateur fluide, un design premium (micro-animations, mode sombre) et la génération rapide de documents professionnels.

## 2. Fonctionnalités Implémentées

- **Tableau de Bord (Dashboard) :** Vue d'ensemble avec statistiques clés (Revenu total, factures en attente, clients) et graphiques d'évolution (via `recharts`).
- **Gestion des Factures :**
  - Liste des factures avec filtrage et statuts (Brouillon, Envoyée, Payée, En retard).
  - Création de factures avec prévisualisation en temps réel (mode éditeur & mode papier).
  - Gestion des statuts et restrictions (ex: interdiction d'imprimer ou d'envoyer un brouillon).
  - Téléchargement / Impression au format PDF via l'interface native.
- **Gestion des Clients :**
  - CRUD complet : Ajout, modification, suppression et visualisation détaillée des profils clients.
- **Paramètres (Settings) :**
  - Configuration du profil utilisateur et des informations de l'entreprise.
  - Upload et gestion du Logo d'entreprise et de l'Avatar utilisateur.
  - Sauvegarde locale des préférences.
- **Support & Aide :**
  - FAQ dynamique et formulaire de contact.
- **Système (Core) :**
  - Mode Sombre (Dark Mode) géré de manière persistante.
  - Multilinguisme (Français / Anglais).
  - Notifications et alertes uniformisées via un composant `ConfirmModal`.

## 3. Technologies Utilisées

- **Framework Core :** Next.js 15+ (App Router), React 19.
- **Styling :** Tailwind CSS (utilisation intensive de variables CSS pour les thèmes et le mode sombre).
- **Icônes :** `lucide-react`.
- **Graphiques :** `recharts`.
- **Données (actuellement) :** Mock data (données simulées) et persistance via le `localStorage` du navigateur web. Aucune base de données ou backend complexe n'est encore connecté.

## 4. Architecture et Structure des fichiers

Le projet suit l'architecture standard du App Router de Next.js :

```text
src/
├── app/
│   ├── (dashboard)/       # Toutes les pages protégées/principales de l'application
│   │   ├── clients/       # Liste et profils clients
│   │   ├── dashboard/     # Tableau de bord principal
│   │   ├── help/          # Page d'aide et de contact
│   │   ├── invoices/      # Liste des factures et page de création/édition
│   │   ├── settings/      # Paramètres du compte
│   │   └── layout.tsx     # Layout principal (Sidebar + Topbar)
│   ├── globals.css        # Variables CSS globales et classes utilitaires Tailwind
│   └── layout.tsx         # Layout racine (RootLayout)
├── components/
│   ├── layout/            # Composants de structure (Sidebar, Topbar)
│   └── ui/                # Composants réutilisables (Card, Modal, ConfirmModal, CustomSelect, etc.)
├── contexts/              # Contextes React (ThemeContext, LanguageContext, SettingsContext)
├── lib/                   # Utilitaires (utils.ts) et données simulées (mock-data.ts)
└── locales/               # Fichiers de traduction (fr.ts, en.ts)
```

## 5. Décisions de Design (Design System)

Un ensemble strict de règles de design a été mis en place et doit être respecté (visible dans le fichier `AGENTS.md` si présent) :

- **Variables CSS :** Utilisation systématique de `var(--color-primary)`, `var(--color-background)`, `var(--color-surface)`, `var(--color-text-main)`, etc., pour garantir le fonctionnement du Mode Sombre.
- **Boutons & Interactions :** Tout élément interactif doit avoir des états `:hover` et `:active`. Les animations typiques incluent `active:scale-95`, `transition-all duration-200`, et des icônes qui se déplacent au survol (`group-hover`).
- **Modales :** Les boîtes de dialogue natives (`alert()`, `confirm()`) sont **interdites**. Tout message ou confirmation doit passer par le composant `ConfirmModal` situé dans `src/components/ui/ConfirmModal.tsx`.
- **Mobile First :** Toutes les vues doivent être parfaitement responsives. Attention particulière aux tableaux qui doivent scroller horizontalement (`overflow-x-auto`) et aux grilles qui doivent passer sur une seule colonne sur mobile (`grid-cols-1 sm:grid-cols-2`).

## 6. Instructions pour les Modèles IA Futurs

Si tu es un modèle d'Intelligence Artificielle chargé de continuer le développement de ce projet, voici tes règles d'or :

1. **Lis `mock-data.ts` et `utils.ts`** avant de manipuler des données. Actuellement, la gestion de l'état passe souvent par le `localStorage` pour simuler une DB.
2. **Respecte le Design System :** N'utilise pas de couleurs Tailwind codées en dur (comme `bg-blue-500`) ou de textes noirs (`text-black`). Utilise toujours les variables CSS du projet pour préserver la compatibilité Dark Mode.
3. **Composants UI :** Réutilise au maximum les composants existants dans `src/components/ui/`.
4. **Pas d'alertes natives :** Utilise toujours `ConfirmModal` avec `hideCancel=true` pour les simples messages d'information, ou avec les callbacks pour les validations de suppression.
5. **Typescript :** Vérifie toujours que les interfaces (comme `Invoice` ou `Client` dans `mock-data.ts`) sont respectées lorsque tu mets à jour l'état.

---

> Dernière mise à jour par l'agent : Août 2026
