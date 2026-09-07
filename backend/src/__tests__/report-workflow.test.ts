import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma.lib';
import { JwtUtil } from '../utils/jwt.util';
import { RoleName, ReportStatus } from '@prisma/client';

describe('Report Workflow State Machine Integration Tests', () => {
  let managerToken: string;
  let teamMemberToken: string;
  let managerId: string;
  let teamMemberId: string;
  let reportId: string;

  beforeAll(async () => {
    // 1. Get or create roles
    let managerRole = await prisma.role.findUnique({ where: { name: RoleName.MANAGER } });
    if (!managerRole) {
      managerRole = await prisma.role.create({
        data: { name: RoleName.MANAGER, description: 'Manager' },
      });
    }

    let teamRole = await prisma.role.findUnique({ where: { name: RoleName.TEAM_MEMBER } });
    if (!teamRole) {
      teamRole = await prisma.role.create({
        data: { name: RoleName.TEAM_MEMBER, description: 'Team Member' },
      });
    }

    // 2. Create Users
    const mgr = await prisma.user.create({
      data: {
        email: 'workflow.manager@company.com',
        passwordHash: 'dummyhash',
        fullName: 'Workflow Manager',
        roleId: managerRole.id,
      },
    });
    managerId = mgr.id;
    managerToken = JwtUtil.generateToken({
      userId: mgr.id,
      email: mgr.email,
      role: RoleName.MANAGER,
      roleId: managerRole.id,
    });

    const tm = await prisma.user.create({
      data: {
        email: 'workflow.tm@company.com',
        passwordHash: 'dummyhash',
        fullName: 'Workflow Team Member',
        roleId: teamRole.id,
      },
    });
    teamMemberId = tm.id;
    teamMemberToken = JwtUtil.generateToken({
      userId: tm.id,
      email: tm.email,
      role: RoleName.TEAM_MEMBER,
      roleId: teamRole.id,
    });

    // 3. Create Project
    let project = await prisma.project.findFirst();
    if (!project) {
      project = await prisma.project.create({
        data: { name: 'Workflow Test Project', code: 'WF-PRJ' },
      });
    }

    // 4. Create Draft Report
    const report = await prisma.report.create({
      data: {
        userId: teamMemberId,
        projectId: project.id,
        weekStartDate: new Date('2026-09-15'),
        weekEndDate: new Date('2026-09-21'),
        status: ReportStatus.DRAFT,
        tasksPlannedNextWeek: 'Workflow testing tasks',
        tasks: {
          create: [
            {
              name: 'Workflow Draft Task Item',
              plannedPercentage: 100,
              actualPercentage: 50,
              plannedHours: 10,
              timeSpentHours: 5,
            },
          ],
        },
      },
    });
    reportId = report.id;
  });

  afterAll(async () => {
    await prisma.reviewHistory.deleteMany({ where: { reportId } });
    await prisma.reportVersion.deleteMany({ where: { reportId } });
    await prisma.reportTask.deleteMany({ where: { reportId } });
    await prisma.report.deleteMany({ where: { id: reportId } });
    await prisma.user.deleteMany({ where: { id: { in: [managerId, teamMemberId] } } });
    await prisma.$disconnect();
  });

  it('REJECTS invalid status transition: Manager trying to approve a DRAFT report - Returns 400 Bad Request', async () => {
    const res = await request(app)
      .post(`/api/manager/reports/${reportId}/approve`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ comment: 'Invalid approval attempt on draft' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid status transition');
  });

  it('Team Member submits DRAFT report - Successfully creates version snapshot and sets status to SUBMITTED', async () => {
    const res = await request(app)
      .post(`/api/reports/${reportId}/submit`)
      .set('Authorization', `Bearer ${teamMemberToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.report.status).toBe('SUBMITTED');
    expect(res.body.data.version.versionNumber).toBe(1);
  });

  it('Manager can review and approve SUBMITTED report - Sets status to APPROVED', async () => {
    const res = await request(app)
      .post(`/api/manager/reports/${reportId}/approve`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ comment: 'Great job! Approved.' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.report.status).toBe('APPROVED');
    expect(res.body.data.review.action).toBe('APPROVED');
  });

  it('REJECTS invalid status transition: Team Member trying to edit an APPROVED report - Returns 400 Bad Request', async () => {
    const res = await request(app)
      .put(`/api/reports/${reportId}`)
      .set('Authorization', `Bearer ${teamMemberToken}`)
      .send({
        tasksPlannedNextWeek: 'Trying to edit after approval',
        tasks: [
          {
            name: 'Illegal task edit',
            plannedPercentage: 100,
            actualPercentage: 100,
            plannedHours: 5,
            timeSpentHours: 5,
          },
        ],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Cannot edit report content when status is');
  });
});
