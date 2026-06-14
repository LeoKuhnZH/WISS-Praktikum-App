import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./components/style/style.css";

// Pfad anpassen!
// import API from "./API";

function RegistrierungPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await API.post("/auth/register", {
                username,
                password,
                email,
            });

            console.log("Registrierung erfolgreich:", response.data);
            navigate("/login");
        } catch (error) {
            console.error("Fehler bei der Registrierung:", error);

            setError(
                "Bitte prüfen Sie, ob Ihr Passwort mindestens 8 Zeichen lang ist und die E-Mail-Adresse korrekt ist."
            );
        }
    };

    return (
        <div className="lg-page">
            <div className="lg-card">
                <h2 className="lg-title">Registrierung</h2>

                {error && (
                    <div className="lg-error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div className="lg-field">
                        <input
                            className="lg-input"
                            type="text"
                            placeholder="Username"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="lg-field">
                        <input
                            className="lg-input"
                            type="email"
                            placeholder="E-Mail"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="lg-field">
                        <input
                            className="lg-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Passwort"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingRight: "70px" }}
                            required
                        />

                        <button
                            type="button"
                            className="lg-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button type="submit" className="lg-btn">
                        Registrieren
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegistrierungPage;