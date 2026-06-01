import './App.css';
// KORREKTUR 1: Routes, Route und BrowserRouter aus 'react-router-dom' importieren
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Deine vorhandenen Imports
import RegistrirungPage from './RegistrirungPage.jsx';
import LoginForm from './Login.jsx';
import Home from './Home.jsx';

// KORREKTUR 2: Dummy-Komponenten für Filme, Games etc. (falls sie noch nicht existieren)
// Wenn du diese in eigenen Dateien hast, ersetze sie durch echte Imports wie: 
// import Filme from './Filme.jsx';


function App() {
  return (
    // KORREKTUR 3: Alles muss in <BrowserRouter> eingepackt sein, damit <Link> und <Routes> funktionieren
    <BrowserRouter>
      <nav className="task">
        <Link to="/register">Registrierung</Link>
        <Link to="/login">Login</Link>
        <Link to="/">Home</Link>
      </nav>

      <Routes>

        <Route path="/register" element={<RegistrirungPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route index="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;