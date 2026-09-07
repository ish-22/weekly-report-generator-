import { PrismaClient, RoleName, ReportStatus, TaskPriority, TaskType, TaskStatus, ReviewAction } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed script...');

  // 1. Seed Roles
  console.log('1️⃣ Seeding Roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: RoleName.ADMIN },
    update: {},
    create: {
      name: RoleName.ADMIN,
      description: 'System Administrator with full access and user management rights',
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: RoleName.MANAGER },
    update: {},
    create: {
      name: RoleName.MANAGER,
      description: 'Engineering / Product Manager with review, approval, and project management rights',
    },
  });

  const teamMemberRole = await prisma.role.upsert({
    where: { name: RoleName.TEAM_MEMBER },
    update: {},
    create: {
      name: RoleName.TEAM_MEMBER,
      description: 'Software Engineer / Contributor creating and submitting weekly work reports',
    },
  });

  // 2. Hash Default Password
  const passwordHash = await bcrypt.hash('Password123!', 12);

  // 3. Seed Users
  console.log('2️⃣ Seeding Users...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      passwordHash,
      fullName: 'System Administrator',
      roleId: adminRole.id,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
  });

  const manager1 = await prisma.user.upsert({
    where: { email: 'manager.sarah@company.com' },
    update: {},
    create: {
      email: 'manager.sarah@company.com',
      passwordHash,
      fullName: 'Sarah Jenkins (Engineering Manager)',
      roleId: managerRole.id,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
  });

  const manager2 = await prisma.user.upsert({
    where: { email: 'manager.david@company.com' },
    update: {},
    create: {
      email: 'manager.david@company.com',
      passwordHash,
      fullName: 'David Miller (Product Manager)',
      roleId: managerRole.id,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
  });

  const teamMembersData = [
    {
      email: 'dev.alice@company.com',
      fullName: 'Alice Frontend Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    },
    {
      email: 'dev.bob@company.com',
      fullName: 'Bob Backend Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    },
    {
      email: 'dev.charlie@company.com',
      fullName: 'Charlie Fullstack Developer',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    },
    {
      email: 'dev.diana@company.com',
      fullName: 'Diana QA Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    },
    {
      email: 'dev.evan@company.com',
      fullName: 'Evan DevOps Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    },
  ];

  const teamMembers = [];
  for (const tm of teamMembersData) {
    const user = await prisma.user.upsert({
      where: { email: tm.email },
      update: {},
      create: {
        email: tm.email,
        passwordHash,
        fullName: tm.fullName,
        roleId: teamMemberRole.id,
        avatarUrl: tm.avatarUrl,
      },
    });
    teamMembers.push(user);
  }

  // 4. Seed Projects
  console.log('3️⃣ Seeding Projects...');
  const projectsData = [
    {
      name: 'Enterprise Portal Redesign',
      code: 'PRJ-01',
      description: 'Migrating legacy monolith UI to modern Next.js 14 micro-frontend architecture.',
    },
    {
      name: 'Mobile Banking App v2',
      code: 'PRJ-02',
      description: 'React Native mobile application overhaul with biometric security integration.',
    },
    {
      name: 'Payment Gateway Integration',
      code: 'PRJ-03',
      description: 'Unified Stripe, PayPal, and Adyen multi-currency payment checkout system.',
    },
    {
      name: 'Cloud Migration & Kubernetes',
      code: 'PRJ-04',
      description: 'Infrastructure automation and EKS Kubernetes production cluster migration.',
    },
    {
      name: 'AI Reporting & Analytics Engine',
      code: 'PRJ-05',
      description: 'Real-time dashboard analytics pipeline using ClickHouse and LLM report insights.',
    },
  ];

  const projects = [];
  for (const p of projectsData) {
    const proj = await prisma.project.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
    projects.push(proj);
  }

  // 5. Seed Multi-Week Reports
  console.log('4️⃣ Seeding Weekly Reports, Tasks, Version Snapshots, and Review Histories...');

  // Week 1 Date Range: 2026-08-24 (Monday) to 2026-08-30 (Sunday)
  // Week 2 Date Range: 2026-08-31 (Monday) to 2026-09-06 (Sunday)
  const week1Start = new Date('2026-08-24');
  const week1End = new Date('2026-08-30');
  const week2Start = new Date('2026-08-31');
  const week2End = new Date('2026-09-06');

  // Report 1: Alice - Approved Report (Week 1)
  const reportAliceW1 = await prisma.report.create({
    data: {
      userId: teamMembers[0].id, // Alice
      projectId: projects[0].id, // Enterprise Portal
      weekStartDate: week1Start,
      weekEndDate: week1End,
      status: ReportStatus.APPROVED,
      currentVersionNumber: 1,
      tasksPlannedNextWeek: 'Complete dynamic sidebar navigation and dark mode toggle.',
      blockers: null,
      isKeyBlocker: false,
      achievements: 'Migrated 12 component stories to Tailwind CSS and completed accessible button components.',
      isKeyAchievement: true,
      optionalNotes: 'All Figma design tokens matched 100%.',
      tasks: {
        create: [
          {
            name: 'Refactor Navigation Header UI',
            priority: TaskPriority.HIGH,
            taskType: TaskType.DESIGN,
            status: TaskStatus.COMPLETED,
            plannedPercentage: 100,
            actualPercentage: 100,
            plannedHours: 16,
            timeSpentHours: 14.5,
            outputDeliverable: 'https://github.com/org/repo/pull/101',
          },
          {
            name: 'Set up shadcn UI components library',
            priority: TaskPriority.CRITICAL,
            taskType: TaskType.DEVELOPMENT,
            status: TaskStatus.COMPLETED,
            plannedPercentage: 100,
            actualPercentage: 100,
            plannedHours: 20,
            timeSpentHours: 22,
            outputDeliverable: 'https://github.com/org/repo/pull/102',
          },
        ],
      },
    },
    include: { tasks: true, user: true, project: true },
  });

  // Version 1 Snapshot for Alice Report
  const aliceV1 = await prisma.reportVersion.create({
    data: {
      reportId: reportAliceW1.id,
      versionNumber: 1,
      statusAtSubmission: ReportStatus.SUBMITTED,
      submittedByUserId: teamMembers[0].id,
      snapshotData: {
        reportId: reportAliceW1.id,
        versionNumber: 1,
        weekStartDate: week1Start,
        weekEndDate: week1End,
        projectId: projects[0].id,
        projectName: projects[0].name,
        user: { id: teamMembers[0].id, fullName: teamMembers[0].fullName, email: teamMembers[0].email },
        achievements: reportAliceW1.achievements,
        tasks: reportAliceW1.tasks,
      },
    },
  });

  // Review History for Alice Approved Report
  await prisma.reviewHistory.create({
    data: {
      reportId: reportAliceW1.id,
      reportVersionId: aliceV1.id,
      reviewerId: manager1.id,
      action: ReviewAction.APPROVED,
      comment: 'Excellent work on the UI migration. Clean implementation!',
    },
  });

  // Report 2: Bob - Needs Correction & Version History Iteration (Week 1)
  const reportBobW1 = await prisma.report.create({
    data: {
      userId: teamMembers[1].id, // Bob
      projectId: projects[2].id, // Payment Gateway Integration
      weekStartDate: week1Start,
      weekEndDate: week1End,
      status: ReportStatus.NEEDS_CORRECTION,
      currentVersionNumber: 1,
      tasksPlannedNextWeek: 'Re-test Stripe webhook event handler under high concurrency.',
      blockers: 'Stripe Sandbox API key had rate limiting issues during load testing.',
      isKeyBlocker: true,
      achievements: 'Configured idempotency key handling for payment webhook listeners.',
      isKeyAchievement: false,
      optionalNotes: 'Awaiting updated Sandbox API quota from Stripe support.',
      tasks: {
        create: [
          {
            name: 'Implement Stripe Webhook Controller',
            priority: TaskPriority.CRITICAL,
            taskType: TaskType.DEVELOPMENT,
            status: TaskStatus.IN_PROGRESS,
            plannedPercentage: 100,
            actualPercentage: 70,
            plannedHours: 24,
            timeSpentHours: 28,
            outputDeliverable: 'https://github.com/org/repo/pull/205',
          },
        ],
      },
    },
    include: { tasks: true, user: true, project: true },
  });

  // Version 1 Snapshot for Bob Report
  const bobV1 = await prisma.reportVersion.create({
    data: {
      reportId: reportBobW1.id,
      versionNumber: 1,
      statusAtSubmission: ReportStatus.SUBMITTED,
      submittedByUserId: teamMembers[1].id,
      snapshotData: {
        reportId: reportBobW1.id,
        versionNumber: 1,
        weekStartDate: week1Start,
        weekEndDate: week1End,
        projectId: projects[2].id,
        projectName: projects[2].name,
        user: { id: teamMembers[1].id, fullName: teamMembers[1].fullName, email: teamMembers[1].email },
        blockers: reportBobW1.blockers,
        tasks: reportBobW1.tasks,
      },
    },
  });

  // Manager Requests Changes on Bob V1
  await prisma.reviewHistory.create({
    data: {
      reportId: reportBobW1.id,
      reportVersionId: bobV1.id,
      reviewerId: manager1.id,
      action: ReviewAction.REQUESTED_CHANGES,
      comment: 'Please add task details for PayPal webhook integration as discussed in Monday standup.',
    },
  });

  // Report 3: Charlie - Submitted Report (Pending Review for Week 2)
  const reportCharlieW2 = await prisma.report.create({
    data: {
      userId: teamMembers[2].id, // Charlie
      projectId: projects[4].id, // AI Reporting & Analytics
      weekStartDate: week2Start,
      weekEndDate: week2End,
      status: ReportStatus.SUBMITTED,
      currentVersionNumber: 1,
      tasksPlannedNextWeek: 'Build Recharts dynamic widgets for manager dashboard.',
      blockers: null,
      isKeyBlocker: false,
      achievements: 'Implemented fast SQL aggregation queries for weekly compliance metrics.',
      isKeyAchievement: true,
      optionalNotes: 'Performance benchmark tests returned under 45ms query response time.',
      tasks: {
        create: [
          {
            name: 'Build Dashboard Metrics Aggregator Queries',
            priority: TaskPriority.HIGH,
            taskType: TaskType.DEVELOPMENT,
            status: TaskStatus.COMPLETED,
            plannedPercentage: 100,
            actualPercentage: 100,
            plannedHours: 20,
            timeSpentHours: 18,
            outputDeliverable: 'https://github.com/org/repo/pull/310',
          },
          {
            name: 'Integrate Recharts Bar and Line Chart components',
            priority: TaskPriority.MEDIUM,
            taskType: TaskType.DEVELOPMENT,
            status: TaskStatus.COMPLETED,
            plannedPercentage: 100,
            actualPercentage: 100,
            plannedHours: 16,
            timeSpentHours: 15,
            outputDeliverable: 'https://github.com/org/repo/pull/311',
          },
        ],
      },
    },
    include: { tasks: true, user: true, project: true },
  });

  // Version 1 Snapshot for Charlie
  await prisma.reportVersion.create({
    data: {
      reportId: reportCharlieW2.id,
      versionNumber: 1,
      statusAtSubmission: ReportStatus.SUBMITTED,
      submittedByUserId: teamMembers[2].id,
      snapshotData: {
        reportId: reportCharlieW2.id,
        versionNumber: 1,
        weekStartDate: week2Start,
        weekEndDate: week2End,
        projectId: projects[4].id,
        projectName: projects[4].name,
        user: { id: teamMembers[2].id, fullName: teamMembers[2].fullName, email: teamMembers[2].email },
        achievements: reportCharlieW2.achievements,
        tasks: reportCharlieW2.tasks,
      },
    },
  });

  // Report 4: Diana - Draft Report (Week 2)
  await prisma.report.create({
    data: {
      userId: teamMembers[3].id, // Diana (QA)
      projectId: projects[1].id, // Mobile App
      weekStartDate: week2Start,
      weekEndDate: week2End,
      status: ReportStatus.DRAFT,
      currentVersionNumber: 1,
      tasksPlannedNextWeek: 'Execute E2E regression suite on iOS simulator.',
      blockers: 'Appium test suite failing on iOS 17.5 build runner.',
      isKeyBlocker: true,
      achievements: 'Wrote 35 automated Playwright test cases for login & report creation.',
      isKeyAchievement: true,
      optionalNotes: 'Test coverage report uploaded to SonarQube.',
      tasks: {
        create: [
          {
            name: 'Automated E2E Test Suite for Auth and Reports',
            priority: TaskPriority.HIGH,
            taskType: TaskType.TESTING,
            status: TaskStatus.IN_PROGRESS,
            plannedPercentage: 100,
            actualPercentage: 80,
            plannedHours: 30,
            timeSpentHours: 32,
            outputDeliverable: 'https://github.com/org/repo/pull/402',
          },
        ],
      },
    },
  });

  // Report 5: Evan - Approved Report (Week 2)
  const reportEvanW2 = await prisma.report.create({
    data: {
      userId: teamMembers[4].id, // Evan (DevOps)
      projectId: projects[3].id, // Cloud Migration
      weekStartDate: week2Start,
      weekEndDate: week2End,
      status: ReportStatus.APPROVED,
      currentVersionNumber: 1,
      tasksPlannedNextWeek: 'Configure Terraform scripts for multi-region backup cluster.',
      blockers: null,
      isKeyBlocker: false,
      achievements: 'Successfully provisioned EKS Kubernetes production cluster with ArgoCD CI/CD pipelines.',
      isKeyAchievement: true,
      optionalNotes: 'Zero downtime deployment verified.',
      tasks: {
        create: [
          {
            name: 'Setup ArgoCD and Helm chart deployments',
            priority: TaskPriority.CRITICAL,
            taskType: TaskType.RESEARCH,
            status: TaskStatus.COMPLETED,
            plannedPercentage: 100,
            actualPercentage: 100,
            plannedHours: 35,
            timeSpentHours: 34,
            outputDeliverable: 'https://github.com/org/repo/pull/501',
          },
        ],
      },
    },
    include: { tasks: true, user: true, project: true },
  });

  const evanV1 = await prisma.reportVersion.create({
    data: {
      reportId: reportEvanW2.id,
      versionNumber: 1,
      statusAtSubmission: ReportStatus.SUBMITTED,
      submittedByUserId: teamMembers[4].id,
      snapshotData: {
        reportId: reportEvanW2.id,
        versionNumber: 1,
        weekStartDate: week2Start,
        weekEndDate: week2End,
        projectId: projects[3].id,
        projectName: projects[3].name,
        user: { id: teamMembers[4].id, fullName: teamMembers[4].fullName, email: teamMembers[4].email },
        achievements: reportEvanW2.achievements,
        tasks: reportEvanW2.tasks,
      },
    },
  });

  await prisma.reviewHistory.create({
    data: {
      reportId: reportEvanW2.id,
      reportVersionId: evanV1.id,
      reviewerId: manager2.id,
      action: ReviewAction.APPROVED,
      comment: 'Superb work on the Kubernetes pipeline setup!',
    },
  });

  console.log('✅ Database seed completed successfully!');
  console.log('\n🔑 Seeding Credentials Summary:');
  console.log('----------------------------------------------------');
  console.log('ADMIN:        admin@company.com          / Password123!');
  console.log('MANAGER 1:    manager.sarah@company.com  / Password123!');
  console.log('MANAGER 2:    manager.david@company.com  / Password123!');
  console.log('TEAM MEMBER 1: dev.alice@company.com     / Password123!');
  console.log('TEAM MEMBER 2: dev.bob@company.com       / Password123!');
  console.log('TEAM MEMBER 3: dev.charlie@company.com   / Password123!');
  console.log('TEAM MEMBER 4: dev.diana@company.com     / Password123!');
  console.log('TEAM MEMBER 5: dev.evan@company.com      / Password123!');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error executing seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
