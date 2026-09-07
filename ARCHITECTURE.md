# Weekly Report Generator & Team Dashboard
## System Architecture & Technical Specification Document

---

## 1. Recommended Complete Folder Structure

A production-ready monorepo structure separating the backend (Express.js + TypeScript + Prisma ORM) and frontend (Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui + Recharts).

```
weekly-report-generator/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── env.ts
│   │   │   └── logger.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── report.controller.ts
│   │   │   ├── manager.controller.ts
│   │   │   └── dashboard.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── project.service.ts
│   │   │   ├── report.service.ts
│   │   │   ├── version.service.ts
│   │   │   ├── review.service.ts
│   │   │   └── dashboard.service.ts
│   │   ├── repositories/
│   │   │   ├── user.repository.ts
│   │   │   ├── project.repository.ts
│   │   │   ├── report.repository.ts
│   │   │   ├── version.repository.ts
│   │   │   └── review.repository.ts
│   │   ├── routes/
│   │   │   ├── index.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── project.routes.ts
│   │   │   ├── report.routes.ts
│   │   │   ├── manager.routes.ts
│   │   │   └── dashboard.routes.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rbac.middleware.ts
│   │   │   ├── validate.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── validators/
│   │   │   ├── auth.validator.ts
│   │   │   ├── user.validator.ts
│   │   │   ├── project.validator.ts
│   │   │   ├── report.validator.ts
│   │   │   └── review.validator.ts
│   │   ├── utils/
│   │   │   ├── jwt.util.ts
│   │   │   ├── password.util.ts
│   │   │   ├── api-response.util.ts
│   │   │   └── errors.util.ts
│   │   ├── types/
│   │   │   ├── index.d.ts
│   │   │   ├── express.d.ts
│   │   │   └── auth.types.ts
│   │   ├── lib/
│   │   │   └── prisma.lib.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── public/
    │   └── favicon.ico
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/
    │   │   │   ├── login/
    │   │   │   │   └── page.tsx
    │   │   │   └── register/
    │   │   │       └── page.tsx
    │   │   ├── (dashboard)/
    │   │   │   ├── layout.tsx
    │   │   │   ├── dashboard/
    │   │   │   │   └── page.tsx
    │   │   │   ├── my-reports/
    │   │   │   │   ├── page.tsx
    │   │   │   │   ├── new/
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── [id]/
    │   │   │   │       ├── page.tsx
    │   │   │   │       └── edit/
    │   │   │   │           └── page.tsx
    │   │   │   ├── manager/
    │   │   │   │   ├── reports/
    │   │   │   │   │   ├── page.tsx
    │   │   │   │   │   └── [id]/
    │   │   │   │   │       └── page.tsx
    │   │   │   │   ├── team/
    │   │   │   │   │   ├── page.tsx
    │   │   │   │   │   └── [userId]/
    │   │   │   │   │       └── page.tsx
    │   │   │   │   └── projects/
    │   │   │   │       └── page.tsx
    │   │   │   └── admin/
    │   │   │       └── users/
    │   │   │           └── page.tsx
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── ui/               # shadcn/ui components (button, card, dialog, input, table, badge, select, etc.)
    │   │   ├── layout/
    │   │   │   ├── sidebar.tsx
    │   │   │   ├── navbar.tsx
    │   │   │   └── footer.tsx
    │   │   ├── reports/
    │   │   │   ├── report-form.tsx
    │   │   │   ├── task-item-form.tsx
    │   │   │   ├── report-status-badge.tsx
    │   │   │   ├── report-version-history.tsx
    │   │   │   ├── report-detail-view.tsx
    │   │   │   └── review-dialog.tsx
    │   │   ├── dashboard/
    │   │   │   ├── metrics-cards.tsx
    │   │   │   ├── hours-by-category-chart.tsx
    │   │   │   ├── submission-status-chart.tsx
    │   │   │   └── team-productivity-chart.tsx
    │   │   ├── shared/
    │   │   │   ├── page-header.tsx
    │   │   │   ├── data-table-filters.tsx
    │   │   │   └── confirm-dialog.tsx
    │   │   └── auth/
    │   │       ├── login-form.tsx
    │   │       └── register-form.tsx
    │   ├── hooks/
    │   │   ├── use-auth.ts
    │   │   ├── use-reports.ts
    │   │   ├── use-manager-reports.ts
    │   │   └── use-dashboard.ts
    │   ├── lib/
    │   │   ├── api-client.ts
    │   │   ├── auth-context.tsx
    │   │   ├── constants.ts
    │   │   └── utils.ts
    │   ├── services/
    │   │   ├── auth.service.ts
    │   │   ├── report.service.ts
    │   │   ├── manager.service.ts
    │   │   └── project.service.ts
    │   └── types/
    │       ├── auth.types.ts
    │       ├── report.types.ts
    │       ├── project.types.ts
    │       └── dashboard.types.ts
    ├── .env.example
    ├── components.json
    ├── next.config.js
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## 2. Database ER Relationship Explanation

```
 +---------------+         1:N         +---------------+
 |     Role      |-------------------->|     User      |
 +---------------+                     +---------------+
                                           |       |
                         1:N (Report Owner)|       | 1:N (Reviewer)
                                           v       v
 +---------------+         1:N         +---------------+         1:N         +------------------+
 |    Project    |-------------------->|    Report     |-------------------->|   ReportTask     |
 +---------------+                     +---------------+                     +------------------+
                                           |       |
                         1:N (Versions)    |       | 1:N (Reviews)
                                           v       v
                                       +---------------+ 1:N (Reviews bound)
                                       | ReportVersion |<--------------------+
                                       +---------------+                     |
                                                                             |
                                                                     +------------------+
                                                                     |  ReviewHistory   |
                                                                     +------------------+
