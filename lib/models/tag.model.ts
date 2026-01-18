import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// Tag document interface
export interface ITag extends Document {
    _id: Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Tag schema
const TagSchema = new Schema<ITag>({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String }
}, {
    timestamps: true,
    collection: 'tags'
});

// Model
let TagModel: Model<ITag>;

if (!(global as any).TagModel) {
    TagModel = mongoose.model<ITag>('Tag', TagSchema);
    (global as any).TagModel = TagModel;
} else {
    TagModel = (global as any).TagModel;
}

export { TagModel };
