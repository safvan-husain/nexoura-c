import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// User document interface
export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

// User schema
const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: { type: String, required: true }
}, {
    timestamps: true,
    collection: 'users'
});

// Model
let UserModel: Model<IUser>;

if (!(global as any).UserModel) {
    UserModel = mongoose.model<IUser>('User', UserSchema);
    (global as any).UserModel = UserModel;
} else {
    UserModel = (global as any).UserModel;
}

export { UserModel };

// Plain object interface for serialization
export interface UserPlain {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export function toUser(doc: IUser): UserPlain {
    return {
        id: doc._id.toString(),
        email: doc.email,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
    };
}
