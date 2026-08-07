import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        // Leitet nicht-eingeloggte Nutzer zum Login weiter
        return <Navigate to="/login" replace />;

    }

    return children;
};

export default ProtectedRoute;