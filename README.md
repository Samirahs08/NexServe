# NexServe - Local Service Discovery & Matching Platform
NexServe is a premium, full-stack web application designed to connect local service providers (e.g., cleaning, plumbing, electrical, carpentry, painting, tutoring, and cooking) with customers in their neighborhood. It features a modern dark-mode responsive glassmorphic UI, geolocation-based mapping, direct real-time chat, and administrative analytics.
---
## 🌟 Key Features
*   🗺️ **Interactive Location Matching**: Geolocation-based matching using Leaflet Maps to discover service providers within the customer's vicinity.
*   🔍 **Advanced Filtering**: Search and filter by category (Cleaning, Plumbing, Electrical, Carpentry, Painting, Tutoring, Cooking, etc.) or keywords.
*   📅 **Comprehensive Booking Management**: Full lifecycle management of bookings (Pending, Accepted, Completed, Rejected) with real-time status transitions.
*   💬 **Real-time Live Chat**: Built-in messaging system powered by WebSockets (STOMP/SockJS) for direct negotiation and coordination.
*   📝 **Work Showcase (Performance Posts)**: Service providers can create posts detailing and showcasing their completed projects.
*   ⭐ **Ratings & Reviews**: Transparent feedback loops through service ratings and textual reviews after booking completion.
*   📊 **Admin Analytics Dashboard**: High-level system overview including total user count, active bookings, overall revenue, and platform statistics.
---
## 🛠️ Technology Stack
### Backend
*   **Java 17** & **Spring Boot 4.0.5**
*   **Spring Web** & **Spring WebSockets** (SockJS + STOMP)
*   **Spring Data MongoDB** (Database access)
*   **Spring Security** with **JSON Web Tokens (JWT)** authentication
*   **Lombok** (Boilerplate reduction)
### Frontend
*   **React 19**
*   **React Router v7** (Declarative routing)
*   **Leaflet & React Leaflet** (Map integration)
*   **Axios** (API communication)
*   **CSS Variable System** (Premium glassmorphic, responsive, and responsive dark aesthetics)
---
## 📂 Project Structure
```text
NexServe/
├── Backend/                    # Spring Boot backend application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/serviceplatform/
│   │   │   │   ├── config/      # App configurations (Security, CORS, WebSockets, JWT, Seeders)
│   │   │   │   ├── controller/  # REST API Controllers (Auth, Bookings, Analytics, Chat, etc.)
│   │   │   │   ├── dto/         # Request and Response Data Transfer Objects
│   │   │   │   ├── entity/      # MongoDB Document Schemas (User, ServiceListing, Booking, etc.)
│   │   │   │   ├── repository/  # Spring Data MongoDB repositories
│   │   │   │   └── service/     # Business logic implementations
│   │   │   └── resources/
│   │   │       └── application.properties # MongoDB connection and app configurations
│   ├── build.gradle            # Gradle dependencies and build configuration
│   └── gradlew / gradlew.bat   # Gradle wrappers for building and running
├── frontend/                   # React frontend application
│   ├── public/                 # Static assets and icons
│   ├── src/
│   │   ├── components/         # Reusable UI elements (Navbar, Footer, ServiceCard, Loader)
│   │   ├── pages/              # Page views (Home, ServiceDetail, Chat, Bookings, Admin panel, etc.)
│   │   ├── App.js / App.css    # Application layout, routes, and structural styles
│   │   └── index.js / index.css# Global entries and core Glassmorphism Design Tokens
│   └── package.json            # npm scripts and package dependencies
└── .gitignore                  # Git global ignore patterns
```
---
## ⚙️ Configuration & Database
*   **Database**: MongoDB (Atlas cloud cluster configured).
*   **Configurations**: Database credentials and application settings are located in [Backend/src/main/resources/application.properties](Backend/src/main/resources/application.properties).
*   **Auto-Seeding**: The application seeds a default Admin user on startup if it does not already exist:
    *   **Username (Email)**: `admin@nexserve.com`
    *   **Password**: `Admin@123`
---
## 🚀 Getting Started
### Prerequisites
*   **Java JDK 17** or higher
*   **Node.js** (v18+ recommended)
*   An active Internet Connection (for loading Leaflet map tiles and MongoDB Atlas connectivity)
---
### Run the Backend
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Build the project (skipping tests if offline/local setup):
   ```bash
   ./gradlew build -x test
   ```
3. Run the Spring Boot application:
   ```bash
   ./gradlew bootRun
   ```
   The backend will start and listen on port `8080` (e.g., `http://localhost:8080`).
---
### Run the Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm start
   ```
   The application will run locally and open automatically at `http://localhost:3000`.
