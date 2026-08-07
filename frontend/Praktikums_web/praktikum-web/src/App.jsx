import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useRef } from 'react';

import RegistrirungPage from './pages/RegistrirungPage.jsx';
import LoginForm from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import JobAdd from './pages/JobAdd.jsx';
import PrivacyBanner from './components1/PrivacyBanner.jsx';
import logo from './assets/PraktikumRound.png';
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Profile from "./pages/Profile.jsx";

// AuthContext & ProtectedRoute Import
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components1/ProtectedRoute.jsx';

function Navigation() {
    const { isLoggedIn, logout } = useAuth();
    const [suchbegriff, setsuchbegriff] = useState('');
    const [radioLaeuft, setRadioLaeuft] = useState(false);

    const radioRef = useRef(
        new Audio("https://livestreaming-node-1.srg-ssr.ch/srgssr/rsc_de/mp3/128")
    );

    const handleSucheSubmit = (event) => {
        event.preventDefault();
        alert("Nach dem Begriff " + suchbegriff + " wird gesucht");
    };

    const playRadio = () => {
        radioRef.current.load();
        radioRef.current.play().catch(err => console.log(err));
        setRadioLaeuft(true);
    };

    const stopRadio = () => {
        radioRef.current.pause();
        radioRef.current.currentTime = 0;
        setRadioLaeuft(false);
    };

    const toggleRadio = () => {
        if (radioLaeuft) stopRadio();
        else playRadio();
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo-link">
                <img src={logo} alt="WISS Hub" className="navbar-logo" />
            </Link>

            {/* Links, die nur nach dem Login sichtbar sein sollen */}
            {isLoggedIn && (
                <>
                    <Link to="/jobadd">| Neuer Job Hinzufügen |</Link>
                    <Link to="/profile">| Mein Account |</Link>
                </>
            )}

            {!isLoggedIn && (
                <Link to="/register">| Registrierung |</Link>
            )}

            {isLoggedIn ? (
                <button
                    onClick={logout}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', color: 'inherit' }}
                >
                    | Abmelden |
                </button>
            ) : (
                <Link to="/login">| Login |</Link>
            )}

            <button onClick={toggleRadio} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}>
                | {radioLaeuft ? '⏸ Radio' : '▶ Radio'} |
            </button>

            <form onSubmit={handleSucheSubmit} style={{ marginLeft: 'auto', color: 'brown' }}>
                <input
                    type="search"
                    placeholder="Suchen..."
                    value={suchbegriff}
                    onChange={(e) => setsuchbegriff(e.target.value)}
                    style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '5px 10px', marginLeft: '5px' }}>🔍</button>
            </form>
        </nav>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <PrivacyBanner />
                <Navigation />

                <Routes>
                    {/* Öffentliche Routen */}
                    <Route path="/register" element={<RegistrirungPage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />

                    {/* Geschützte Routen (Nur nach Login zugänglich) */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/jobadd"
                        element={
                            <ProtectedRoute>
                                <JobAdd />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;