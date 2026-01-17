import { Schema, model, models, Document } from 'mongoose';

export interface UserDocument extends Document {
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export const UserModel = models.User || model<UserDocument>('User', UserSchema);

export interface User {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export function toUser(doc: UserDocument): User {
    return {
        id: (doc._id as any).toString(),
        email: doc.email,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
    };
}
