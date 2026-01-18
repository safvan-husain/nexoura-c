import 'server-only';

import { connectDB } from '@/lib/db/mongo-client';
import { AppError } from '@/lib/errors/app-error';
import { hashPassword, verifyPassword } from './password';
import { User, UserModel, toUser, UserPlain } from './user.model';

export async function registerUser(email: string, password: string): Promise<UserPlain> {
    await connectDB();
    const existing = await UserModel.findOne({ email });
    if (existing) {
        throw new AppError('EMAIL_ALREADY_EXISTS', 409);
    }

    const passwordHash = await hashPassword(password);
    const now = new Date();

    const userDoc = await UserModel.create({
        email,
        passwordHash,
        createdAt: now,
        updatedAt: now,
    });

    return toUser(userDoc);
}

export async function loginUser(email: string, password: string): Promise<UserPlain> {
    await connectDB();
    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new AppError('INVALID_CREDENTIALS', 401);
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
        throw new AppError('INVALID_CREDENTIALS', 401);
    }

    return toUser(user);
}

export async function getUserById(userId: string): Promise<UserPlain | null> {
    await connectDB();
    const user = await UserModel.findById(userId);
    return user ? toUser(user) : null;
}
