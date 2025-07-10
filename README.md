# Jetson Take-Home Project

### Prerequisites

-   Docker Desktop installed and running
-   Git (to clone the repository)

### Setup Instructions

1. **Clone and navigate to the project:**

    git clone <repository-url>
    cd jetson-takehome

2. **Environment variables:**

    The `.env` file is included with defaults for easy setup.
    _(Note: This file would be in .gitignore for security in production)_

3. **Start the application:**
   docker-compose up --build

4. **Seed the database with sample data:**

    In a new terminal window, run:(to seed data)

    docker-compose exec backend npm run seed

5. **Access the application:**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:3001
    - Database: PostgreSQL running on localhost:5432

-   **Backend**: Node.js/Express API server/ Sequelize
-   **Frontend**: Next.js
-   **Database**: PostgreSQL

### Stopping the Application

docker-compose down

### Resetting the Database

If you need to reset all data:

docker-compose down -v
docker-compose up --build
docker-compose exec backend npm run seed
