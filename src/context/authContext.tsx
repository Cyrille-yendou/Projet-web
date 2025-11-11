
import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/user';
import { signInGET } from '../serviceAPI/authenticator';

// la structure du contexte
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    checkAuth: () => Promise<void>; // Fonction pour recharger l'état d'authentification
    setUser: (user: User | null) => void;
    setIsAuthenticated: (status: boolean) => void;
}

export const initialAuthState: AuthState = {
    user:null,
    isAuthenticated: false,
    loading: true,
    error: null,
    checkAuth: async () => {}, // Sera surchargé
    setUser: () => {},
    setIsAuthenticated: () => {},
};

export const AuthContext = createContext<AuthState>(initialAuthState);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuthState.isAuthenticated);
    const [loading, setLoading] = useState<boolean>(initialAuthState.loading);
    const [error, setError] = useState<string | null>(initialAuthState.error);

    // Fonction pour vérifier l'état d'authentification après une action (login/logout)
    const checkAuth = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const profil = await signInGET(); 
            setUser(profil);
            setIsAuthenticated(true);
        } catch (err) {
            setUser(null); // Réinitialiser l'utilisateur en cas d'échec
            setIsAuthenticated(false);
            // setError(err.message); // Laisser l'erreur silencieuse si c'est juste non connecté
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    
    const contextValue = useMemo(() => ({
        user,
        isAuthenticated,
        loading,
        error,
        checkAuth,
        setUser,
        setIsAuthenticated,
    }), [user, isAuthenticated, loading, error, checkAuth]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
