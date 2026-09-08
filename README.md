# Weekly Report Generator & Team Dashboard

## 1. Project Overview

This is a full-stack weekly reporting and team management system designed to streamline asynchronous team updates.

- Team members create weekly reports documenting achievements, tasks, and blockers.
- Team members can save reports as drafts.
- Team members submit reports for manager review.
- Managers can review, monitor, and assess team reports via dashboards and analytics.
- Managers can approve reports or request corrections.
- Team members can update and resubmit corrected reports based on manager feedback.
- Report versions are preserved to document the correction lifecycle.
- Role-based access control (RBAC) securely separates Team Member and Manager/Admin functionality.

---

## 2. Key Features

### Authentication

- Registration and Login
- Logout functionality
- Password hashing (bcrypt)
- Secure JWT session handling
- Role-based access control middleware

### Team Member

- Create weekly report (with draft saving capabilities)
- Edit draft and needs-correction reports
- Submit report for review
- View own report history with status tracking
- View full report details securely
- Respond to manager correction requests
- Resubmit corrected reports
- View report status lifecycle and manager comments

### Manager/Admin

- View all team reports (paginated and filterable)
- Review submitted reports
- Approve reports or request corrections (with required feedback comments)
- View full version history of a report
- View team members and manage their roles/status (Admin)
- Manage projects/categories
- View interactive dashboard analytics (Compliance rate, blocker counts, task workload by project)

### Reporting Data

The report structure tracks:

- Week/date range
- Project/category assignment
- Completed and ongoing tasks (nested array)
  - Task name
  - Priority (Low, Medium, High, Critical)
  - Task Type (Development, Testing, Design, etc.)
  - Status (In Progress, Completed, etc.)
  - Planned and Actual progress percentage
  - Planned and Time spent hours
  - Deliverables/Output URLs
- Next week tasks
- Blockers/challenges with key blocker tagging
- Achievements/highlights with key achievement tagging
- Optional notes/links

---

## 3. Report Workflow

```text
Draft
  ↓
Submitted
  ↓ (If changes requested)
Needs Correction
  ↓
Submitted
  ↓ (If approved)
Approved
```

- Team members can create and edit their own reports in `Draft` or `Needs Correction` status.
- Managers review `Submitted` reports.
- Managers **cannot modify** the team's report content, ensuring data integrity.
- Managers can approve or request changes. When changes are requested, a review comment is attached.
- When changes are requested, the team member edits their original report. A snapshot (version) is silently preserved of the previous state, and the report returns to `Needs Correction`.
- Once corrected, the report returns to `Submitted`.

---

## 4. User Roles & Permissions

| Feature                   | Team Member      | Manager/Admin |
| ------------------------- | ---------------- | ------------- |
| Register/Login            | ✓                | ✓             |
| Create own report         | ✓                | -             |
| Edit own draft/correction | ✓                | -             |
| Submit report             | ✓                | -             |
| View own history          | ✓                | -             |
| View all reports          | -                | ✓             |
| Approve report            | -                | ✓             |
| Request correction        | -                | ✓             |
| Add review comment        | -                | ✓             |
| View report versions      | Own              | All           |
| Manage projects           | -                | ✓             |
| Manage users              | -                | ✓ (Admin)     |
| Dashboard analytics       | Personal/limited | ✓             |

---

## 5. Technology Stack

### Frontend

- Next.js 14+ (App Router)
- React 19
- TypeScript
- Tailwind CSS (v4)
- shadcn/ui
- Lucide React
- Recharts
- React Hook Form
- Zod

### Backend

- Node.js 20+
- Express.js
- TypeScript
- REST API
- Prisma ORM
- Zod
- JWT authentication
- bcryptjs

### Database

- MySQL
- Prisma

---

## 6. Project Architecture

```text
weekly-report-generator/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   ├── .env.example
│   ├── next.config.mjs
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── docs/
│   ├── er-diagram.png
│
├── .gitignore
└── README.md
```

---

## 7. Prerequisites

Ensure you have the following installed to run the application locally:

- Node.js 20+
- npm 10+
- XAMPP (to easily run the local MySQL database server)
- Git

---

## 8. Database Setup

### Step 1 — Start XAMPP

Open your XAMPP Control Panel and start the **MySQL** service. (Apache is optional, only needed if you want to use phpMyAdmin via a web browser).

### Step 2 — Create Database

Connect to your local MySQL (e.g. via `http://localhost/phpmyadmin` or a database client) and create a new database called:

```text
weekly_report_generator
```

### Step 3 — Configure DATABASE_URL

In the `backend` directory, duplicate `.env.example` into `.env` and set your `DATABASE_URL`:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/weekly_report_generator"
```

_(Replace `YOUR_PASSWORD` with your local MySQL password. If XAMPP root has no password, use `mysql://root:@localhost:3306/weekly_report_generator`)_.

---

## 9. Environment Variables

Create `.env` files in both backend and frontend directories (or reuse `.env.example` by renaming).

### Backend (`backend/.env`)

