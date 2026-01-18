import 'reflect-metadata';
import * as typegoose from '@typegoose/typegoose';

@typegoose.modelOptions({
    schemaOptions: {
        timestamps: true,
        collection: 'users'
    }
})
export class User {
    @typegoose.prop({ required: true, unique: true, lowercase: true, trim: true, type: String })
    public email!: string;

    @typegoose.prop({ required: true, type: String })
    public passwordHash!: string;

    public createdAt!: Date;
    public updatedAt!: Date;
}

if (!(global as any).UserModel) {
    (global as any).UserModel = typegoose.getModelForClass(User);
}
export const UserModel = (global as any).UserModel;

// Plain object interface for serialization
export interface UserPlain {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export function toUser(doc: typegoose.DocumentType<User>): UserPlain {
    return {
        id: (doc._id as any).toString(),
        email: doc.email,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
    };
}
