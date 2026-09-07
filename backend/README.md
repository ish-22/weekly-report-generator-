# Weekly Report Generator & Team Dashboard - Backend API

Production-quality Node.js, Express, TypeScript, and Prisma ORM REST API built for the Weekly Report Generator & Team Dashboard assessment.

---

## 1. Backend Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema & entity definitions
│   └── seed.ts             # Realistic database seed data script
├── src/
│   ├── __tests__/          # Automated Jest & Supertest suites
│   │   ├── auth.test.ts
│   │   ├── report-rbac.test.ts
│   │   └── report-workflow.test.ts
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts          # Environment variables configuration
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── project.controller.ts
│   │   ├── report.controller.ts
│   │   ├── manager.controller.ts
│   │   └── dashboard.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── project.service.ts
│   │   ├── report.service.ts
│   │   ├── manager.service.ts
│   │   └── dashboard.service.ts
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── project.repository.ts
│   │   ├── report.repository.ts
│   │   ├── version.repository.ts
│   │   └── review.repository.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── project.routes.ts
│   │   ├── report.routes.ts
│   │   ├── manager.routes.ts
│   │   └── dashboard.routes.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT verification
│   │   ├── rbac.middleware.ts    # Role & Ownership access guards
│   │   ├── validate.middleware.ts# Zod request validation
│   │   └── error.middleware.ts   # Centralized error handler
│   ├── validators/               # Zod request schemas
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   ├── project.validator.ts
│   │   └── report.validator.ts
│   ├── utils/
│   │   ├── api-response.util.ts  # Standard JSON response wrappers
│   │   ├── errors.util.ts        # Custom HTTP error classes
│   │   ├── jwt.util.ts           # JWT token generator/verifier
│   │   └── password.util.ts      # Bcrypt password hashing
│   ├── types/
│   │   ├── express.d.ts          # Express Request augmentation
│   │   └── auth.types.ts
│   ├── lib/
│   │   └── prisma.lib.ts         # Singleton Prisma client instance
│   ├── app.ts                    # Express app initialization
│   └── server.ts                 # Server entry point & graceful shutdown
├── .env                          # Local environment variables
├── .env.example
├── jest.config.js                # Jest test runner configuration
├── package.json
└── tsconfig.json
```

---

## 2. Setup & Installation Instructions

### Step 1: XAMPP MySQL Setup
1. Open **XAMPP Control Panel**.
2. Start the **MySQL** service (Port `3306`).
3. Open `http://localhost/phpmyadmin` in your web browser.
4. Click **New** and create a database named:
   ```sql
   CREATE DATABASE weekly_report_db;
   ```

### Step 2: Environment Variables (`.env`)
Verify `.env` in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
DATABASE_URL="mysql://root:@localhost:3306/weekly_report_db"
JWT_SECRET=super_secret_jwt_access_key_weekly_report_2026_dev
JWT_EXPIRES_IN=1d
SALT_ROUNDS=12
```

### Step 3: Run Database Migrations & Seed Data
Navigate to the `backend` folder and run:
```bash
# Push schema to MySQL database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Execute Seed Script
npm run prisma:seed
```

### Step 4: Start the Backend API Server
```bash
# Development mode with hot reload
npm run dev

# Production build & start
npm run build
npm start
```
The API server will run at: `http://localhost:5000`

---

## 3. Seed Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@company.com` | `Password123!` | Full Admin & User Management |
| **MANAGER** | `manager.sarah@company.com` | `Password123!` | Engineering Manager Review |
| **MANAGER** | `manager.david@company.com` | `Password123!` | Product Manager Review |
| **TEAM MEMBER** | `dev.alice@company.com` | `Password123!` | Frontend Engineer Reports |
| **TEAM MEMBER** | `dev.bob@company.com` | `Password123!` | Backend Engineer Reports |
| **TEAM MEMBER** | `dev.charlie@company.com` | `Password123!` | Fullstack Developer Reports |
| **TEAM MEMBER** | `dev.diana@company.com` | `Password123!` | QA Engineer Reports |
| **TEAM MEMBER** | `dev.evan@company.com` | `Password123!` | DevOps Engineer Reports |

---

## 4. API Endpoints Documentation

