import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma.lib';
import { JwtUtil } from '../utils/jwt.util';
import { RoleName } from '@prisma/client';

describe('RBAC & Tenant Isolation Integration Tests', () => {
  let user1Token: string;
  let user2Token: string;
  let user1Id: string;
  let user2Id: string;
  let reportUser2Id: string;

  beforeAll(async () => {
    // 1. Get or create TEAM_MEMBER role
    let teamRole = await prisma.role.findUnique({ where: { name: RoleName.TEAM_MEMBER } });
    if (!teamRole) {
      teamRole = await prisma.role.create({
        data: { name: RoleName.TEAM_MEMBER, description: 'Team Member' },
      });
    }

    // 2. Create User 1 & User 2
    const u1 = await prisma.user.create({
      data: {
        email: 'rbac.user1@company.com',
        passwordHash: 'dummyhash',
        fullName: 'RBAC User 1',
        roleId: teamRole.id,
      },
    });
    user1Id = u1.id;
    user1Token = JwtUtil.generateToken({
      userId: u1.id,
      email: u1.email,
      role: RoleName.TEAM_MEMBER,
      roleId: teamRole.id,
    });

    const u2 = await prisma.user.create({
      data: {
        email: 'rbac.user2@company.com',
        passwordHash: 'dummyhash',
        fullName: 'RBAC User 2',
        roleId: teamRole.id,
      },
    });
    user2Id = u2.id;
    user2Token = JwtUtil.generateToken({
      userId: u2.id,
      email: u2.email,
      role: RoleName.TEAM_MEMBER,
      roleId: teamRole.id,
    });

    // 3. Create Project
    let project = await prisma.project.findFirst();
    if (!project) {
      project = await prisma.project.create({
        data: { name: 'RBAC Test Project', code: 'RBAC-PRJ' },
      });
    }

    // 4. Create Report owned by User 2
    const report2 = await prisma.report.create({
      data: {
        userId: user2Id,
        projectId: project.id,
        weekStartDate: new Date('2026-09-01'),
        weekEndDate: new Date('2026-09-07'),
        tasksPlannedNextWeek: 'User 2 secret tasks',
        tasks: {
          create: [
            {
              name: 'User 2 Task Item',
              plannedPercentage: 100,
              actualPercentage: 100,
              plannedHours: 8,
              timeSpentHours: 8,
            },
          ],
        },
      },
    });
    reportUser2Id = report2.id;
  });

  afterAll(async () => {
    await prisma.reportTask.deleteMany({ where: { report: { userId: { in: [user1Id, user2Id] } } } });
    await prisma.report.deleteMany({ where: { userId: { in: [user1Id, user2Id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [user1Id, user2Id] } } });
    await prisma.$disconnect();
  });

  it('Team Member CANNOT access another user report - Returns 403 Forbidden', async () => {
    const res = await request(app)
      .get(`/api/reports/${reportUser2Id}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Access denied');
  });

  it('Team Member CANNOT access manager-only endpoint GET /api/manager/reports - Returns 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/manager/reports')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('is not authorized');
  });

  it('Team Member CANNOT access manager dashboard metrics GET /api/dashboard/metrics - Returns 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/dashboard/metrics')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
