import './App.css';
// KORREKTUR 1: Routes, Route und BrowserRouter aus 'react-router-dom' importieren
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Deine vorhandenen Imports
import RegistrirungPage from './RegistrirungPage.jsx';
import LoginForm from './Login.jsx';
import Home from './Home.jsx';
import { useState } from 'react';
import ForgotPassword from './ForgotPassword.jsx';

// KORREKTUR 2: Dummy-Komponenten für Filme, Games etc. (falls sie noch nicht existieren)
// Wenn du diese in eigenen Dateien hast, ersetze sie durch echte Imports wie: 
// import Filme from './Filme.jsx';


function App() {

  const [suchbegriff, setsuchbegriff] = useState('');

  const handleSucheSubmit = (event) => {
    event.preventDefault();
    alert("Nach dem Begriff" + "" + suchbegriff + "" + "wird gesucht");
  };
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/register">Registrierung</Link>
        <Link to="/login">Login</Link>
        <Link to="/">Home</Link>
        <Link to="/forgotpassword">Password</Link>

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

        <Route path="/register" element={<RegistrirungPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route index="/" element={<Home />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


