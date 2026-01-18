import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// Product image interface
export interface IProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

// Product document interface
export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: IProductImage[];
  tags: Types.ObjectId[];
  stock: number;
  hasColors: boolean;
  colors: string[];
  hasSizes: boolean;
  sizes: string[];
  status: 'draft' | 'published' | 'archived';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  // Virtual properties
  isInStock: boolean;
  hasDiscount: boolean;
  discountPercentage: number;
}

// Product image schema
const ProductImageSchema = new Schema<IProductImage>({
  url: { type: String, required: true },
  alt: { type: String },
  isPrimary: { type: Boolean, default: false }
}, { _id: false });

// Product schema
const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  images: { type: [ProductImageSchema], default: [] },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  stock: { type: Number, required: true, min: 0, default: 0 },
  hasColors: { type: Boolean, required: true, default: false },
  colors: { type: [String], default: [] },
  hasSizes: { type: Boolean, required: true, default: false },
  sizes: { type: [String], default: [] },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  metadata: { type: Schema.Types.Mixed }
}, {
  timestamps: true,
  collection: 'products'
});

// Virtual properties
ProductSchema.virtual('isInStock').get(function (this: IProduct) {
  return this.stock > 0;
});

ProductSchema.virtual('hasDiscount').get(function (this: IProduct) {
  return !!this.compareAtPrice && this.compareAtPrice > this.price;
});

ProductSchema.virtual('discountPercentage').get(function (this: IProduct) {
  if (!this.hasDiscount || !this.compareAtPrice) return 0;
  return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
});

// Model
let ProductModel: Model<IProduct>;

if (!(global as any).ProductModel) {
  ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
  (global as any).ProductModel = ProductModel;
} else {
  ProductModel = (global as any).ProductModel;
}

export { ProductModel };
