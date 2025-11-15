import jwt, { type SignOptions } from 'jsonwebtoken';
import { UserModel } from '@/lib/models/user.model';
import { AdminModel } from '@/lib/models/admin.model';
import { AppError } from '@/lib/errors/app-error';
import { connectDB } from '@/lib/db/mongo-client';
import type { LoginInput, RegisterInput, AdminLoginInput } from './auth.schema';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as string;

export async function registerUser(data: RegisterInput) {
  await connectDB();

  const existingUser = await UserModel.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError('USER_ALREADY_EXISTS', 409, { email: data.email });
  }

  const user = await UserModel.create(data);

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, type: 'user' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as SignOptions
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
    },
  };
}

export async function loginUser(data: LoginInput) {
  await connectDB();

  const user = await UserModel.findOne({ email: data.email });
  if (!user) {
    throw new AppError('INVALID_CREDENTIALS', 401);
  }

  if (!user.isActive) {
    throw new AppError('ACCOUNT_DISABLED', 403);
  }

  const isValidPassword = await user.comparePassword(data.password);
  if (!isValidPassword) {
    throw new AppError('INVALID_CREDENTIALS', 401);
  }

  user.lastLogin = new Date();
  await user.save();

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, type: 'user' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as SignOptions
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
    },
  };
}

export async function loginAdmin(data: AdminLoginInput) {
  await connectDB();

  const admin = await AdminModel.findOne({ email: data.email });
  if (!admin) {
    throw new AppError('INVALID_CREDENTIALS', 401);
  }

  if (!admin.isActive) {
    throw new AppError('ACCOUNT_DISABLED', 403);
  }

  const isValidPassword = await admin.comparePassword(data.password);
  if (!isValidPassword) {
    throw new AppError('INVALID_CREDENTIALS', 401);
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = jwt.sign(
    { adminId: admin._id.toString(), email: admin.email, role: admin.role, type: 'admin' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as SignOptions
  );

  return {
    token,
    admin: {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  };
}
