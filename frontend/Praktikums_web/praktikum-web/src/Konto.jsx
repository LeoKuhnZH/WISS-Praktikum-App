import './style.css';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';


function Konto() {
    // State erweitert um die Checkbox und ein lokales Error-Feld
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
        berufe: 'applikation' // Für die Checkbox
    });

    const navigate = useNavigate();
    const [error, setError] = useState('');




    const hasLength = formData.password.length >= 8;
    const hasLower = /[a-z]/.test(formData.password);
    const hasUpper = /[A-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);

    // Prüft, ob alle Kriterien erfüllt sind
    const isPasswordValid = hasLength && hasLower && hasUpper && hasNumber;



    const handleClick = (e) => {
        e.preventDefault(); // Verhindert das Neuladen der Seite beim Link-Klick
        navigate("/register");
    };

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

        // 1. Validierung: Username-Länge prüfen
        if (formData.username.length < 8) {
            setError("Der Username ist zu kurz! Er muss mindestens 8 Zeichen lang sein.");
            alert("Bitte ein gültiger Username eingeben");
            return; // Wichtig: Bricht die Funktion hier ab
        }

        // 2. Validierung: Passwörter müssen übereinstimmen
        if (formData.password !== formData.confirmPassword) {
            setError("Die Passwörter stimmen nicht überein!");
            alert("Bitte korrekte Passwörter eingeben!");
            return;
        }

        // 3. Validierung: Mindestlänge für Passwort
        if (formData.password.length < 6) {
            setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
            alert("Bitte das Password erneut eingeben!");
            return; // Bricht die Funktion ab
        }

        setError('');
        console.log("Registrierung abgeschlossen", formData);
        alert("Du bist erfolgreich registriert mit deinem Konto!");
        navigate("/login");


    };

    return (
        <div className="login-hintergrund-rot min-h-screen flex-center">
            <div className="form-karte">
                <h2 className="form-titel ">Konto erstellen</h2>
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

                    <div
                        className="checkbox-block"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center', // Schiebt alle Elemente nach rechts
                            gap: '8px',
                            marginBottom: '15px'
                        }}
                    >

                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                        <br></br>
                        <label htmlFor="rememberMe"><b>Passwort bitte speichern </b></label>
                    </div>


                    <div id="message" className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                        <h3 className="font-bold text-gray-700 mb-2">Das Passwort muss Folgendes enthalten:</h3>

                        <p id="letter" className={hasLower ? 'text-green-600' : 'text-red-500'}>
                            {hasLower ? <s>✓ Ein Kleinbuchstabe</s> : <span>• Ein <b>Kleinbuchstabe</b></span>}
                        </p>

                        <p id="capital" className={hasUpper ? 'text-green-600' : 'text-red-500'}>
                            {hasUpper ? <s>✓ Ein Großbuchstabe</s> : <span>• Ein <b>Großbuchstabe</b></span>}
                        </p>

                        <p id="number" className={hasNumber ? 'text-green-600' : 'text-red-500'}>
                            {hasNumber ? <s>✓ Eine Zahl</s> : <span>• Eine <b>Zahl</b></span>}
                        </p>

                        <p id="length" className={hasLength ? 'text-green-600' : 'text-red-500'}>
                            {hasLength ? <s>✓ Mindestens 8 Zeichen</s> : <span>• Mindestens <b>8 Zeichen</b></span>}
                        </p>
                    </div>

                    <button type="submit" className="registration" >
                        <p>&#8594;</p>Konto erstellen<p>&#8594;</p>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Konto;