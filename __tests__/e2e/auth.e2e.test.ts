import { POST as registerPOST } from '@/app/api/auth/register/route';
import { POST as loginPOST } from '@/app/api/auth/login/route';
import { POST as adminLoginPOST } from '@/app/api/admin/login/route';
import { UserModel } from '@/lib/models/user.model';
import { AdminModel } from '@/lib/models/admin.model';

// Helper to create mock Request
function createMockRequest(body: any): Request {
  return new Request('http://localhost:3000', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('Auth Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const req = createMockRequest({
        email: 'e2e-user@test.com',
        password: 'password123',
        firstName: 'E2E',
        lastName: 'User',
      });

      const response = await registerPOST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.token).toBeDefined();
      expect(body.user.email).toBe('e2e-user@test.com');
      expect(body.user.fullName).toBe('E2E User');
    });

    it('should return 400 for invalid email', async () => {
      const req = createMockRequest({
        email: 'invalid-email',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });

      const response = await registerPOST(req);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for short password', async () => {
      const req = createMockRequest({
        email: 'test@test.com',
        password: '123',
        firstName: 'Test',
        lastName: 'User',
      });

      const response = await registerPOST(req);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        email: 'duplicate@test.com',
        password: 'password123',
        firstName: 'First',
        lastName: 'User',
      };

      await registerPOST(createMockRequest(userData));

      const req = createMockRequest({
        email: 'duplicate@test.com',
        password: 'password456',
        firstName: 'Second',
        lastName: 'User',
      });

      const response = await registerPOST(req);
      const body = await response.json();

      expect(response.status).toBe(409);
      expect(body.error).toBe('USER_ALREADY_EXISTS');
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
      const req = createMockRequest({
        email: 'login-test@test.com',
        password: 'password123',
      });

      const response = await loginPOST(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.token).toBeDefined();
      expect(body.user.email).toBe('login-test@test.com');
    });

    it('should return 401 for wrong password', async () => {
      const req = createMockRequest({
        email: 'login-test@test.com',
        password: 'wrongpassword',
      });

      const response = await loginPOST(req);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error).toBe('INVALID_CREDENTIALS');
    });

    it('should return 401 for non-existent user', async () => {
      const req = createMockRequest({
        email: 'nonexistent@test.com',
        password: 'password123',
      });

      const response = await loginPOST(req);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error).toBe('INVALID_CREDENTIALS');
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
      const req = createMockRequest({
        email: 'admin-test@test.com',
        password: 'adminpass123',
      });

      const response = await adminLoginPOST(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.token).toBeDefined();
      expect(body.admin.email).toBe('admin-test@test.com');
      expect(body.admin.role).toBe('admin');
    });

    it('should return 401 for wrong password', async () => {
      const req = createMockRequest({
        email: 'admin-test@test.com',
        password: 'wrongpassword',
      });

      const response = await adminLoginPOST(req);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error).toBe('INVALID_CREDENTIALS');
    });
  });
});
