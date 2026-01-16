import 'reflect-metadata';
import * as typegoose from '@typegoose/typegoose';
import { Tag } from './tag.model';

class ProductImage {
  @typegoose.prop({ required: true, type: String })
  public url!: string;

  @typegoose.prop({ type: String })
  public alt?: string;

  @typegoose.prop({ default: false, type: Boolean })
  public isPrimary!: boolean;
}

@typegoose.modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'products'
  }
})
export class Product {
  @typegoose.prop({ required: true, trim: true, type: () => String })
  public name!: string;

  @typegoose.prop({ required: true, unique: true, trim: true, type: () => String })
  public slug!: string;

  @typegoose.prop({ required: true, type: String })
  public description!: string;

  @typegoose.prop({ type: String })
  public shortDescription?: string;

  @typegoose.prop({ required: true, min: 0, type: Number })
  public price!: number;

  @typegoose.prop({ min: 0, type: Number })
  public compareAtPrice?: number;

  @typegoose.prop({ type: () => [ProductImage], default: [] })
  public images!: ProductImage[];

  @typegoose.prop({ type: () => [typegoose.mongoose.Schema.Types.ObjectId], ref: () => 'Tag', default: [] })
  public tags!: typegoose.Ref<Tag>[];

  @typegoose.prop({ required: true, min: 0, type: Number, default: 0 })
  public stock!: number;

  @typegoose.prop({ required: true, type: Boolean, default: false })
  public hasColors!: boolean;

  @typegoose.prop({ type: () => [String], default: [] })
  public colors!: string[];

  @typegoose.prop({ required: true, type: Boolean, default: false })
  public hasSizes!: boolean;

  @typegoose.prop({ type: () => [String], default: [] })
  public sizes!: string[];

  @typegoose.prop({ enum: ['draft', 'published', 'archived'], default: 'draft', type: String })
  public status!: 'draft' | 'published' | 'archived';

  @typegoose.prop({ type: () => Object })
  public metadata?: Record<string, any>;

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

if (!(global as any).ProductModel) {
  (global as any).ProductModel = typegoose.getModelForClass(Product);
}
export const ProductModel = (global as any).ProductModel;