```

### Entity Relationships & Rules:
1. **Role ↔ User (1:N)**: Each user is assigned exactly one Role (`TEAM_MEMBER`, `MANAGER`, or `ADMIN`). A role can be assigned to multiple users. Foreign key `roleId` uses `ON DELETE RESTRICT` to ensure system roles cannot be deleted while assigned to active users.
2. **User ↔ Report (1:N)**: A Team Member can create and own multiple reports over time. Each report belongs to exactly one user (`userId`).
3. **Project ↔ Report (1:N)**: A project/category can be referenced by many weekly reports. Each report references one primary project (`projectId`).
4. **Report ↔ ReportTask (1:N)**: A report contains 1 to many task breakdown entries detailing progress, effort, and deliverables. Tasks are dependent on the parent report (`ON DELETE CASCADE`).
5. **Report ↔ ReportVersion (1:N)**: A report can have multiple immutable version snapshots created automatically every time a report is submitted or resubmitted after correction.
6. **Report ↔ ReviewHistory (1:N)**: A report accumulates review actions (Approve, Request Changes with comment) over its lifecycle.
7. **User (Reviewer) ↔ ReviewHistory (1:N)**: Review actions record the manager's ID (`reviewerId`), providing full auditability for manager decisions.
8. **ReportVersion ↔ ReviewHistory (1:N)**: Each review action references the specific `ReportVersion` ID reviewed by the manager.

---

## 3. Complete Database Table Design

### Table 1: `roles`
*Stores system access roles.*

| Column Name | Data Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key | No | UUID v4 primary key |
| `name` | ENUM('TEAM_MEMBER', 'MANAGER', 'ADMIN') | Unique | No | Role name identifier |
| `description` | VARCHAR(255) | - | Yes | Human-readable explanation of permissions |
| `createdAt` | DATETIME(3) | Default: `NOW()` | No | Timestamp of creation |
| `updatedAt` | DATETIME(3) | Updated: `NOW()` | No | Timestamp of last modification |

*Indexes:*
- `PRIMARY KEY (id)`
- `UNIQUE INDEX roles_name_key (name)`

---

### Table 2: `users`
*Stores authenticated application users.*

| Column Name | Data Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key | No | UUID v4 primary key |
| `email` | VARCHAR(191) | Unique | No | User email address used for auth login |
| `passwordHash` | VARCHAR(255) | - | No | Bcrypt hashed password string |
| `fullName` | VARCHAR(100) | - | No | Full display name of the user |
| `roleId` | VARCHAR(36) | Foreign Key -> `roles(id)` | No | Assigned system role |
| `avatarUrl` | VARCHAR(255) | - | Yes | Optional profile avatar link |
| `isActive` | BOOLEAN | Default: `true` | No | Flag indicating if account is active |
| `createdAt` | DATETIME(3) | Default: `NOW()` | No | Registration timestamp |
| `updatedAt` | DATETIME(3) | Updated: `NOW()` | No | Timestamp of last profile update |

*Indexes & Foreign Keys:*
- `PRIMARY KEY (id)`
- `UNIQUE INDEX users_email_key (email)`
- `INDEX users_roleId_idx (roleId)`
- `FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE`

---

### Table 3: `projects`
*Stores projects/categories against which work reports are submitted.*

| Column Name | Data Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key | No | UUID v4 primary key |
| `name` | VARCHAR(100) | Unique | No | Project name (e.g. Enterprise Portal) |
| `code` | VARCHAR(20) | Unique | No | Project code identifier (e.g. EP-01) |
| `description` | TEXT | - | Yes | Overview of project scope |
| `isActive` | BOOLEAN | Default: `true` | No | Enables archiving inactive projects |
| `createdAt` | DATETIME(3) | Default: `NOW()` | No | Creation timestamp |
| `updatedAt` | DATETIME(3) | Updated: `NOW()` | No | Modification timestamp |

*Indexes:*
- `PRIMARY KEY (id)`
- `UNIQUE INDEX projects_name_key (name)`
- `UNIQUE INDEX projects_code_key (code)`

---

### Table 4: `reports`
*Stores master report records created by team members.*

| Column Name | Data Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key | No | UUID v4 primary key |
| `userId` | VARCHAR(36) | Foreign Key -> `users(id)` | No | Owner Team Member |
| `projectId` | VARCHAR(36) | Foreign Key -> `projects(id)` | No | Project/category classification |
| `weekStartDate` | DATE | - | No | First day of reporting week (Monday) |
| `weekEndDate` | DATE | - | No | Last day of reporting week (Sunday) |
| `status` | ENUM('DRAFT', 'SUBMITTED', 'NEEDS_CORRECTION', 'APPROVED') | Default: `DRAFT` | No | Current workflow status |
| `currentVersionNumber` | INT | Default: `1` | No | Active revision iteration counter |
| `tasksPlannedNextWeek` | TEXT | - | Yes | Text summary of upcoming week goals |
| `blockers` | TEXT | - | Yes | Key challenges encountered |
| `isKeyBlocker` | BOOLEAN | Default: `false` | No | Flag highlighting urgent blocker |
| `achievements` | TEXT | - | Yes | Highlights & major accomplishments |
| `isKeyAchievement` | BOOLEAN | Default: `false` | No | Flag highlighting major win |
| `optionalNotes` | TEXT | - | Yes | Additional references, documentation links |
| `createdAt` | DATETIME(3) | Default: `NOW()` | No | Creation timestamp |
| `updatedAt` | DATETIME(3) | Updated: `NOW()` | No | Last change timestamp |

*Indexes & Constraints:*
- `PRIMARY KEY (id)`
- `INDEX reports_userId_idx (userId)`
- `INDEX reports_projectId_idx (projectId)`
- `INDEX reports_status_idx (status)`
- `INDEX reports_weekStartDate_idx (weekStartDate)`
- `UNIQUE INDEX reports_userId_weekStartDate_projectId_key (userId, weekStartDate, projectId)` *(Prevents duplicate reports for same project in same week)*
- `FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE`
- `FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE RESTRICT ON UPDATE CASCADE`

---

### Table 5: `report_tasks`
*Stores task granular breakdown for active report state.*

| Column Name | Data Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key | No | UUID v4 primary key |
| `reportId` | VARCHAR(36) | Foreign Key -> `reports(id)` | No | Parent report ID |
| `name` | VARCHAR(255) | - | No | Task summary / description |
| `priority` | ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') | Default: `MEDIUM` | No | Task urgency level |
| `taskType` | ENUM('DEVELOPMENT', 'TESTING', 'MEETING', 'DOCUMENTATION', 'DESIGN', 'RESEARCH', 'OTHER') | Default: `DEVELOPMENT` | No | Categorization of task activity |
| `status` | ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED') | Default: `IN_PROGRESS` | No | Execution state |
| `plannedPercentage` | DECIMAL(5,2) | Default: `100.00` | No | Expected completion % (0-100) |
| `actualPercentage` | DECIMAL(5,2) | Default: `0.00` | No | Realized completion % (0-100) |
| `plannedHours` | DECIMAL(5,2) | Default: `0.00` | No | Estimated effort in hours |
| `timeSpentHours` | DECIMAL(5,2) | Default: `0.00` | No | Actual hours logged |
| `outputDeliverable` | VARCHAR(255) | - | Yes | Link to PR, Jira ticket, doc, or outcome |
| `createdAt` | DATETIME(3) | Default: `NOW()` | No | Creation timestamp |
| `updatedAt` | DATETIME(3) | Updated: `NOW()` | No | Last update timestamp |

*Indexes & Foreign Keys:*
- `PRIMARY KEY (id)`
- `INDEX report_tasks_reportId_idx (reportId)`
- `FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE ON UPDATE CASCADE`

---

### Table 6: `report_versions`
*Stores immutable historical snapshots of a report at the exact moment of submission.*

| Column Name | Data Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key | No | UUID v4 primary key |
| `reportId` | VARCHAR(36) | Foreign Key -> `reports(id)` | No | Target master report |
| `versionNumber` | INT | - | No | Monotonically increasing revision number (1, 2, 3...) |
| `snapshotData` | JSON | - | No | Complete JSON payload containing report metadata + all tasks array at submission time |
| `statusAtSubmission` | ENUM('SUBMITTED') | Default: `SUBMITTED` | No | Status when frozen |
| `submittedAt` | DATETIME(3) | Default: `NOW()` | No | Submission timestamp |
| `submittedByUserId` | VARCHAR(36) | Foreign Key -> `users(id)` | No | User who submitted this version |

*Indexes & Constraints:*
- `PRIMARY KEY (id)`
- `INDEX report_versions_reportId_idx (reportId)`
- `UNIQUE INDEX report_versions_reportId_versionNumber_key (reportId, versionNumber)`
- `FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE ON UPDATE CASCADE`
- `FOREIGN KEY (submittedByUserId) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE`

---

### Table 7: `review_histories`
*Stores audit logs of manager actions (Approve / Request Changes) tied to specific report versions.*

| Column Name | Data Type | Constraints | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key | No | UUID v4 primary key |
| `reportId` | VARCHAR(36) | Foreign Key -> `reports(id)` | No | Target master report |
| `reportVersionId` | VARCHAR(36) | Foreign Key -> `report_versions(id)` | No | Specific snapshot version reviewed |
| `reviewerId` | VARCHAR(36) | Foreign Key -> `users(id)` | No | Manager/Admin who performed review |
| `action` | ENUM('APPROVED', 'REQUESTED_CHANGES') | - | No | Action decision |
| `comment` | TEXT | - | Yes | Reviewer feedback or general comment |
| `createdAt` | DATETIME(3) | Default: `NOW()` | No | Timestamp of review action |

*Indexes & Foreign Keys:*
- `PRIMARY KEY (id)`
- `INDEX review_histories_reportId_idx (reportId)`
- `INDEX review_histories_reportVersionId_idx (reportVersionId)`
- `INDEX review_histories_reviewerId_idx (reviewerId)`
- `FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE ON UPDATE CASCADE`
- `FOREIGN KEY (reportVersionId) REFERENCES report_versions(id) ON DELETE CASCADE ON UPDATE CASCADE`
- `FOREIGN KEY (reviewerId) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE`

---

## 4. Prisma Schema (`prisma/schema.prisma`)

```prisma
// backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ------------------------------------------------------
// Enums
// ------------------------------------------------------