```env
# Server Port
PORT=5000
# Database Connection String
DATABASE_URL="mysql://root:@localhost:3306/weekly_report_generator"
# JWT Secret Key for Authentication
JWT_SECRET="development_secret_key_change_me_in_production"
# Frontend Origin for CORS headers
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`frontend/.env.local`)

```env
# The backend API Base URL
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

---

## 10. Installation

### Clone Repository

```bash
git clone <REPOSITORY_URL>
cd weekly-report-generator-
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 11. Prisma Setup

Within the `backend` directory, run these commands to set up the database schema and populate initial data:

```bash
cd backend
# Generate prisma client types for TypeScript
npx prisma generate

# Apply migrations to your MySQL database
npx prisma migrate dev

# Seed the database with sample projects and users
npx prisma db seed
```

---

## 12. Seed Data

The `npx prisma db seed` command provisions realistic mock data, including projects, past reports representing the full lifecycle, and user accounts assigned to appropriate roles.

You can log in using these generated development credentials:

### Development/demo credentials only:

| Role            | Email                       | Password       |
| :-------------- | :-------------------------- | :------------- |
| **Admin**       | `admin@company.com`         | `Password123!` |
| **Manager**     | `manager.sarah@company.com` | `Password123!` |
| **Manager**     | `manager.david@company.com` | `Password123!` |
| **Team Member** | `dev.alice@company.com`     | `Password123!` |
| **Team Member** | `dev.bob@company.com`       | `Password123!` |
| **Team Member** | `dev.charlie@company.com`   | `Password123!` |
| **Team Member** | `dev.diana@company.com`     | `Password123!` |
| **Team Member** | `dev.evan@company.com`      | `Password123!` |

_(Note: Passwords are securely hashed with bcrypt during seeding)._

---

## 13. Run the Application

The applications can be booted concurrently on your local machine.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Expected backend URL: `http://localhost:5000`

### Terminal 2 — Frontend

Open a new terminal window:

```bash
cd frontend
npm run dev
```

Expected frontend URL: `http://localhost:3000`

---

## 14. Application URLs

- **Frontend UI:** `http://localhost:3000`
- **Login:** `http://localhost:3000/login`
- **Registration:** `http://localhost:3000/register`
- **Dashboard (Team Member):** `http://localhost:3000/dashboard`
- **Manager Dashboard:** `http://localhost:3000/manager/dashboard`
- **Backend API Base:** `http://localhost:5000/api`

---

## 15. API Documentation

### Authentication

- `POST /api/auth/register` (Registers a new user)
- `POST /api/auth/login` (Authenticates and returns JWT)
- `GET /api/auth/me` (Returns valid user context using JWT)

### User Reports (Team Members)

