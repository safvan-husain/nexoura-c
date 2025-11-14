import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose';
import { Admin } from './admin.model';

class ProductImage {
  @prop({ required: true })
  public url!: string;

  @prop()
  public alt?: string;

  @prop({ default: false })
  public isPrimary!: boolean;
}

class ProductVariant {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public sku!: string;

  @prop({ required: true, min: 0 })
  public price!: number;

  @prop({ min: 0 })
  public compareAtPrice?: number;

  @prop({ required: true, min: 0 })
  public stock!: number;

  @prop({ type: () => Object })
  public attributes?: Record<string, string>;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'products'
  }
})
export class Product {
  @prop({ required: true, trim: true })
  public name!: string;

  @prop({ required: true, unique: true, trim: true })
  public slug!: string;

  @prop({ required: true })
  public description!: string;

  @prop()
  public shortDescription?: string;

  @prop({ required: true, min: 0 })
  public price!: number;

  @prop({ min: 0 })
  public compareAtPrice?: number;

  @prop({ required: true, min: 0 })
  public stock!: number;

  @prop({ required: true, unique: true, trim: true })
  public sku!: string;

  @prop({ type: () => [String], default: [] })
  public categories!: string[];

  @prop({ type: () => [String], default: [] })
  public tags!: string[];

  @prop({ type: () => [ProductImage], default: [] })
  public images!: ProductImage[];

  @prop({ type: () => [ProductVariant], default: [] })
  public variants!: ProductVariant[];

  @prop({ default: true })
  public isActive!: boolean;

  @prop({ default: false })
  public isFeatured!: boolean;

  @prop({ min: 0, max: 5 })
  public rating?: number;

  @prop({ min: 0, default: 0 })
  public reviewCount!: number;

  @prop({ type: () => Object })
  public metadata?: Record<string, any>;

  @prop({ ref: () => Admin })
  public createdBy?: Ref<Admin>;

  @prop({ ref: () => Admin })
  public updatedBy?: Ref<Admin>;

  public get isInStock(): boolean {
    return this.stock > 0;
  }

  public get hasDiscount(): boolean {
    return !!this.compareAtPrice && this.compareAtPrice > this.price;
  }

  public get discountPercentage(): number {
    if (!this.hasDiscount || !this.compareAtPrice) return 0;
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
}

export const ProductModel = getModelForClass(Product);
