import { Link } from "react-router-dom";
import "./Navbar.css";
import "./"

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                Praktikums-Web
            </div>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/registrierung">Registrieren</Link>
            </div>
        </nav>
    );
}

export default Navbar;