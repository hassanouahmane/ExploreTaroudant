# 🏰 Explore Taroudant - Plateforme de Tourisme Digital

**Explore Taroudant** est une application web complète permettant de promouvoir le tourisme, l'artisanat et le patrimoine culturel de la ville de Taroudant. Elle connecte les touristes, les guides locaux et les administrateurs via une interface moderne et sécurisée.

![Status](https://img.shields.io/badge/Status-Functional-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 🚀 Technologies Utilisées

### Backend ☕
* **Langage :** Java 21
* **Framework :** Spring Boot 3.2
* **Sécurité :** Spring Security + JWT (JSON Web Tokens)
* **Base de données :** MySQL 8.0
* **ORM :** Hibernate / Spring Data JPA

### Frontend ⚛️
* **Framework :** Next.js 14 (React)
* **Langage :** TypeScript
* **Style :** Tailwind CSS + Shadcn/UI
* **Client HTTP :** Fetch API personnalisé

### DevOps 🐳
* **Docker** & **Docker Compose** pour l'orchestration des conteneurs.

---

## ✨ Fonctionnalités Principales

L'application gère 3 types de rôles avec des permissions distinctes :

### 1. 👤 Touriste
* Inscription et connexion rapide.
* Recherche et consultation des **Lieux** (Patrimoine).
* Réservation d'**Activités** et de **Circuits**.
* Consultation des événements à venir.
* Découverte des **Artisans** locaux.
* Gestion des réservations personnelles (Annulation, Historique).

### 2. 🗺️ Guide
* Inscription (soumise à validation par l'Admin).
* Gestion du **Profil Public** (Bio, Langues parlées).
* Création et gestion de ses **Activités** et **Circuits**.
* Consultation des réservations reçues pour ses activités.

### 3. 🛡️ Administrateur
* **Tableau de bord global** (Statistiques).
* Gestion des utilisateurs (Validation des guides en attente).
* Gestion complète du contenu :
    * **Lieux** (Ajout/Modification/Suppression).
    * **Événements** (Festivals, Culture).
    * **Artisans** (Mise en avant du savoir-faire).
    * **Signalements** (Gestion des rapports utilisateurs).
* Supervision de toutes les réservations.

---

## 🛠️ Installation et Démarrage (Docker)

Le projet est entièrement "Dockerisé". Assurez-vous d'avoir **Docker Desktop** installé et lancé.

1.  **Cloner le projet :**
    ```bash
    git clone [https://github.com/votre-username/ExploreTaroudant.git](https://github.com/votre-username/ExploreTaroudant.git)
    cd ExploreTaroudant
    ```

2.  **Lancer l'application :**
    Ouvrez un terminal à la racine du projet et exécutez :
    ```bash
    docker-compose up -d --build
    ```
    *Cette commande compile le Backend (Maven), construit le Frontend (Next.js) et lance la Base de données.*

3.  **Accéder à l'application :**
    * 🏠 **Frontend :** [http://localhost:3001](http://localhost:3001)
    * ⚙️ **Backend API :** [http://localhost:8080](http://localhost:8080)
    * 🗄️ **Base de données :** Port 3307 (User: root / Pass: 12345)

---

## 📂 Structure du Projet
ExploreTaroudant/ ├── backend/ # Code source Java Spring Boot │ ├── src/main/java/backend/ │ │ ├── controller/ # API Endpoints │ │ ├── entities/ # Modèles BDD (User, Guide, Place, Reservation...) │ │ ├── repository/ # Interfaces JPA │ │ ├── service/ # Logique métier │ │ └── security/ # Config JWT │ └── Dockerfile │ ├── frontend/ # Code source Next.js │ ├── src/app/ # Pages (Dashboard, Auth, Home) │ ├── src/components/ # Composants UI réutilisables │ ├── src/services/ # Appels API (auth.service, guide.service...) │ └── Dockerfile │ ├── docker-compose.yml # Orchestration des services └── README.md