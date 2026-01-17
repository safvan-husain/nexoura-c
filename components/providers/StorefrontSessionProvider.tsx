'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StorefrontSessionResponse } from '@/lib/storefront-session/storefront-session.schema';

interface StorefrontSessionContextType {
    session: StorefrontSessionResponse | null;
    isLoading: boolean;
    refreshSession: () => Promise<void>;
}

const StorefrontSessionContext = createContext<StorefrontSessionContextType | undefined>(undefined);

export function StorefrontSessionProvider({
    children,
    initialSession,
}: {
    children: React.ReactNode;
    initialSession: StorefrontSessionResponse | null;
}) {
    const [session, setSession] = useState<StorefrontSessionResponse | null>(initialSession);
    const [isLoading, setIsLoading] = useState(!initialSession);

    const fetchSession = async () => {
        try {
            const res = await fetch('/api/storefront/session', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setSession(data);
            }
        } catch (error) {
            console.error('Failed to fetch storefront session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!initialSession) {
            fetchSession();
        }
    }, [initialSession]);

    const refreshSession = async () => {
        setIsLoading(true);
        await fetchSession();
    };

    return (
        <StorefrontSessionContext.Provider value={{ session, isLoading, refreshSession }}>
            {children}
        </StorefrontSessionContext.Provider>
    );
}

export function useStorefrontSession() {
    const context = useContext(StorefrontSessionContext);
    if (context === undefined) {
        throw new Error('useStorefrontSession must be used within a StorefrontSessionProvider');
    }
    return context;
}
