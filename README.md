# ExploreTaroudant

Welcome to ExploreTaroudant, a web application designed to help tourists and locals discover the vibrant city of Taroudant. This platform provides comprehensive information about places to visit, local activities, and cultural events.

## 🚀 Features

-   **User Authentication:** Secure registration and login for tourists, guides, and administrators.
-   **Role-Based Dashboards:**
    -   **Tourist:** Manage reservations, write reviews, and explore content.
    -   **Guide:** Manage activities and view bookings.
    -   **Admin:** Oversee the entire platform, manage users, and content.
-   **Explore:**
    -   **Places:** Discover historical sites, gardens, and other points of interest.
    -   **Activities:** Find guided tours, workshops, and other local experiences.
    -   **Events:** Stay updated on festivals, exhibitions, and local gatherings.
-   **Interactive System:**
    -   **Reservations:** Book activities directly through the platform.
    -   **Reviews:** Share your experiences and read reviews from others.

## 🛠️ Tech Stack

-   **Backend:**
    -   Java
    -   Spring Boot (with Spring Security, Spring Data JPA)
    -   Maven
-   **Frontend:**
    -   Next.js
    -   React
    -   TypeScript
    -   Tailwind CSS
-   **Database:**
    -   PostgreSQL (or any other relational database configured in `application.properties`)
-   **Containerization:**
    -   Docker
    -   Docker Compose

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   JDK 17 or later
-   Node.js (v18 or later)
-   `pnpm` (or `npm`/`yarn`)
-   Docker and Docker Compose (Recommended)

### 🐳 Running with Docker (Recommended)

This is the easiest way to get the entire application stack running.

1.  Clone the repository.
2.  From the root directory, run:
    ```sh
    docker-compose up --build
    ```
3.  The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8080`.

### 💻 Manual Installation

#### Backend (Spring Boot)

1.  Navigate to the `backend` directory:
    ```sh
    cd backend
    ```
2.  Configure your database connection in `src/main/resources/application.properties`.
3.  Install dependencies and run the application:
    ```sh
    ./mvnw spring-boot:run
    ```

#### Frontend (Next.js)

1.  Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```
2.  Install dependencies:
    ```sh
    pnpm install
    ```
3.  Run the development server:
    ```sh
    pnpm dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
.
├── backend/         # Spring Boot application
├── frontend/        # Next.js application
└── docker-compose.yml # Docker configuration
```

---

Happy exploring!