enum RoleName {
  TEAM_MEMBER
  MANAGER
  ADMIN
}

enum ReportStatus {
  DRAFT
  SUBMITTED
  NEEDS_CORRECTION
  APPROVED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum TaskStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  BLOCKED
}

enum TaskType {
  DEVELOPMENT
  TESTING
  MEETING
  DOCUMENTATION
  DESIGN
  RESEARCH
  OTHER
}

enum ReviewAction {
  APPROVED
  REQUESTED_CHANGES
}

// ------------------------------------------------------
// Models
// ------------------------------------------------------

model Role {
  id          String   @id @default(uuid())
  name        RoleName @unique
  description String?  @db.VarChar(255)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users User[]

  @@map("roles")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique @db.VarChar(191)
  passwordHash String   @db.VarChar(255)
  fullName     String   @db.VarChar(100)
  roleId       String
  avatarUrl    String?  @db.VarChar(255)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  role              Role            @relation(fields: [roleId], references: [id], onDelete: Restrict, onUpdate: Cascade)
  reports           Report[]        @relation("UserReports")
  submittedVersions ReportVersion[] @relation("UserSubmittedVersions")
  reviewsGiven      ReviewHistory[] @relation("ReviewerHistories")

  @@index([roleId])
  @@map("users")
}

