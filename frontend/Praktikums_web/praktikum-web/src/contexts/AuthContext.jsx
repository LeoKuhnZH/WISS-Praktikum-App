import { createContext, useState, useContext } from "react";
import { Navigate } from "react-router-dom"; // Wichtig für die Weiterleitung

// 1. Context erstellen
const AuthContext = createContext();

// 2. Provider Komponente (Muss exportiert werden!)
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Beispiel-Funktionen, damit der Value nicht abstürzt
    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Eigener Hook für den einfachen Zugriff (useAuth)
export function useAuth() {
    return useContext(AuthContext);
}

// 4. Die geschützte Route
export function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    // Wenn eingeloggt: Zeige die geschützte Seite (children)
    // Wenn NICHT eingeloggt: Leite weiter (nur EIN return!)
    return isAuthenticated ? children : <Navigate to="/home" />;
}