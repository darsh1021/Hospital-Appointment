# hospital queue managegment system

This repository contains the source code for the hospital queue managegment system, designed to digitize the manual paper waiting queue at the clinic.

## Project Structure

The project is split into two main directory trees:

1.  **[Frontend](file:///c:/Users/anike/Videos/Hospital-Appointment/Frontend)**: A React-based Single Page Application (SPA) powered by Vite, Redux Toolkit, React Router v6, and Socket.io-client.
2.  **[Backend](file:///c:/Users/anike/Videos/Hospital-Appointment/Backend)**: A Node.js + Express REST and WebSocket API built with TypeScript and PostgreSQL using Prisma ORM.

---

## 🚀 Execution & Program Flows

For detailed, step-by-step documentation on how these applications initialize, guard routes, connect together, handle live updates, and how you can add new features quickly, please refer to the program flow files:

*   📖 **[Frontend Program Flow & Architecture Documentation](file:///c:/Users/anike/Videos/Hospital-Appointment/Frontend/PROGRAM_FLOW.md)**
*   📖 **[Backend Program Flow & Architecture Documentation](file:///c:/Users/anike/Videos/Hospital-Appointment/Backend/PROGRAM_FLOW.md)**

---

## 🛠️ Quick Start

### 1. Database & Backend Setup
1.  Navigate to the `/Backend` directory.
2.  Configure environment variables in a `.env` file (e.g., `DATABASE_URL`, `JWT_SECRET`, `PORT`).
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run Prisma migrations to construct the database tables:
    ```bash
    npx prisma migrate dev
    ```
5.  Start the development server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup
1.  Navigate to the `/Frontend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite local development server:
    ```bash
    npm run dev
    ```
