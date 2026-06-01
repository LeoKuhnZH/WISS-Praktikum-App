import './style.css';
import { useState } from 'react';

function Home() {
    // State erweitert um die Checkbox und ein lokales Error-Feld
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        rememberMe: false // Für die Checkbox
    });

    const [error, setError] = useState('');

    // Änderungen an allen Feldern (auch Checkboxen) erfassen
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            // Wenn es eine Checkbox ist, nutzen wir 'checked', sonst 'value'
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Aktion beim Abschicken
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validierung: Passwörter müssen übereinstimmen
        if (formData.password !== formData.confirmPassword) {
            setError("Die Passwörter stimmen nicht überein!");
            return;
        }

        // Mindestlänge für Passwort als zusätzlicher Schutz
        if (formData.password.length < 6) {
            setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
            return;
        }

        // Wenn alles passt: Fehler zurücksetzen
        setError('');
        console.log("Registrierungsdaten abgesendet:", formData);
        alert("Registrierung erfolgreich (Test)!");
    };

    return (
        <div className="login-hintergrund-rot min-h-screen flex-center">
            <div className="form-karte">
                <h2 className="form-titel">Konto erstellen</h2>
                <p className="form-untertitel">Registriere dich für dein Stellenkonto</p>

                {/* Inline-Fehlermeldung statt nervigem Alert */}
                {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="form-gruppe">
                    <div className="input-block">
                        <label className="form-label">Benutzername</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Dein Wunsch-Username"
                        />
                    </div>

                    <div className="input-block">
                        <label className="form-label">Passwort</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="input-block">
                        <label className="form-label">Passwort wiederholen</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Korrigierter Checkbox-Bereich */}
                    <div className="checkbox-block" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                        <label htmlFor="rememberMe">Passwort speichern</label>
                    </div>

                    <button type="submit" className="registration">
                        Jetzt Registrieren
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Home;