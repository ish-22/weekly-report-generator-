import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma.lib';
import { PasswordUtil } from '../utils/password.util';
import { RoleName } from '@prisma/client';

describe('Auth Module Integration Tests', () => {
  let teamMemberRoleId: string;

  beforeAll(async () => {
    // Ensure role exists in database or fallback
    let role = await prisma.role.findUnique({ where: { name: RoleName.TEAM_MEMBER } });
    if (!role) {
      role = await prisma.role.create({
        data: { name: RoleName.TEAM_MEMBER, description: 'Team Member' },
      });
    }
    teamMemberRoleId = role.id;
  });

  afterAll(async () => {
    // Cleanup created test users
    await prisma.user.deleteMany({
      where: { email: { in: ['test.register@company.com', 'test.login@company.com'] } },
    });
    await prisma.$disconnect();
  });

  it('POST /api/auth/register - should successfully register a new team member', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test.register@company.com',
      password: 'Password123!',
      fullName: 'Test Register User',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('test.register@company.com');
    expect(res.body.data.user.role).toBe('TEAM_MEMBER');
    expect(res.body.data.token).toBeDefined();
  });

  it('POST /api/auth/register - should reject duplicate email registration with 409 Conflict', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test.register@company.com',
      password: 'Password123!',
      fullName: 'Duplicate User',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login - should authenticate existing user and return JWT token', async () => {
    // Create pre-hashed user directly
    const passHash = await PasswordUtil.hashPassword('Password123!');
    await prisma.user.create({
      data: {
        email: 'test.login@company.com',
        passwordHash: passHash,
        fullName: 'Test Login User',
        roleId: teamMemberRoleId,
      },
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test.login@company.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('POST /api/auth/login - should reject invalid credentials with 401 Unauthorized', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test.login@company.com',
      password: 'WrongPassword!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
