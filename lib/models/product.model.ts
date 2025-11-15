import 'reflect-metadata';
import * as typegoose from '@typegoose/typegoose';
import type { Category } from './category.model';

class ProductImage {
  @typegoose.prop({ required: true })
  public url!: string;

  @typegoose.prop()
  public alt?: string;

  @typegoose.prop({ default: false })
  public isPrimary!: boolean;
}

class ProductVariant {
  @typegoose.prop({ required: true })
  public name!: string;

  @typegoose.prop({ required: true })
  public sku!: string;

  @typegoose.prop({ required: true, min: 0 })
  public stock!: number;

  @typegoose.prop({ type: () => [ProductImage], default: [] })
  public images!: ProductImage[];

  @typegoose.prop({ type: () => Object })
  public attributes?: Record<string, string>;
}

@typegoose.modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'products'
  }
})
export class Product {
  @typegoose.prop({ required: true, trim: true })
  public name!: string;

  @typegoose.prop({ required: true, unique: true, trim: true })
  public slug!: string;

  @typegoose.prop({ required: true })
  public description!: string;

  @typegoose.prop()
  public shortDescription?: string;

  @typegoose.prop({ required: true, min: 0 })
  public price!: number;

  @typegoose.prop({ min: 0 })
  public compareAtPrice?: number;

  @typegoose.prop({ ref: () => 'Category', type: () => [typegoose.mongoose.Schema.Types.ObjectId], default: [] })
  public categories!: typegoose.Ref<Category>[];

  @typegoose.prop({ type: () => [String], default: [] })
  public tags!: string[];

  @typegoose.prop({ type: () => [ProductVariant], required: true, validate: {
    validator: (v: ProductVariant[]) => v && v.length > 0,
    message: 'At least one variant is required'
  }})
  public variants!: ProductVariant[];

  @typegoose.prop({ enum: ['draft', 'published', 'archived'], default: 'draft' })
  public status!: 'draft' | 'published' | 'archived';

  @typegoose.prop({ type: () => Object })
  public metadata?: Record<string, any>;

  public get isInStock(): boolean {
    return this.variants.some(variant => variant.stock > 0);
  }

  public get totalStock(): number {
    return this.variants.reduce((sum, variant) => sum + variant.stock, 0);
  }

  public get hasDiscount(): boolean {
    return !!this.compareAtPrice && this.compareAtPrice > this.price;
  }

  public get discountPercentage(): number {
    if (!this.hasDiscount || !this.compareAtPrice) return 0;
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
}

if (!(global as any).ProductModel) {
  (global as any).ProductModel = typegoose.getModelForClass(Product);
}
export const ProductModel = (global as any).ProductModel;
