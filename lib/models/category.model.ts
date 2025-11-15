import 'reflect-metadata';
import * as typegoose from '@typegoose/typegoose';

@typegoose.modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'categories'
  }
})
export class Category {
  @typegoose.prop({ required: true, trim: true })
  public name!: string;

  @typegoose.prop({ required: true, unique: true, trim: true })
  public slug!: string;

  @typegoose.prop()
  public description?: string;

  @typegoose.prop({ ref: () => Category })
  public parent?: typegoose.Ref<Category>;

  @typegoose.prop({ default: true })
  public isActive!: boolean;

  @typegoose.prop({ default: 0 })
  public sortOrder!: number;

  @typegoose.prop({ type: () => Object })
  public metadata?: Record<string, any>;
}

if (!(global as any).CategoryModel) {
  (global as any).CategoryModel = typegoose.getModelForClass(Category);
}
export const CategoryModel = (global as any).CategoryModel;
