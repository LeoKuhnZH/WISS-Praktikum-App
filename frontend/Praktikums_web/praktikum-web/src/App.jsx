import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';


// Seiten-Imports
import Home from './pages/Home.jsx';
import RegistrirungPage from './pages/RegistrirungPage.jsx';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import JobAdd from './pages/JobAdd.jsx';
import Konto from './Konto.jsx';

function App() {
  const [suchbegriff, setsuchbegriff] = useState('');

  const handleSucheSubmit = (event) => {
    event.preventDefault();
    alert("Nach dem Begriff " + suchbegriff + " wird gesucht");
  };

  return (
    const handleSucheSubmit = (event) => {
      event.preventDefault();
      alert("Nach dem Begriff" + "" + suchbegriff + "" + "wird gesucht");
    };
    return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/">| Home |</Link>
        <Link to="/jobadd">| Neuer Job Hinzufügen |</Link>
        <Link to="/register">| Registrierung |</Link>
        <Link to="/login">| Login |</Link>


        {/* Navigation */}
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/jobadd">Neuer Job Hinzufügen</Link>
          <Link to="/konto">Mein Konto</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Konto erstellen</Link>
          <Link to="/forgotpassword">Passwort vergessen</Link>

          <form onSubmit={handleSucheSubmit} style={{ marginLeft: 'auto', color: 'brown' }}>
            <input
              type="search"
              placeholder="Suchen..."
              value={suchbegriff}
              onChange={(e) => setsuchbegriff(e.target.value)}
              style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
            <button type="submit" style={{ padding: '5px 10px', marginLeft: '10px', backgroundColor: "brown" }}>🔍</button>
          </form>
        </nav>

        {/* Routen-Verwaltung */}
        <Routes>
          {/* ÖFFENTLICHE ROUTEN */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrirungPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          {/* GESCHÜTZTE ROUTEN (Hier kannst du ProtectedRoute nutzen, falls gewünscht) */}
          <Route path="/jobadd" element={<JobAdd />} />
          <Route path="/konto" element={<Konto />} />
        </Routes>

    </BrowserRouter>
  );
}

export default App;