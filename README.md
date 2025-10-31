# 🚀 AI-Powered Fitness Tracker Microservice App

This is a comprehensive, full-stack application that provides a modern fitness tracking experience. It's built with a distributed microservice architecture on the backend and a reactive, modern frontend.

Users can create an account, log their fitness activities (running, cycling, etc.), and receive personalized, AI-powered insights and recommendations for their workouts.

![Fitness Dashboard Screenshot](fitness-app-frontend/src/assets/screenshots/dashboard.png)



---

## Key Backend Features

* **Microservice Architecture:** A distributed system built with **Spring Cloud**, featuring:
    * **Service Discovery (Eureka):** A central registry (`eurekaServer`) for all microservices.
    * **API Gateway (Spring Cloud Gateway):** A single entry point that secures, routes, and load-balances all API requests using their service names (e.g., `lb://USER-SERVICE`).

* **Secure Authentication:** End-to-end security using **Keycloak** as an OAuth 2.0 provider. The gateway validates JWTs on every request.

* **Event-Driven & Asynchronous:** Services are decoupled using **RabbitMQ**. When a new activity is logged, the `activityService` publishes a message, which the `aiService` consumes asynchronously for background processing.

* **Generative AI Integration:** The `aiService` calls the **Google Gemini API** to provide intelligent, personalized analysis and suggestions based on user workout data.

* **Polyglot Persistence:** A "database-per-service" design:
    * **PostgreSQL:** Stores relational user data for the `userService`.
    * **MongoDB:** Stores flexible document data for the `activityService` and `aiService`.

* **User Sync:** A custom filter on the `gateway` automatically registers users from Keycloak into the `userService` database on their first login.

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Backend** | Java 24, Spring Boot 3, Spring Cloud |
| **Frontend** | React, Vite, Redux, Material-UI (MUI) |
| **Security** | Spring Security, Keycloak (OAuth 2.0 & JWT) |
| **Databases** | PostgreSQL (`userService`), MongoDB (`activityService`, `aiService`) |
| **Messaging** | RabbitMQ (for asynchronous AI processing) |
| **Microservices** | Spring Cloud Gateway, Eureka Service Discovery |
| **AI** | Google Gemini API |
| **Build** | Maven, npm/Vite |

---

## How to Run

### 1. Prerequisites

* Java 24 (or a compatible JDK)
* Node.js 20+
* Docker Desktop
* An active Google Gemini API Key

### 2. Start External Services

This project requires Keycloak, PostgreSQL, MongoDB, and RabbitMQ. The easiest way to run them is with Docker.

```bash
# 1. Start RabbitMQ
docker run -d --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management

# 2. Start PostgreSQL (for userService)
docker run -d --rm --name postgres-db -e POSTGRES_PASSWORD=wizard -e POSTGRES_USER=postgres -e POSTGRES_DB=user-db -p 5432:5432 postgres:16

# 3. Start MongoDB (for activityService & aiService)
docker run -d --rm --name mongo-db -p 27017:27017 mongo

# 4. Start Keycloak (for authentication)
docker run -d --rm --name keycloak -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin -p 8181:8080 quay.io/keycloak/keycloak:25.0.0 start-dev
```

### 3. Configure Keycloak

1.  Go to the **Keycloak Admin Console** at `http://localhost:8181`.
2.  Log in with username `admin` and password `admin`.
3.  On the left, create a new Realm named `fitness-oauth2`.
4.  Inside your new realm, go to the **Clients** tab and click **Create client**.
5.  Set the **Client ID** to `oauth2-pkce-client` and click **Next**.
6.  On the next screen, ensure **Client authentication** is **OFF** and **Standard flow** is **ON**.
7.  Set the **Valid Redirect URIs** to `http://localhost:5173` and save.
8.  Go to the **Realm Settings** tab, click **Login**, and toggle **User registration** to **ON**.

### 4. Set Environment Variables

The `aiService` needs API keys to run. Set these in your IDE's run configuration for `AiServiceApplication`:

* `GEMINI_API_URL`: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=`
* `GEMINI_API_KEY`: `<YOUR_SECRET_GEMINI_KEY>`

### 5. Run Backend Services (In Order)

Run the `main` method from the main application class for each service *in this sequence*:

1.  **`eurekaServer`** (`EurekaServerApplication`)
2.  **`userService`** (`UserServiceApplication`)
3.  **`activityService`** (`ActivityServiceApplication`)
4.  **`aiService`** (`AiServiceApplication`)
5.  **`gateway`** (`GatewayApplication`)

Wait for each service to start successfully before starting the next.

### 6. Run the Frontend

1.  Open a new terminal in the `fitness-app-frontend` directory.
2.  Run `npm install` to install dependencies.
3.  Run `npm run dev` to start the app.
4.  Open **`http://localhost:5173`** in your browser.

You can now register a new user (via the Keycloak page) and start tracking activities!