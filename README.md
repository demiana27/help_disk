# HelpDesk Lite (Version 1)

HelpDesk Lite is a lightweight, responsive, and secure internal support ticketing system that allows employees to submit and track requests, while support staff and managers manage workloads, assign ownership, and resolve tickets.

Built with a **React 18** frontend (Vite, Material-UI, React Router v6) and a **Node.js/Express** backend with **MongoDB**.

---

## Key Features (V1 Scope)

*   **Role-Based Access Control:** Secure portals for Employees, Support Staff, and Managers.
*   **Support Requests intake:** Create requests with subjects, descriptions, categories, priorities, and file attachments.
*   **Ticket Board:** Search, filter, and assign support tickets (exclusive to Support/Managers).
*   **Workload Dashboard:** Team assignment list, active load metrics, and unassigned tickets view (exclusive to Managers).
*   **Security:** Password hashing via bcrypt, stateless JWT session authentication, and protected client/server endpoints.
*   **File Attachments:** Upload files (images, PDFs, documents up to 5MB) stored locally and link-accessible.

---

## User Roles & Login Presets

To facilitate evaluation, the database auto-seeds on initial launch with the following default accounts. Use the "One-Click Quick Login" presets on the login screen:

| Role | Username | Password | Actions Available |
| :--- | :--- | :--- | :--- |
| **Manager** | `manager@helpdesk.com` | `Password123` | View workload dashboard, monitor team metrics, assign owners, update statuses. |
| **Support Staff** | `support@helpdesk.com` | `Password123` | View support board, search/filter, self-assign ownership, update statuses. |
| **Employee** | `employee@helpdesk.com` | `Password123` | Submit requests, upload attachments, view personal request history. |

---

## Project Structure

```
HelpDeskLite/
├── backend/            # Express REST API Server
│   ├── config/         # DB connection & helper scripts
│   ├── controllers/    # API route controllers (Auth, Tickets)
│   ├── middleware/     # JWT extraction and role guard middleware
│   ├── models/         # Mongoose DB schemas (User, Ticket)
│   ├── routes/         # Router paths (/api/auth, /api/tickets)
│   ├── uploads/        # Local uploaded attachment files storage
│   ├── .env.example    # Backend environment variables template
│   └── server.js       # Entry point with DB seeder
│
└── frontend/           # Vite + React Single Page App
    ├── src/
    │   ├── assets/     # Images & assets
    │   ├── components/ # Layout shell, Protected route, Status chips
    │   ├── context/    # JWT Auth state manager
    │   ├── pages/      # Dashboards, forms, login views
    │   ├── services/   # Axios client config and api requests
    │   ├── App.jsx     # App route tree and MUI Theme setup
    │   └── index.css   # Custom global dark scrollbars and glassmorphism
    ├── index.html
    └── .env.example    # Frontend environment variables template
```

---

## Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher)
*   [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017` (default connection string: `mongodb://127.0.0.1:27017/helpdesk_lite`).
    *   *Alternative (Docker):* Run `docker run -d -p 27017:27017 --name helpdesk-mongo mongo:latest`

### Step 1: Clone and Set Up Backend
1.  Navigate into the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure `.env` file (copied from `.env.example` automatically, check or edit if using remote MongoDB Atlas):
    ```env
    PORT=5000
    MONGODB_URI=mongodb://127.0.0.1:27017/helpdesk_lite
    JWT_SECRET=supersecretkey123_change_this_in_production
    NODE_ENV=development
    ```
4.  Start the Express server:
    ```bash
    npm run dev
    ```
    *The console should print `MongoDB Connected` followed by `Seeding database with default users...`. Once complete, the server runs on port 5000.*

### Step 2: Set Up Frontend
1.  Open a new terminal session and navigate into the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Ensure `.env` contains the API base URL:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
4.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
    *The web application is now live at `http://localhost:5173`.*

---

## Verification & Testing Flows

1.  **Login Presets:** Open `http://localhost:5173` and click one of the quick login buttons (e.g. Employee).
2.  **Submit Request:** As an Employee, click "Submit Support Request", fill out the form, attach a file (JPEG/PDF), and click Submit. Note the generated Request ID in the success popup.
3.  **Inspect List:** Go to "My Requests" to verify it is listed. Try filtering by categories.
4.  **Log Out / Switch Roles:** Log out and log back in as Support Staff (`support@helpdesk.com` / `Password123`).
5.  **Assign Ownership:** In the "Tickets Board", find the ticket you submitted. Open it and assign the owner to "Jane Smith (Support)". Observe the status automatically transitioning to "In Progress".
6.  **Manage Workloads:** Log out and log back in as Manager (`manager@helpdesk.com` / `Password123`). Observe the workload card showing active tickets assigned to "Jane Smith" and metrics for total open tickets.
