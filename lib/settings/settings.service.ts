import { connectDB } from '../db/mongo-client';
import { AppSettingsModel } from '../models/app-settings.model';

export class SettingsService {
    private static readonly DEFAULT_SETTINGS_ID = 'default';

    static async getAdminTheme(): Promise<'light' | 'dark'> {
        await connectDB();
        const settings = await AppSettingsModel.findOne({ settingsId: this.DEFAULT_SETTINGS_ID });
        return settings?.adminTheme || 'light';
    }

    static async updateAdminTheme(theme: 'light' | 'dark'): Promise<void> {
        await connectDB();
        await AppSettingsModel.findOneAndUpdate(
            { settingsId: this.DEFAULT_SETTINGS_ID },
            { adminTheme: theme },
            { upsert: true, new: true }
        );
    }
}
