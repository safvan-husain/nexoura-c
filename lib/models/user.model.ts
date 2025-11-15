import 'reflect-metadata';
import { prop, getModelForClass, pre, modelOptions } from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';

@pre<User>('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'users'
  }
})
export class User {
  @prop({ required: true, unique: true, lowercase: true, trim: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true, trim: true })
  public firstName!: string;

  @prop({ required: true, trim: true })
  public lastName!: string;

  @prop({ trim: true })
  public phone?: string;

  @prop({ type: () => [String], default: [] })
  public addresses!: string[];

  @prop({ default: true })
  public isActive!: boolean;

  @prop({ default: false })
  public isEmailVerified!: boolean;

  @prop()
  public emailVerificationToken?: string;

  @prop()
  public emailVerificationExpires?: Date;

  @prop()
  public passwordResetToken?: string;

  @prop()
  public passwordResetExpires?: Date;

  @prop()
  public lastLogin?: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

if (!(global as any).UserModel) {
  (global as any).UserModel = getModelForClass(User);
}
export const UserModel = (global as any).UserModel;
