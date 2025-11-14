import { connectDB } from '../lib/db/mongo-client';
import { AdminModel } from '../lib/models/admin.model';

async function seedAdmin() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const existingAdmin = await AdminModel.findOne({ email: 'admin@nexoura.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = await AdminModel.create({
      email: 'admin@nexoura.com',
      password: 'admin123456',
      name: 'Super Admin',
      role: 'super_admin',
      isActive: true,
    });

    console.log('Admin user created successfully:');
    console.log('Email:', admin.email);
    console.log('Password: admin123456');
    console.log('\n⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
