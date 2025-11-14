import { registerUser, loginUser, loginAdmin } from '../auth.service';
import { UserModel } from '@/lib/models/user.model';
import { AdminModel } from '@/lib/models/admin.model';
import { AppError } from '@/lib/errors/app-error';

describe('Auth Service', () => {
  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      const result = await registerUser(userData);

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.user.firstName).toBe(userData.firstName);
      expect(result.user.fullName).toBe('New User');

      const user = await UserModel.findOne({ email: userData.email });
      expect(user).toBeDefined();
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        email: 'duplicate@test.com',
        password: 'password123',
        firstName: 'First',
        lastName: 'User',
      };

      await registerUser(userData);

      await expect(registerUser(userData)).rejects.toThrow(AppError);
      await expect(registerUser(userData)).rejects.toMatchObject({
        status: 409,
        code: 'USER_ALREADY_EXISTS',
      });
    });
  });

  describe('loginUser', () => {
    beforeEach(async () => {
      await UserModel.create({
        email: 'login@test.com',
        password: 'password123',
        firstName: 'Login',
        lastName: 'User',
      });
    });

    it('should login user with correct credentials', async () => {
      const result = await loginUser({
        email: 'login@test.com',
        password: 'password123',
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('login@test.com');
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        loginUser({
          email: 'nonexistent@test.com',
          password: 'password123',
        })
      ).rejects.toThrow(AppError);
    });

    it('should throw error for incorrect password', async () => {
      await expect(
        loginUser({
          email: 'login@test.com',
          password: 'wrongpassword',
        })
      ).rejects.toMatchObject({
        status: 401,
        code: 'INVALID_CREDENTIALS',
      });
    });

    it('should throw error for inactive user', async () => {
      await UserModel.create({
        email: 'inactive@test.com',
        password: 'password123',
        firstName: 'Inactive',
        lastName: 'User',
        isActive: false,
      });

      await expect(
        loginUser({
          email: 'inactive@test.com',
          password: 'password123',
        })
      ).rejects.toMatchObject({
        status: 403,
        code: 'ACCOUNT_DISABLED',
      });
    });

    it('should update lastLogin timestamp', async () => {
      await loginUser({
        email: 'login@test.com',
        password: 'password123',
      });

      const user = await UserModel.findOne({ email: 'login@test.com' });
      expect(user?.lastLogin).toBeInstanceOf(Date);
    });
  });

  describe('loginAdmin', () => {
    beforeEach(async () => {
      await AdminModel.create({
        email: 'admin@test.com',
        password: 'adminpass123',
        name: 'Test Admin',
        role: 'admin',
      });
    });

    it('should login admin with correct credentials', async () => {
      const result = await loginAdmin({
        email: 'admin@test.com',
        password: 'adminpass123',
      });

      expect(result.token).toBeDefined();
      expect(result.admin.email).toBe('admin@test.com');
      expect(result.admin.role).toBe('admin');
    });

    it('should throw error for non-existent admin', async () => {
      await expect(
        loginAdmin({
          email: 'nonexistent@test.com',
          password: 'password123',
        })
      ).rejects.toThrow(AppError);
    });

    it('should throw error for incorrect password', async () => {
      await expect(
        loginAdmin({
          email: 'admin@test.com',
          password: 'wrongpassword',
        })
      ).rejects.toMatchObject({
        status: 401,
        code: 'INVALID_CREDENTIALS',
      });
    });

    it('should throw error for inactive admin', async () => {
      await AdminModel.create({
        email: 'inactive-admin@test.com',
        password: 'password123',
        name: 'Inactive Admin',
        isActive: false,
      });

      await expect(
        loginAdmin({
          email: 'inactive-admin@test.com',
          password: 'password123',
        })
      ).rejects.toMatchObject({
        status: 403,
        code: 'ACCOUNT_DISABLED',
      });
    });
  });
});