All request headers for authenticated endpoints must include:
`Authorization: Bearer <JWT_TOKEN>`

### Auth Module (`/api/auth`)

#### 1. `POST /api/auth/register`
- **Auth Required**: No
- **Role Required**: None
- **Request Body**:
  ```json
  {
    "email": "dev.new@company.com",
    "password": "Password123!",
    "fullName": "New Software Engineer"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "uuid-string",
        "email": "dev.new@company.com",
        "fullName": "New Software Engineer",
        "role": "TEAM_MEMBER"
      },
      "token": "jwt-token-string"
    }
  }
  ```
- **Error Cases**: `400` (Validation error), `409` (Email already exists).

#### 2. `POST /api/auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "dev.alice@company.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK)**: Returns user DTO + Bearer JWT token.
- **Error Cases**: `401` (Invalid credentials or account deactivated).

#### 3. `GET /api/auth/me`
- **Auth Required**: Yes
- **Response (200 OK)**: Returns authenticated user profile.

---

### Team Member Reports Module (`/api/reports`)

#### 1. `POST /api/reports`
- **Auth Required**: Yes
- **Role Required**: `TEAM_MEMBER`, `MANAGER`, `ADMIN`
- **Request Body**:
  ```json
  {
    "projectId": "project-uuid",
    "weekStartDate": "2026-09-08",
    "weekEndDate": "2026-09-14",
    "tasksPlannedNextWeek": "Complete UI integration",
    "blockers": "Third-party rate limits",
    "isKeyBlocker": true,
    "achievements": "DB schema finalized",
    "isKeyAchievement": true,
    "optionalNotes": "PR link",
    "tasks": [
      {
        "name": "Design Prisma Schema",
        "priority": "HIGH",
        "taskType": "DEVELOPMENT",
        "status": "COMPLETED",
        "plannedPercentage": 100,
        "actualPercentage": 100,
        "plannedHours": 16,
        "timeSpentHours": 14,
        "outputDeliverable": "https://github.com/org/repo/pull/1"
      }
    ]
  }
  ```
- **Response (201 Created)**: Returns report object in `DRAFT` status.

#### 2. `GET /api/reports/my-reports`
- **Auth Required**: Yes
- **Query Parameters**: `?page=1&limit=10&status=DRAFT&projectId=...`
- **Response (200 OK)**: Paginated list of user's own reports.

