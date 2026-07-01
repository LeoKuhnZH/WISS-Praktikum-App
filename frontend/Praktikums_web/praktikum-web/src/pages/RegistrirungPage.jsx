import {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./components/style/style.css";

function RegistrierungPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwörter stimmen nicht überein.");
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Registrierung fehlgeschlagen");
            }

            navigate("/login");
        } catch (error) {
            console.error("Fehler bei der Registrierung: hat ihr passwort mehr als 6 Zeichen", error);
            setError(error.message || "Fehler bei der Registrierung.");
        }
    };

    return (
        <div className="lg-page">
            <div className="lg-card">
                <h1 className="lg-title">Registrierung</h1>

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
                            style={{paddingRight: "70px"}}
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
                    <div className="lg-field">
                        <input
                            className="lg-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Passwort"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{paddingRight: "70px"}}
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
                <br>
                </br>
                <div className="rg-card">
                    <h3 className="#"> Anforderungen:</h3>
                    <p>Passwort-Anforderungen:</p>
                    <ul>
                        <li className="rg-item"> Mindestens 8 Zeichen lang</li>
                        <li className="rg-item">Mindestens 1 Großbuchstabe (A-Z)</li>
                        <li className="rg-item">Mindestens 1 Kleinbuchstabe (a-z)</li>
                        <li className="rg-item">Mindestens 1 Zahl (0-9)</li>
                        <li className="rg-item">Mindestens 1 Sonderzeichen (!@#$%^&* usw.)</li>

                    </ul>
                    <p>E-Mail-Anforderungen:</p>
                    <ul>
                        <li className="rg-item">Muss eine gültige E-Mail-Adresse sein</li>
                        <li className="rg-item">Muss ein @ enthalten</li>
                        <li className="rg-item">Muss eine Domain enthalten (z.B. .de, .com, .ch)</li>

                    </ul>
                </div>
            </div>

        </div>
    );
}

export default RegistrierungPage;