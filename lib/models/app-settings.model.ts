import 'reflect-metadata';
import * as typegoose from '@typegoose/typegoose';

@typegoose.modelOptions({
    schemaOptions: {
        timestamps: true,
        collection: 'app_settings'
    }
})
export class AppSettings {
    @typegoose.prop({ enum: ['light', 'dark'], default: 'light', type: String })
    public adminTheme!: 'light' | 'dark';

    @typegoose.prop({ required: true, default: 'default', unique: true, type: String })
    public settingsId!: string;
}

if (!(global as any).AppSettingsModel) {
    (global as any).AppSettingsModel = typegoose.getModelForClass(AppSettings);
}
export const AppSettingsModel = (global as any).AppSettingsModel;
