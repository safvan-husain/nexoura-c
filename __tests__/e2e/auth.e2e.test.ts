import request from 'supertest';
import { UserModel } from '@/lib/models/user.model';
import { AdminModel } from '@/lib/models/admin.model';

const API_URL = 'http://localhost:3000';

describe('Auth E2E Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: 'e2e-user@test.com',
          password: 'password123',
          firstName: 'E2E',
          lastName: 'User',
        })
        .expect(201);

      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('e2e-user@test.com');
      expect(response.body.user.fullName).toBe('E2E User');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(400);

      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for short password', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: '123',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(400);

      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 409 for duplicate email', async () => {
      await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@test.com',
          password: 'password123',
          firstName: 'First',
          lastName: 'User',
        });

      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@test.com',
          password: 'password456',
          firstName: 'Second',
          lastName: 'User',
        })
        .expect(409);

      expect(response.body.error).toBe('USER_ALREADY_EXISTS');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await UserModel.create({
        email: 'login-test@test.com',
        password: 'password123',
        firstName: 'Login',
        lastName: 'Test',
      });
    });

    it('should login with correct credentials', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: 'login-test@test.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('login-test@test.com');
    });

    it('should return 401 for wrong password', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: 'login-test@test.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.error).toBe('INVALID_CREDENTIALS');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.error).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('POST /api/admin/login', () => {
    beforeEach(async () => {
      await AdminModel.create({
        email: 'admin-test@test.com',
        password: 'adminpass123',
        name: 'Test Admin',
        role: 'admin',
      });
    });

    it('should login admin with correct credentials', async () => {
      const response = await request(API_URL)
        .post('/api/admin/login')
        .send({
          email: 'admin-test@test.com',
          password: 'adminpass123',
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(response.body.admin.email).toBe('admin-test@test.com');
      expect(response.body.admin.role).toBe('admin');
    });

    it('should return 401 for wrong password', async () => {
      const response = await request(API_URL)
        .post('/api/admin/login')
        .send({
          email: 'admin-test@test.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.error).toBe('INVALID_CREDENTIALS');
    });
  });
});
