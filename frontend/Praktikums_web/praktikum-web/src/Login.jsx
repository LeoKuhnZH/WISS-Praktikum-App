import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    // Nur noch ein zentraler State für alle Formulardaten
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });

    const [error, setError] = useState('');

    // Die Live-Validierung greift jetzt direkt auf formData.password zu!
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

    // Handler für Änderungen in den Inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handler für das Abschicken des Formulars
    const handleSubmit = (e) => {
        e.preventDefault();

        // Fehler zurücksetzen
        setError('');

        // Abschicken blockieren, wenn das Passwort nicht valide ist
        if (!isPasswordValid) {
            setError("Bitte erfülle alle Passwort-Kriterien, bevor du dich einloggst.");
            return;
        }

        // Hier kommt deine Login-Logik (z.B. API-Call an dein Backend) hin
        console.log('Praktikums-Login erfolgreich abgeschickt:', formData);
        alert("Erfolgreich eingeloggt!");

        if (formData.password.length < 8) {
            alert("Das Password ist ungültig!");
        }


        setError('');
        console.log("Login mit Credentials abgeschlossen", formData);
        alert("Du bist erfolgreich mit deinem Konto eingeloggt!");
        navigate("/register");
    };

    return (
        <div className="min-h-screen flex items-center justify-center login-hintergrund-rot px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">

                {/* Header-Bereich für das Praktikumsportal */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900 shadow-red">
                        Login mit Stellenkonto
                    </h2>
                </div>

                {/* Inline-Fehlermeldung, falls die Validierung fehlschlägt */}
                {error && <div className="text-red-600 font-bold mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Benutzername Feld */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Benutzername:
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="DeinUsername"
                        />
                    </div>

                    {/* Passwort Feld */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Passwort:
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Interaktionen: Angemeldet bleiben & Passwort vergessen */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span>Angemeldet bleiben</span>
                            <br></br>
                        </label>


                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                    >
                        Einloggen
                    </button>
                    <br></br>

                    <a href="/forgotpassword" className="font-medium text-blue-600 hover:underline">
                        Passwort vergessen?
                    </a>
                </form>

                {/* Live-Validierungs-Anzeige */}
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

                {/* Registrieren Link */}
                <p className="text-sm text-center text-gray-600 mt-6">
                    Noch keinen Account für deine Bewerbung?{' '}
                    <a href="#" onClick={handleClick} className="font-medium text-blue-600 hover:underline inline-block mt-1">
                        &rarr; Jetzt Registrieren &larr;
                    </a>
                </p>

            </div>
        </div>
    );
}

export default Login;   