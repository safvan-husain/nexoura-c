import 'reflect-metadata';
import * as typegoose from '@typegoose/typegoose';

@typegoose.modelOptions({
    schemaOptions: {
        timestamps: true,
        collection: 'tags'
    }
})
export class Tag {
    @typegoose.prop({ required: true, trim: true, type: () => String })
    public name!: string;

    @typegoose.prop({ required: true, unique: true, trim: true, type: () => String })
    public slug!: string;

    @typegoose.prop({ type: String })
    public description?: string;
}

if (!(global as any).TagModel) {
    (global as any).TagModel = typegoose.getModelForClass(Tag);
}
export const TagModel = (global as any).TagModel;