model Project {
  id          String   @id @default(uuid())
  name        String   @unique @db.VarChar(100)
  code        String   @unique @db.VarChar(20)
  description String?  @db.Text
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  reports Report[]

  @@map("projects")
}

model Report {
  id                   String       @id @default(uuid())
  userId               String
  projectId            String
  weekStartDate        DateTime     @db.Date
  weekEndDate          DateTime     @db.Date
  status               ReportStatus @default(DRAFT)
  currentVersionNumber Int          @default(1)
  tasksPlannedNextWeek String?      @db.Text
  blockers             String?      @db.Text
  isKeyBlocker         Boolean      @default(false)
  achievements         String?      @db.Text
  isKeyAchievement     Boolean      @default(false)
  optionalNotes        String?      @db.Text
  createdAt            DateTime     @default(now())
  updatedAt            DateTime     @updatedAt

  user            User            @relation("UserReports", fields: [userId], references: [id], onDelete: Restrict, onUpdate: Cascade)
  project         Project         @relation(fields: [projectId], references: [id], onDelete: Restrict, onUpdate: Cascade)
  tasks           ReportTask[]
  versions        ReportVersion[]
  reviewHistories ReviewHistory[]

  @@unique([userId, weekStartDate, projectId], name: "user_week_project_unique")
  @@index([userId])
  @@index([projectId])
  @@index([status])
  @@index([weekStartDate])
  @@map("reports")
}

