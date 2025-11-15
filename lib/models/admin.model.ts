import 'reflect-metadata';
import { prop, getModelForClass, pre, modelOptions } from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';

@pre<Admin>('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'admins'
  }
})
export class Admin {
  @prop({ required: true, unique: true, lowercase: true, trim: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true, trim: true })
  public name!: string;

  @prop({ enum: ['super_admin', 'admin'], default: 'admin' })
  public role!: string;

  @prop({ default: true })
  public isActive!: boolean;

  @prop()
  public lastLogin?: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export const AdminModel = (global as any).AdminModel || getModelForClass(Admin);
if (!(global as any).AdminModel) {
  (global as any).AdminModel = AdminModel;
}
