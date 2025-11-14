import { UserModel } from '../user.model';

describe('User Model', () => {
  describe('Creation', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        email: 'user@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      };

      const user = await UserModel.create(userData);

      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.phone).toBe(userData.phone);
      expect(user.isActive).toBe(true);
      expect(user.isEmailVerified).toBe(false);
      expect(user.password).not.toBe(userData.password);
    });

    it('should create user without optional fields', async () => {
      const user = await UserModel.create({
        email: 'minimal@test.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
      });

      expect(user.phone).toBeUndefined();
      expect(user.addresses).toEqual([]);
    });

    it('should fail with duplicate email', async () => {
      await UserModel.create({
        email: 'duplicate@test.com',
        password: 'password123',
        firstName: 'First',
        lastName: 'User',
      });

      await expect(
        UserModel.create({
          email: 'duplicate@test.com',
          password: 'password456',
          firstName: 'Second',
          lastName: 'User',
        })
      ).rejects.toThrow();
    });

    it('should lowercase email', async () => {
      const user = await UserModel.create({
        email: 'UPPERCASE@TEST.COM',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(user.email).toBe('uppercase@test.com');
    });
  });

  describe('Password Management', () => {
    it('should hash password before saving', async () => {
      const user = await UserModel.create({
        email: 'hash@test.com',
        password: 'plaintext',
        firstName: 'Hash',
        lastName: 'Test',
      });

      expect(user.password).not.toBe('plaintext');
      expect(user.password.length).toBeGreaterThan(20);
    });

    it('should correctly compare valid password', async () => {
      const user = await UserModel.create({
        email: 'compare@test.com',
        password: 'mypassword',
        firstName: 'Compare',
        lastName: 'User',
      });

      const isValid = await user.comparePassword('mypassword');
      expect(isValid).toBe(true);
    });

    it('should reject invalid password', async () => {
      const user = await UserModel.create({
        email: 'compare2@test.com',
        password: 'correctpassword',
        firstName: 'Compare',
        lastName: 'User',
      });

      const isValid = await user.comparePassword('wrongpassword');
      expect(isValid).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    it('should return correct fullName', async () => {
      const user = await UserModel.create({
        email: 'fullname@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.fullName).toBe('John Doe');
    });
  });

  describe('Email Verification', () => {
    it('should store verification token', async () => {
      const user = await UserModel.create({
        email: 'verify@test.com',
        password: 'password123',
        firstName: 'Verify',
        lastName: 'User',
      });

      user.emailVerificationToken = 'token123';
      user.emailVerificationExpires = new Date(Date.now() + 3600000);
      await user.save();

      expect(user.emailVerificationToken).toBe('token123');
      expect(user.emailVerificationExpires).toBeInstanceOf(Date);
    });
  });

  describe('Addresses', () => {
    it('should store multiple addresses', async () => {
      const user = await UserModel.create({
        email: 'addresses@test.com',
        password: 'password123',
        firstName: 'Address',
        lastName: 'User',
        addresses: ['123 Main St', '456 Oak Ave'],
      });

      expect(user.addresses).toHaveLength(2);
      expect(user.addresses).toContain('123 Main St');
      expect(user.addresses).toContain('456 Oak Ave');
    });
  });
});