model ReportTask {
  id                String       @id @default(uuid())
  reportId          String
  name              String       @db.VarChar(255)
  priority          TaskPriority @default(MEDIUM)
  taskType          TaskType     @default(DEVELOPMENT)
  status            TaskStatus   @default(IN_PROGRESS)
  plannedPercentage Decimal      @default(100.00) @db.Decimal(5, 2)
  actualPercentage  Decimal      @default(0.00) @db.Decimal(5, 2)
  plannedHours      Decimal      @default(0.00) @db.Decimal(5, 2)
  timeSpentHours    Decimal      @default(0.00) @db.Decimal(5, 2)
  outputDeliverable String?      @db.VarChar(255)
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  report Report @relation(fields: [reportId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@index([reportId])
  @@map("report_tasks")
}

model ReportVersion {
  id                 String       @id @default(uuid())
  reportId           String
  versionNumber      Int
  snapshotData       Json
  statusAtSubmission ReportStatus @default(SUBMITTED)
  submittedAt        DateTime     @default(now())
  submittedByUserId  String

  report          Report          @relation(fields: [reportId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  submittedByUser User            @relation("UserSubmittedVersions", fields: [submittedByUserId], references: [id], onDelete: Restrict, onUpdate: Cascade)
  reviews         ReviewHistory[]

  @@unique([reportId, versionNumber])
  @@index([reportId])
  @@map("report_versions")
}

model ReviewHistory {
  id              String       @id @default(uuid())
  reportId        String
  reportVersionId String
  reviewerId      String
  action          ReviewAction
  comment         String?      @db.Text
  createdAt       DateTime     @default(now())

  report        Report        @relation(fields: [reportId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  reportVersion ReportVersion @relation(fields: [reportVersionId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  reviewer      User          @relation("ReviewerHistories", fields: [reviewerId], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@index([reportId])
  @@index([reportVersionId])
  @@index([reviewerId])
  @@map("review_histories")
}
```

---

## 5. Explanation of Every Relationship

1. **`Role` ↔ `User` (One-to-Many)**:
   - Defined via `User.roleId` referencing `Role.id`.
   - `onDelete: Restrict` prevents accidental deletion of system roles while users are assigned to them.
2. **`User` ↔ `Report` (One-to-Many as Owner)**:
   - Defined via `Report.userId` referencing `User.id`.
   - Explicit named relation `@relation("UserReports")`.
   - A team member owns their report. Strict RBAC check asserts `report.userId === currentUser.id`.
3. **`Project` ↔ `Report` (One-to-Many)**:
   - Defined via `Report.projectId` referencing `Project.id`.
   - `onDelete: Restrict` ensures active/historical reports cannot lose project tracking.
4. **`Report` ↔ `ReportTask` (One-to-Many)**:
   - Defined via `ReportTask.reportId` referencing `Report.id`.
   - `onDelete: Cascade` ensures deleting a draft report automatically cleans up associated tasks.
5. **`Report` ↔ `ReportVersion` (One-to-Many)**:
   - Defined via `ReportVersion.reportId` referencing `Report.id`.
   - Each submission appends a new version row. Unique constraint `@@unique([reportId, versionNumber])` enforces sequence integrity.
6. **`User` ↔ `ReportVersion` (One-to-Many as Submitter)**:
   - Defined via `ReportVersion.submittedByUserId` referencing `User.id`.
   - Explicit named relation `@relation("UserSubmittedVersions")`. Tracks identity of who submitted each specific version.
7. **`Report` ↔ `ReviewHistory` (One-to-Many)**:
   - Defined via `ReviewHistory.reportId` referencing `Report.id`.
   - Tracks manager review logs associated with the report.
8. **`ReportVersion` ↔ `ReviewHistory` (One-to-Many)**:
   - Defined via `ReviewHistory.reportVersionId` referencing `ReportVersion.id`.
   - Ensures feedback comments are linked to the specific revision snapshot reviewed by the manager.
9. **`User` ↔ `ReviewHistory` (One-to-Many as Reviewer)**:
   - Defined via `ReviewHistory.reviewerId` referencing `User.id`.
   - Named relation `@relation("ReviewerHistories")`. Establishes manager audit accountability for approvals and change requests.

---

## 6. Recommended API Module Structure

All REST endpoints are prefixed with `/api/v1`.

### Auth Module (`/api/v1/auth`)
- `POST /register`: Registers new team members (validates payload, hashes password).
- `POST /login`: Authenticates user credential, returns JWT access token + user object.
- `POST /logout`: Clears authentication session.
- `GET /me`: Fetches active authenticated user profile & role.

### User Management Module (`/api/v1/users`) - *Manager/Admin only*
- `GET /`: List all team members & managers with filters.
- `GET /:id`: Detailed profile of a specific user.
- `PATCH /:id/role`: Update user role (`ADMIN` only).
- `PATCH /:id/status`: Toggle user account active status.

### Project Module (`/api/v1/projects`)
- `GET /`: List all active projects (accessible by all authenticated users for selection).
- `POST /`: Create project (`MANAGER`, `ADMIN`).
- `PUT /:id`: Update project details (`MANAGER`, `ADMIN`).
- `DELETE /:id`: Archive/deactivate project (`MANAGER`, `ADMIN`).

### Team Member Report Module (`/api/v1/reports`) - *Tenant Isolated*
- `GET /my-reports`: List current user's reports with pagination, status & date range filters.
- `POST /`: Create new report in `DRAFT` status.
- `GET /:id`: Get user's own report by ID (includes current tasks, version history, manager comments).
- `PUT /:id`: Update draft/needs-correction report content and task items.
- `POST /:id/submit`: Transition report from `DRAFT` or `NEEDS_CORRECTION` to `SUBMITTED`. Generates `ReportVersion` snapshot.
- `GET /:id/versions`: Fetch version history list for user's report.
- `GET /:id/versions/:versionNumber`: View exact historic snapshot of report version.

### Manager Review Module (`/api/v1/manager/reports`) - *Manager/Admin only*
- `GET /`: List all reports across team members with multi-criteria filtering (status, week, team member ID, project ID, date range).
- `GET /:id`: Open & inspect submitted report details.
- `POST /:id/approve`: Approve submitted report (`SUBMITTED` -> `APPROVED`). Creates `ReviewHistory` entry.
- `POST /:id/request-changes`: Request changes with required comment (`SUBMITTED` -> `NEEDS_CORRECTION`). Creates `ReviewHistory` entry.

### Dashboard & Analytics Module (`/api/v1/dashboard`)
- `GET /metrics`: Aggregated KPI counters (Total Submitted, Pending Review, Needs Correction, Total Hours Logged this week).
- `GET /analytics/hours-by-category`: Work hours broken down by task type (`DEVELOPMENT`, `TESTING`, `MEETING`, etc.).
- `GET /analytics/submission-status`: Submission status breakdown by week/team.
- `GET /analytics/team-productivity`: Task completion rates and highlight trends.

---

## 7. Authentication Architecture

```
Client (Next.js)                         Express Server                      Database
   |                                           |                                |
   |--- POST /api/v1/auth/login (email, pass)->|                                |
   |                                           |--- Fetch user by email ------->|
   |                                           |<-- Return User + Role + Hash --|
   |                                           |                                |
   |                                           |--- bcrypt.compare(pass, hash)  |
   |                                           |                                |
   |                                           |--- Sign JWT Access Token ------|
   |<-- 200 OK { token, user } ----------------|    (payload: id, email, role)  |
   |                                           |                                |
   |--- GET /api/v1/reports ------------------>|                                |
   |    Header: Authorization: Bearer <token>  |--- Verify JWT signature -------|
   |                                           |--- Attach req.user = payload --|
   |                                           |--- Route handler logic --------|
```

1. **Strategy**: Stateless JWT Authentication with Bearer tokens passed via HTTP `Authorization: Bearer <token>` header (or secure HTTP-Only cookies).
2. **Password Hashing**: `bcrypt` with `12` rounds of salt calculation.
3. **Payload Structure**:
   ```json
   {
     "userId": "uuid-v4-string",
     "email": "john@company.com",
     "role": "TEAM_MEMBER",
     "iat": 1725700000,
     "exp": 1725786400
   }
   ```
4. **Auth Middleware (`auth.middleware.ts`)**:
   - Extracts Bearer token from header.
   - Decodes & verifies signature via standard `JWT_SECRET`.
   - Attaches decoded token payload to `req.user`.
   - Rejects unauthenticated requests with HTTP 401 Unauthorized.

---

## 8. RBAC Architecture

### Role Matrix

| Capability / Route | TEAM_MEMBER | MANAGER | ADMIN |
| :--- | :---: | :---: | :---: |
| Register / Login / Logout | Yes | Yes | Yes |
| View Own Reports | Yes | Yes (Own) | Yes (Own) |
| Create / Edit Own Draft Reports | Yes | Yes (Own) | Yes (Own) |
| Submit / Resubmit Own Reports | Yes | Yes (Own) | Yes (Own) |
| View All Team Members' Reports | **NO** | **YES** | **YES** |
| Approve / Request Changes on Reports | **NO** | **YES** | **YES** |
| Edit Team Member Report Content | **NO** | **NO** | **NO** |
| Manage Projects (Create/Edit) | **NO** | **YES** | **YES** |
| Manage Users & Assign Roles | **NO** | **NO** | **YES** |
| View Dashboard Charts & Metrics | Own Summary | Full Team | Full System |

### Middleware Implementation (`rbac.middleware.ts`)
1. **`requireRole(...allowedRoles: RoleName[])`**:
   - Asserts `allowedRoles.includes(req.user.role)`.
   - Returns 403 Forbidden if check fails.
2. **`requireOwnershipOrRole(...allowedRoles: RoleName[])`**:
   - Verifies if resource owner matches `req.user.userId`.
   - If not owner, verifies if `req.user.role` is in `allowedRoles` (e.g. `MANAGER`, `ADMIN`).
   - Rejects illegal tenant access (Team Member A trying to read/edit Team Member B's report).

---

## 9. Report Workflow Architecture

### State Transition Diagram

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

### Business Rules & Constraints:
1. **Team Member Capabilities**:
   - Can create report in `DRAFT` status.
   - Can edit report content ONLY when status is `DRAFT` or `NEEDS_CORRECTION`.
   - Submitting a report changes status to `SUBMITTED`, increments `currentVersionNumber`, and triggers snapshot creation in `report_versions`.
   - Once status is `SUBMITTED` or `APPROVED`, Team Member CANNOT modify report content or tasks.
2. **Manager Capabilities**:
   - Can view all reports in `SUBMITTED`, `NEEDS_CORRECTION`, or `APPROVED` states.
   - **STRICT PROHIBITION**: Manager MUST NOT edit actual report content, tasks, hours, or blockers.
   - Manager can approve report (`SUBMITTED` -> `APPROVED`) with optional comment.
   - Manager can request changes (`SUBMITTED` -> `NEEDS_CORRECTION`) with a mandatory comment.

---

## 10. Version History Architecture

### Historical Preservation Strategy

```
[Team Member Edits Draft] -> [Clicks Submit] 
                                    |
                                    v
            +-----------------------------------------------+
            | Transaction Execution (Prisma)               |
            |                                               |
            | 1. Update Report status = SUBMITTED           |
            | 2. Read current Report + Task list            |
            | 3. Construct JSON snapshot payload            |
            | 4. Create ReportVersion (versionNumber = N)   |
            | 5. If re-submitting after NEEDS_CORRECTION:   |
            |    increment currentVersionNumber by 1        |
            +-----------------------------------------------+
```

### Snapshot Structure stored in `report_versions.snapshotData`:
```json
{
  "reportId": "rep-uuid-101",
  "versionNumber": 2,
  "weekStartDate": "2026-09-01",
  "weekEndDate": "2026-09-07",
  "projectId": "proj-uuid-01",
  "projectName": "Enterprise Portal",
  "user": {
    "id": "usr-uuid-05",
    "fullName": "Alice Developer",
    "email": "alice@company.com"
  },
  "blockers": "API rate limits on third-party endpoint",
  "isKeyBlocker": true,
  "achievements": "Completed Auth Middleware & Prisma setup",
  "isKeyAchievement": true,
  "tasksPlannedNextWeek": "Complete UI integration",
  "optionalNotes": "PR #42 submitted",
  "tasks": [
    {
      "name": "Design DB schema and Prisma migrations",
      "priority": "HIGH",
      "taskType": "DEVELOPMENT",
      "status": "COMPLETED",
      "plannedPercentage": 100,
      "actualPercentage": 100,
      "plannedHours": 16.0,
      "timeSpentHours": 14.5,
      "outputDeliverable": "https://github.com/org/repo/pull/12"
    }
  ]
}
```

### Linking Review Comments:
When a Manager submits a review action (Approve / Request Changes):
1. The backend targets the report's current active `ReportVersion.id`.
2. A `ReviewHistory` record is created with:
   - `reportId`: master report reference
   - `reportVersionId`: exact version ID being reviewed
   - `reviewerId`: manager's user ID
   - `action`: `APPROVED` or `REQUESTED_CHANGES`
   - `comment`: Manager feedback

This ensures complete auditability: even if a report undergoes 5 iterations of correction, every historic version retains its exact snapshot and the exact comment given by the manager for that specific iteration.

---

## 11. Seed Data Strategy

`backend/prisma/seed.ts` populates a production-like local development environment:

### System Roles (3)
- `ADMIN`, `MANAGER`, `TEAM_MEMBER`

### Users (8 Total)
1. **1 Admin**: `admin@company.com` (Role: `ADMIN`, Password: `Password123!`)
2. **2 Managers**:
   - `manager.sarah@company.com` (Engineering Manager)
   - `manager.david@company.com` (Product Manager)
3. **5 Team Members**:
   - `dev.alice@company.com` (Frontend Engineer)
   - `dev.bob@company.com` (Backend Engineer)
   - `dev.charlie@company.com` (Fullstack Engineer)
   - `dev.diana@company.com` (QA Engineer)
   - `dev.evan@company.com` (DevOps Engineer)

### Projects / Categories (5 Total)
1. `PRJ-01`: **Enterprise Portal** (Next.js & Microservices redesign)
2. `PRJ-02`: **Mobile Banking App** (React Native client app)
3. `PRJ-03`: **Payment Gateway Integration** (Stripe & PayPal connector)
4. `PRJ-04`: **Cloud Migration & DevOps** (AWS Kubernetes cluster setup)
5. `PRJ-05`: **AI Reporting & Analytics Engine** (Data pipeline & dashboards)

### Reports & Version History (Multiple Weeks)
- **Draft Reports**: 2 reports created by Team Members in `DRAFT` status with task items filled out.
- **Submitted Reports**: 3 reports currently pending Manager review (`SUBMITTED` status, Version 1).
- **Needs Correction Reports**: 2 reports with version history (Version 1 submitted -> Manager requested changes with comments -> Report currently in `NEEDS_CORRECTION` status).
- **Approved Reports**: 5 reports across previous weeks with full approval history (`APPROVED` status, Version 1 & Version 2).

---

## 12. Environment Variables Required

### Backend Environment Variables (`backend/.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database Configuration (XAMPP MySQL Local)
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="mysql://root:@localhost:3306/weekly_report_db"

# JWT Authentication
JWT_SECRET=super_secret_jwt_access_key_weekly_report_2026_dev
JWT_EXPIRES_IN=1d

# BCrypt Salt Rounds
SALT_ROUNDS=12
```

### Frontend Environment Variables (`frontend/.env.local`)
```env
# API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 13. Step-by-Step Implementation Plan (Next Steps)

1. **Phase 1: Project & Database Initialization**
   - Initialize project repositories (`backend` and `frontend`).
   - Setup MySQL database `weekly_report_db` via XAMPP MySQL.
   - Configure Prisma ORM with `schema.prisma`, execute migrations, and run seed script (`prisma db seed`).

2. **Phase 2: Backend Core Architecture & Auth Setup**
   - Setup Express server with TypeScript, CORS, JSON parsing, error handling middleware.
   - Implement JWT authentication utility, `auth.service.ts`, `auth.controller.ts`, and `auth.middleware.ts`.
   - Build Zod validation schemas for registration and login endpoints.

3. **Phase 3: Backend Report Management & Versioning Service**
   - Build CRUD repositories and services for `Project` and `Report`.
   - Implement strict status guards: Draft creation, editing, task management.
   - Build transactional submission handler: snapshot generation into `ReportVersion`.
   - Implement Manager review services: Approval, Request Changes with comments, history query handlers.

4. **Phase 4: Backend RBAC, Filtering & Dashboard Metrics**
   - Enforce tenant boundary checks for Team Members (`userId` isolation).
   - Implement Manager query filters (week, team member, project, status, date range).
   - Implement aggregate metrics engine for dashboard charts (hours by category, submission counts, trends).

5. **Phase 5: Frontend Design System & Auth Context**
   - Initialize Next.js 14 App Router application with TypeScript and Tailwind CSS.
   - Install and configure `shadcn/ui` components (Button, Form, Card, Table, Badge, Dialog, Select, Toast).
   - Setup central API client (`axios`/`fetch` wrapper) and `AuthContext` with persistent token storage.

6. **Phase 6: Frontend Team Member Workflows**
   - Create Team Member Layout & Dashboard view.
   - Build Weekly Report Creation & Edit forms with dynamic task array handling (add/remove task items, hours calculator).
   - Implement submission, status badges, version history viewer modal, and manager comment displays.

7. **Phase 7: Frontend Manager & Admin Workflows**
   - Build Manager Layout & Team Overview dashboard.
   - Implement multi-filter Report Inspection table (Filter by Week, Member, Project, Status, Date).
   - Create Report Review modal (Approve / Request Changes with general feedback comment).
   - Build Version History inspection tab for managers to review historic snapshots alongside comments.
   - Create Project & User management views (`ADMIN` role).

8. **Phase 8: Analytics Dashboard & End-to-End Verification**
   - Integrate `Recharts` for visually striking charts (Hours worked by category, Weekly submission status breakdown, Team productivity metrics).
   - Perform end-to-end user workflow testing across all 3 roles (`TEAM_MEMBER`, `MANAGER`, `ADMIN`).
   - Validate security constraints, multi-tenant isolation, database transaction integrity, and responsive layout polish.
