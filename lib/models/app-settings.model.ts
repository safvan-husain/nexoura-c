import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// AppSettings document interface
export interface IAppSettings extends Document {
    _id: Types.ObjectId;
    adminTheme: 'light' | 'dark';
    settingsId: string;
    createdAt: Date;
    updatedAt: Date;
}

// AppSettings schema
const AppSettingsSchema = new Schema<IAppSettings>({
    adminTheme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    },
    settingsId: { type: String, required: true, default: 'default', unique: true }
}, {
    timestamps: true,
    collection: 'app_settings'
});

// Model
let AppSettingsModel: Model<IAppSettings>;

if (!(global as any).AppSettingsModel) {
    AppSettingsModel = mongoose.model<IAppSettings>('AppSettings', AppSettingsSchema);
    (global as any).AppSettingsModel = AppSettingsModel;
} else {
    AppSettingsModel = (global as any).AppSettingsModel;
}

export { AppSettingsModel };
