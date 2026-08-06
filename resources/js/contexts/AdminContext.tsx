import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AdminContextType {
    badges: {
        orders: number;
        messages: number;
    };
    refreshBadges: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [badges, setBadges] = useState({ orders: 0, messages: 0 });

    const refreshBadges = async () => {
        try {
            const secretPath = import.meta.env.VITE_ADMIN_SECRET_PATH || 'yann-gestion';
            const response = await axios.get(`/${secretPath}/badges`);
            setBadges(response.data);
        } catch (error) {
            console.error('Erreur chargement badges', error);
        }
    };

    useEffect(() => {
        refreshBadges();
        // Rafraîchir toutes les 30 secondes
        const interval = setInterval(refreshBadges, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AdminContext.Provider value={{ badges, refreshBadges }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
