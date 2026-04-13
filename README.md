# Study.Juche - Headless CMS Education Platform

Welcome to Study.Juche, a modern, full-stack web application designed for creating and managing online courses. It uses Ghost as a headless CMS for content management and features a powerful FastAPI backend and a responsive React frontend.

This platform is built to be robust, secure, and easily deployable, providing a seamless experience for both students and administrators.

## Features

### Frontend (React + Vite)
- **Modern & Responsive UI:** Built with Tailwind CSS for a clean, responsive design that works on all devices.
- **Dynamic Page Rendering:** Static pages like "About," "Contact," "Privacy Policy," etc., are dynamically rendered from pages created in the Ghost CMS.
- **Course & Article Listings:** Separate, beautifully styled pages to list all available courses and articles.
- **User Authentication:** Secure user registration and login system.
- **Role-Based Access:** Differentiated experience for Admins, Moderators, and Students.
- **User Dashboard:** A personalized hub for logged-in users, featuring:
  - **"Continue Learning"**: Prompts the user to jump back into their most recently accessed, unfinished course.
  - **"Overall Progress"**: A visual, circular progress bar showing the user's total completion percentage across all lessons on the site.
- **Admin Panel:** A dedicated interface for creating courses, uploading feature images, and managing course content by associating lessons from Ghost.
- **Site-wide Search:** A functional search bar in the footer that finds and displays results from Courses, Articles, and Pages.
- **Dynamic Social Links:** Footer icons for social media are dynamically rendered based on environment variables.
- **GDPR Cookie Consent:** A clean, unobtrusive banner for GDPR compliance.

### Backend (FastAPI)
- **Secure JWT Authentication:** Industry-standard JSON Web Token implementation for secure sessions.
- **Modern Password Hashing:** Uses `argon2`, the winner of the Password Hashing Competition, for maximum security.
- **Role-Based API Protection:** Endpoints are protected based on user roles (Admin, Moderator).
- **Automatic Superuser Creation:** An admin user is automatically created on the first startup from credentials set in the environment file.
- **File Uploads:** Handles image uploads for course feature images, saving them to a static directory.
- **Comprehensive API:** Endpoints for managing courses, lessons, user progress, and search.
- **Ghost CMS Proxy:** A secure proxy to fetch lesson-specific posts from Ghost, keeping the Content API key private.

### Infrastructure (Docker + Caddy)
- **Fully Containerized:** All services (frontend, backend, database, CMS, reverse proxy) are containerized with Docker for easy setup and consistent environments.
- **Intelligent Reverse Proxy:** Caddy is used as a modern, powerful reverse proxy that automatically handles routing between the frontend and backend services.
- **PostgreSQL Database:** A robust, open-source relational database for all application data.
- **Health Checks:** The backend service intelligently waits for the database to be fully ready before starting, preventing race conditions and startup crashes.

## Technology Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router
- **Backend:** FastAPI, Python, SQLModel (based on Pydantic and SQLAlchemy)
- **Database:** PostgreSQL
- **CMS:** Ghost (as a Headless CMS)
- **Server/Proxy:** Caddy
- **Containerization:** Docker, Docker Compose

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Docker
- Docker Compose

## Setup and Installation Guide

Follow these steps to get the project running on your local machine for development.

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd StudyJuche
```

### Step 2: Configure Environment Variables

You need to create two `.env` files: one for the backend and one for the frontend.

**1. Backend Configuration:**

Create a file named `.env` inside the `/backend` directory:
```
/backend/.env
```
Copy the following content into it. **You must change these values.**

```env
# PostgreSQL Database Settings
# These MUST match the environment variables for the 'db' service in docker-compose.dev.yml
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dbname
DATABASE_URL=postgresql://user:password@db:5432/dbname

# Application Security
# Generate a long, random string for this (e.g., using `openssl rand -hex 32`)
SECRET_KEY="YOUR_VERY_LONG_AND_SECRET_RANDOM_STRING"

