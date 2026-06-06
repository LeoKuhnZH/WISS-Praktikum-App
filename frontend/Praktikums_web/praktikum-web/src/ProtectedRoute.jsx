import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    // Hol dir zusätzlich den Ladezustand aus deinem Context
    const { isAuthenticated, isLoading } = useAuth();

    // 1. WENN die App noch prüft, ob der User eingeloggt ist:
    // Zeige einen Ladebildschirm und leite noch NICHT weiter!
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Lade Profil...</div>;
    }

    // 2. ERST WENN das Laden fertig ist, wird entschieden:
    // Eingeloggt -> Seite zeigen | Nicht eingeloggt -> Login-Seite
    return isAuthenticated ? children : <Navigate to="/konto" replace />;
}

export default ProtectedRoute;