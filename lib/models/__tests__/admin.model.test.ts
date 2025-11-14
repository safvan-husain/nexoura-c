import { AdminModel } from '../admin.model';

describe('Admin Model', () => {
  describe('Creation', () => {
    it('should create a new admin with valid data', async () => {
      const adminData = {
        email: 'admin@test.com',
        password: 'password123',
        name: 'Test Admin',
        role: 'admin',
      };

      const admin = await AdminModel.create(adminData);

      expect(admin.email).toBe(adminData.email);
      expect(admin.name).toBe(adminData.name);
      expect(admin.role).toBe(adminData.role);
      expect(admin.isActive).toBe(true);
      expect(admin.password).not.toBe(adminData.password); // Should be hashed
    });

    it('should hash password before saving', async () => {
      const admin = await AdminModel.create({
        email: 'admin2@test.com',
        password: 'plaintext',
        name: 'Admin Two',
      });

      expect(admin.password).not.toBe('plaintext');
      expect(admin.password.length).toBeGreaterThan(20);
    });

    it('should set default role to admin', async () => {
      const admin = await AdminModel.create({
        email: 'admin3@test.com',
        password: 'password123',
        name: 'Admin Three',
      });

      expect(admin.role).toBe('admin');
    });

    it('should fail with duplicate email', async () => {
      await AdminModel.create({
        email: 'duplicate@test.com',
        password: 'password123',
        name: 'First Admin',
      });

      await expect(
        AdminModel.create({
          email: 'duplicate@test.com',
          password: 'password456',
          name: 'Second Admin',
        })
      ).rejects.toThrow();
    });

    it('should fail without required fields', async () => {
      await expect(
        AdminModel.create({
          email: 'incomplete@test.com',
        })
      ).rejects.toThrow();
    });
  });

  describe('Password Comparison', () => {
    it('should correctly compare valid password', async () => {
      const admin = await AdminModel.create({
        email: 'compare@test.com',
        password: 'mypassword',
        name: 'Compare Admin',
      });

      const isValid = await admin.comparePassword('mypassword');
      expect(isValid).toBe(true);
    });

    it('should reject invalid password', async () => {
      const admin = await AdminModel.create({
        email: 'compare2@test.com',
        password: 'correctpassword',
        name: 'Compare Admin 2',
      });

      const isValid = await admin.comparePassword('wrongpassword');
      expect(isValid).toBe(false);
    });
  });

  describe('Updates', () => {
    it('should update lastLogin timestamp', async () => {
      const admin = await AdminModel.create({
        email: 'update@test.com',
        password: 'password123',
        name: 'Update Admin',
      });

      expect(admin.lastLogin).toBeUndefined();

      admin.lastLogin = new Date();
      await admin.save();

      expect(admin.lastLogin).toBeInstanceOf(Date);
    });

    it('should rehash password on update', async () => {
      const admin = await AdminModel.create({
        email: 'rehash@test.com',
        password: 'oldpassword',
        name: 'Rehash Admin',
      });

      const oldHash = admin.password;

      admin.password = 'newpassword';
      await admin.save();

      expect(admin.password).not.toBe(oldHash);
      expect(await admin.comparePassword('newpassword')).toBe(true);
    });
  });
});
