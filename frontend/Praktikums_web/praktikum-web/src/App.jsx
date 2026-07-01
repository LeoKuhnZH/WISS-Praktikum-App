import './App.css';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useRef } from 'react';

import RegistrirungPage from './pages/RegistrirungPage.jsx';
import LoginForm from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import JobAdd from './pages/JobAdd.jsx';
import PrivacyBanner from './components1/PrivacyBanner.jsx';
import logo from './assets/PraktikumRound.png';
import ForgotPassword from "./pages/ForgotPassword.jsx";

function App() {

    const [suchbegriff, setsuchbegriff] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
    );
    const [userRole, setUserRole] = useState(
        localStorage.getItem('role') || sessionStorage.getItem('role') || null
    );

    const handleSucheSubmit = (event) => {
        event.preventDefault();
        alert("Nach dem Begriff" + "" + suchbegriff + "" + "wird gesucht");
    };

    const radioRef = useRef(
        new Audio("https://livestreaming-node-1.srg-ssr.ch/srgssr/rsc_de/mp3/128")
    );

    const [radioLaeuft, setRadioLaeuft] = useState(false);

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        setIsLoggedIn(false);
        setUserRole(null);
    };

    const handleLoginSuccess = (data) => {
        setIsLoggedIn(true);
        setUserRole(data.role);
    };

    return (
        <BrowserRouter>
            <PrivacyBanner />
            <nav className="navbar">
                <Link to="/" className="logo-link">
                    <img src={logo} alt="WISS Hub" className="navbar-logo" />
                </Link>

                {(userRole === 'ADMIN' || userRole === 'SCHULE') && <Link to="/jobadd">| Neuer Job Hinzufügen |</Link>}
                {!isLoggedIn && <Link to="/register">| Registrierung |</Link>}

                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
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

            <Routes>
                <Route
                    path="/jobadd"
                    element={
                        isLoggedIn && (userRole === 'ADMIN' || userRole === 'SCHULE') ? (
                            <JobAdd />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route path="/register" element={!isLoggedIn ? <RegistrirungPage /> : <Navigate to="/" replace />} />
                <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route index="/" element={<Home isLoggedIn={isLoggedIn} userRole={userRole} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;