'use server';

import { SettingsService } from '../settings/settings.service';
import { revalidatePath } from 'next/cache';

export async function updateAdminThemeAction(theme: 'light' | 'dark') {
    try {
        await SettingsService.updateAdminTheme(theme);
        revalidatePath('/(admin)', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Failed to update theme:', error);
        return { success: false, error: 'Failed to update theme' };
    }
}

export async function getAdminThemeAction() {
    try {
        const theme = await SettingsService.getAdminTheme();
        return { success: true, theme };
    } catch (error) {
        console.error('Failed to get theme:', error);
        return { success: false, error: 'Failed to get theme' };
    }
}
