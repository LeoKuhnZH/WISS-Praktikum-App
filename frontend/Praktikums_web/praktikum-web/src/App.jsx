import './App.css';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
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
        sessionStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const handleLoginSuccess = (token) => {
        setIsLoggedIn(true);
    };

    return (
        <BrowserRouter>
            <PrivacyBanner />
            <nav className="navbar">
                <Link to="/" className="logo-link">
                    <img src={logo} alt="WISS Hub" className="navbar-logo" />
                </Link>
                <Link to="/jobadd">| Neuer Job Hinzufügen |</Link>
                <Link to="/register">| Registrierung |</Link>

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
                <Route path="/jobadd" element={<JobAdd />} />
                <Route path="/register" element={<RegistrirungPage />} />
                <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route index="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;