#### 3. `GET /api/reports/:id`
- **Auth Required**: Yes
- **Tenant Enforcement**: Users can ONLY access their own reports (`403 Forbidden` if attempting to view another user's report).

#### 4. `PUT /api/reports/:id`
- **Auth Required**: Yes
- **Workflow Guard**: Editable ONLY when report status is `DRAFT` or `NEEDS_CORRECTION` (`400 Bad Request` if `SUBMITTED` or `APPROVED`).

#### 5. `POST /api/reports/:id/submit`
- **Auth Required**: Yes
- **Workflow Guard**: Transitions status from `DRAFT` or `NEEDS_CORRECTION` to `SUBMITTED`.
- **Version Snapshot**: Generates an immutable snapshot row in `report_versions`.

#### 6. `GET /api/reports/:id/versions`
- **Auth Required**: Yes
- **Response (200 OK)**: List of historic submission versions.

---

### Manager Review Module (`/api/manager`)

#### 1. `GET /api/manager/reports`
- **Auth Required**: Yes
- **Role Required**: `MANAGER`, `ADMIN` (`403 Forbidden` if accessed by `TEAM_MEMBER`)
- **Query Parameters**: `?page=1&limit=10&status=SUBMITTED&userId=...&projectId=...&startDate=2026-08-01&endDate=2026-09-30`
- **Response (200 OK)**: Filtered paginated list of team reports.

#### 2. `POST /api/manager/reports/:id/approve`
- **Auth Required**: Yes
- **Role Required**: `MANAGER`, `ADMIN`
- **Workflow Guard**: Only `SUBMITTED` reports can be approved.
- **Request Body**: `{ "comment": "Great job! Approved." }`
- **Effect**: Changes report status to `APPROVED` and records manager audit log in `review_histories`.

#### 3. `POST /api/manager/reports/:id/request-changes`
- **Auth Required**: Yes
- **Role Required**: `MANAGER`, `ADMIN`
- **Workflow Guard**: Only `SUBMITTED` reports can be requested for changes.
- **Request Body**: `{ "comment": "Please add task details for PayPal integration." }` (Mandatory comment).
- **Effect**: Changes status to `NEEDS_CORRECTION` and links comment to current `ReportVersion`.

---

### Dashboard & Analytics (`/api/dashboard`)

#### 1. `GET /api/dashboard/metrics`
- **Auth Required**: Yes
- **Role Required**: `MANAGER`, `ADMIN`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "currentWeekStart": "2026-09-07",
      "totalTeamMembers": 5,
      "submittedThisWeek": 4,
      "complianceRate": 80,
      "pendingReviewCount": 2,
      "needsCorrectionCount": 1,
      "approvedCount": 5,
      "openBlockersCount": 1,
      "totalHoursLoggedThisWeek": 142.5
    }
  }
  ```

#### 2. `GET /api/dashboard/analytics`
- **Auth Required**: Yes
- **Role Required**: `MANAGER`, `ADMIN`
- **Response (200 OK)**: Returns time breakdown by task type, project workload, task status distribution, and recent audit activities.

---

### Project Management (`/api/projects`)

- `GET /api/projects`: List active projects (Accessible by all users)
- `POST /api/projects`: Create project (`MANAGER`, `ADMIN`)
- `PUT /api/projects/:id`: Update project (`MANAGER`, `ADMIN`)
- `DELETE /api/projects/:id`: Archive project (`MANAGER`, `ADMIN`)

---

### User Administration (`/api/users`)

- `GET /api/users`: List team members (`MANAGER`, `ADMIN`)
- `GET /api/users/:id`: Get user profile (`MANAGER`, `ADMIN`)
- `PATCH /api/users/:id/role`: Change user role (`ADMIN` only)
- `PATCH /api/users/:id/status`: Deactivate/activate user (`ADMIN` only)

---

## 5. Explanation of RBAC Implementation

1. **Token Payload Authentication**: Every request passes through `authenticate` middleware, which decodes JWT and populates `req.user = { userId, email, role, roleId }`.
2. **Role Gatekeeping**: Middleware `requireRole('MANAGER', 'ADMIN')` asserts role membership on restricted endpoints.
3. **Tenant Isolation**: Backend enforces `report.userId === req.user.userId` for team members. Backend never trusts `userId` supplied in request bodies for tenant operations.

---

## 6. Explanation of Report Workflow & State Machine

```
                 +-----------------------------------+
                 |                                   |
                 v                                   |
            +---------+    Submit Report       +-----------+
            |  DRAFT  |----------------------->| SUBMITTED |
            +---------+                        +-----------+
                 ^                                   |
                 |                                   | Manager Reviews
                 | Manager Requests Changes          |
                 | (with comment)                    +----------------------+
                 |                                   |                      |
                 |                                   v (Action: Approve)    v (Action: Request Changes)
        +------------------+                   +-----------+          +------------------+
        | NEEDS_CORRECTION |                   |  APPROVED |          | NEEDS_CORRECTION |
        +------------------+                   +-----------+          +------------------+
                 |                                                              |
                 | Team Member Edits & Resubmits                                |
                 +--------------------------------------------------------------+
```

1. **Submission Snapshotting**: Every time a report moves to `SUBMITTED`, a transactional snapshot of the report and its tasks is frozen into `report_versions`.
2. **Immutability during Review**: Once in `SUBMITTED` or `APPROVED` status, Team Members CANNOT modify report content.
3. **Manager Role Boundary**: Managers CANNOT edit actual team member report content or tasks. Managers can only issue `Approve` or `Request Changes` review decisions.

---

## 7. Running Automated Tests

Run the full automated Jest test suite:
```bash
npm test
```
The test suite covers:
- Authentication & registration
- Tenant boundary enforcement (Team member accessing another user's report is rejected with 403 Forbidden)
- Role protection (Team member accessing manager routes is rejected with 403 Forbidden)
- Manager review flow (Approval and Request Changes)
- Invalid status transition rejection