# Superuser Admin Account
# This user will be created on the first startup.
ADMIN_USERNAME="your_admin_username"
ADMIN_PASSWORD="a_very_strong_and_secure_password"
ADMIN_EMAIL="your_admin_email@example.com"

# Ghost CMS Integration
# The URL should point to the Ghost container's name and port
VITE_GHOST_URL=http://ghost:2368
# You will get this key in the next step. Leave it blank for now.
VITE_GHOST_CONTENT_KEY=""
```

**2. Frontend Configuration:**

Create a file named `.env` inside the `/frontend` directory:
```
/frontend/.env
```
Copy the following content into it.

```env
# Ghost CMS Integration
# This URL is for the frontend to access Ghost via the Caddy proxy
VITE_GHOST_URL=http://localhost:2368
# You will get this key in the next step. Leave it blank for now.
VITE_GHOST_CONTENT_KEY=""

# Social Media Links (Optional)
# The icon will only appear in the footer if the URL is provided.
VITE_YOUTUBE_URL="https://www.youtube.com/your-channel"
VITE_TWITTER_URL="https://twitter.com/your-handle"
VITE_DISCORD_URL="https://discord.gg/your-invite"
VITE_TWITCH_URL="https://www.twitch.tv/your-channel"

# Monero Wallet Address (Optional)
VITE_MONERO_ADDRESS="YOUR_MONERO_WALLET_ADDRESS_HERE"
```

### Step 3: Build and Run the Application

With the `.env` files in place, you can now build and run all the services using Docker Compose.

```bash
docker compose -f docker-compose.dev.yml up --build -d
```

This command will:
- Build the Docker images for your frontend and backend.
- Start all services (`frontend`, `backend`, `db`, `caddy`, `ghost`) in the background.
- The backend will wait for the database to be healthy before starting.

### Step 4: Get the Ghost Content API Key

1.  Wait for the services to start (this may take a minute on the first run).
2.  Open your web browser and navigate to the Ghost admin panel: **http://localhost:2368/ghost**.
3.  Complete the Ghost setup process to create your admin account for the CMS.
4.  In the Ghost admin panel, go to **Settings -> Integrations**.
5.  Click **"Add custom integration"**.
6.  Give it a name (e.g., "StudyJuche Frontend") and click **Create**.
7.  Copy the **Content API Key**.
8.  Paste this key into both of your `.env` files for the `VITE_GHOST_CONTENT_KEY` variable.
9.  **Restart your containers** for the new environment variables to take effect:
    ```bash
    docker compose -f docker-compose.dev.yml restart
    ```

### Step 5: You're Ready!

-   Your website is now running at **http://localhost:8080**.
-   You can log in with the `ADMIN_USERNAME` and `ADMIN_PASSWORD` you set in `backend/.env`.
-   You can access the Admin Panel to create courses.

## Content Creation Workflow

This platform uses a "headless" approach. The workflow is as follows:

1.  **Create Content in Ghost:**
    -   Go to your Ghost Admin Panel (`http://localhost:2368/ghost`).
    -   To create a **lesson**, go to **Posts** and create a new post. Add your lesson content. **Crucially, you must add the internal tag `#lesson`** for the system to recognize it as a lesson.
    -   To create a **static page** (like "About" or "Privacy"), go to **Pages** and create a new page.
2.  **Create a Course on Your Site:**
    -   Log in as an Admin or Moderator on your site (`http://localhost:8080`).
    -   Go to the **Admin Panel**.
    -   In the "Create New Course" form, fill in the title, description, and a unique slug.
    -   Upload a feature image for the course.
3.  **Associate Lessons with the Course:**
    -   After creating the course, expand its details in the "Manage Existing Courses" section.
    -   Use the "Add New Lesson" form. The dropdown will show all posts from Ghost that you tagged with `#lesson`.
    -   Select a lesson, give it an order number, and click "Add Lesson".

The course and its lessons will now be visible to all users on the site.