- `GET /api/reports/my-reports` (Returns user's paginated reports)
- `POST /api/reports` (Creates a draft report)
- `GET /api/reports/:id` (Get own report details)
- `PUT /api/reports/:id` (Updates draft/needs-correction report)
- `POST /api/reports/:id/submit` (Submits a report for review)
- `GET /api/reports/:id/versions` (Fetches historical snapshot timeline)

### Team Management (Managers/Admins)

- `GET /api/manager/reports` (Lists all team reports, filterable)
- `GET /api/manager/reports/:id` (View member's report detail)
- `POST /api/manager/reports/:id/approve` (Approve a report)
- `POST /api/manager/reports/:id/request-changes` (Reject/request corrections)

### Projects & Global Entities

- `GET /api/projects` (List projects)
- `POST /api/projects` (Create project - Admin/Manager)
- `GET /api/dashboard/metrics` (Returns aggregate data for visual dashboards - Manager/Admin)
- `GET /api/users` (List all users - Admin)

---

## 16. RBAC & Security

- **Authentication & Hashing:** Passwords are hashed heavily using `bcryptjs`. Tokens are exclusively transmitted via HTTP Bearer Authentication.
- **Middleware Shields:** Critical API endpoints apply `authenticate` and `requireRole` middleware.
- **Data Scoping:** Users are strongly isolated to their own records. `report.controller.ts` actively validates user ownership via the database payload. A Team Member cannot view or modify a report ID belonging to someone else.
- **Input Validation:** The backend uses `Zod` validation middleware to strictly define body, param, and query structures payload requirements payload safety.

---

## 17. Validation & Error Handling

- Form payloads on the Next.js frontend are checked synchronously via Zod schema using `react-hook-form` `@hookform/resolvers/zod`.
- The Express API runs the same validation methodology, throwing unified JSON formats: `{ success: false, message: 'Invalid data', errors: [...] }`.
- Invalid HTTP status codes (e.g. 401 Unauthorized, 403 Forbidden, 400 Bad Request, 500 Internal Server Error) seamlessly trigger clear UI feedback such as toast notifications and route redirects.

---

## 18. Testing

Backend Jest tests are configured. Run them using:

```bash
cd backend
npm run test
```

These suites validate controller behavior, REST API success paths, middleware access blocks, and verify RBAC properties (e.g., verifying a Team Member cannot approve their own reports).

---

## 19. Build Verification

Generate a production deployment build to verify compilation, types, and strict rules:

### Backend

```bash
cd backend
npm run build
```

### Frontend

```bash
cd frontend
npm run build
```

---

## 20. ER Diagram

The database structure relies on the relationships depicted accurately via Prisma schema. Please see the generated data models for:

- User ↔ Role
- Report ↔ User, Project, Tasks, Versions, Reviews.

_(See documentation diagram located at `/docs/er-diagram.png` for a visual overview of these relationships.)_

---

## 21. Assessment Workflow Demo

To experience the lifecycle in action:

### Scenario 1: Team Member Lifecycle

1. Open `http://localhost:3000/login` in your web browser.
2. Sign in as `dev.alice@company.com` (Password: `Password123!`).
3. View the Team Member Dashboard. Click **"New Weekly Report"**.
4. Fill out the report form, add tasks, choose a project, and add blockers/achievements.
5. Check out the **"Save as Draft"** functionality.
6. Once satisfied, click **"Submit Report"**.

### Scenario 2: Manager Review Lifecycle

1. Open a new Incognito Tab or Log Out.
2. Sign in as `manager.sarah@company.com` (Password: `Password123!`).
3. View the graphical dashboard charts. Proceed to the "Team Reports" datatable below.
4. Filter by **"Pending Review"** status to track down Alice's report.
5. Click **"Review"**. You cannot edit this report, but you have action buttons.
6. Click **"Request Changes"**, provide a comment, and complete the dialogue.

_(Alice can now log back in, see the Action Alert on her Dashboard, update her items, and resubmit, resulting in a Version 2 snapshot created safely)._

---

## 22. Screens / Pages Implemented

- `/login`
- `/register`
- `/dashboard` (Team Member Experience)
- `/manager/dashboard` (Manager Experience/Analytics)
- `/reports/new` (Report Form generation interface)
- `/reports/[id]` (Task View/Report Detail)
- `/reports` (Personal Report History datatable)
- `/manager/reports/[id]` (Review Module view)
- `/projects` (Entity Management)
- `/admin/users` (RBAC Control panel)
- `/profile` (Config and Stats)

---

## 23. Design & UI

The application employs **Tailwind CSS** heavily fused with **shadcn/ui** to generate a polished, highly responsive SaaS-tier workspace. We utilize `React Hook Form` tied tightly to strictly modeled forms providing instant invalidation states on fields. It implements proper loading states `<Loader2/>` and dynamic Badges correlating status integers beautifully across displays (Mobile-friendly nested tables).

---

## 24. Development Commands

| Command                  | Location | Purpose                       |
| ------------------------ | -------- | ----------------------------- |
| `npm install`            | frontend | Install frontend dependencies |
| `npm run dev`            | frontend | Start Next.js server          |
| `npm run build`          | frontend | Verify production build       |
| `npm install`            | backend  | Install backend dependencies  |
| `npm run dev`            | backend  | Start Express server          |
| `npm run build`          | backend  | Build backend assets          |
| `npx prisma generate`    | backend  | Generate Prisma client        |
| `npx prisma migrate dev` | backend  | Apply DB migrations           |
| `npx prisma db seed`     | backend  | Populate test data DB         |
| `npm run test`           | backend  | Run Jest tests                |

---

## 25. Troubleshooting

### MySQL connection error / Error P1001

- Verify your XAMPP MySQL process is active.
- Ensure your `weekly_report_generator` database is manually created.
- Examine your `backend/.env` file. If running XAMPP, password should likely be blank (`mysql://root:@localhost:3306...`)

### Missing Prisma Client Definitions

If TypeScript is throwing errors on relations in backend, run `npx prisma generate` and restart the TS server via VSCode.

### EADDRINUSE: "Port already in use"

Update the ENV file and the base URL on the opposing framework client. For example, change `PORT=5001` on server, then change `NEXT_PUBLIC_API_URL=http://localhost:5001/api` on the frontend `.env.local` to circumvent ports locked by other node apps.

---

## 26. Production / Deployment Notes

- Frontend Next.js application is cleanly deployable to Vercel/Netlify.
- Express API operates on standard Dockerized systems or standard PM2 instances.
- Ensure all `.env` setups are updated via secure panel parameters (like Vercel Secrets), and Database URLs switch to scalable DBs.
- Production applications should replace the `JWT_SECRET` string securely and ensure frontend URL origins are perfectly matched for CORS.

---

## 27. Technical Assessment Notes

This project was implemented as a full-stack application with a clear separation between the Next.js frontend and Express.js backend.

The backend exposes REST APIs and enforces role-based authorization at the API layer. The frontend consumes these APIs and provides separate workflows for Team Members and Managers/Admins.

The report review workflow preserves report versions so that correction cycles can be reviewed historically.

---

## Future Improvements

- AI-powered report summaries and AI manager assistant insights
- Automated email review & deadline notification engine
- Advanced chart analytics covering historical tracking per project
- Direct export formats to Excel or PDF for Board decks
- SSO/SAML support for Enterprise Azure/Okta setups

---

## Author

Ishan Chinthaka

Full Stack Developer
