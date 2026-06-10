import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useRef } from 'react';

import RegistrirungPage from './pages/RegistrirungPage.jsx';
import LoginForm from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import JobAdd from './pages/JobAdd.jsx';
import PrivacyBanner from './components1/PrivacyBanner.jsx';

function App() {

    const [suchbegriff, setsuchbegriff] = useState('');

    const handleSucheSubmit = (event) => {
        event.preventDefault();
        alert("Nach dem Begriff" + "" + suchbegriff + "" + "wird gesucht");
    };

    const radioRef = useRef(
        new Audio("https://energyzuerich.ice.infomaniak.ch/energyzuerich-high.mp3")
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

    return (
        <BrowserRouter>
            <PrivacyBanner />
            <nav className="navbar">
                <Link to="/">| Home |</Link>
                <Link to="/jobadd">| Neuer Job Hinzufügen |</Link>
                <Link to="/register">| Registrierung |</Link>
                <Link to="/login">| Login |</Link>

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
                <Route path="/login" element={<LoginForm />} />
                <Route index="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;