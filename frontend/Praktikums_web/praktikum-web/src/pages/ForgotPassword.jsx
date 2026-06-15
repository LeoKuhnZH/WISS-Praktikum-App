import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate();

    // 1. State für Formulardaten definiert (Unnötiges 'password' entfernt, da es 'newpassword' ist)
    const [formData, setFormData] = useState({
        username: '',
        oldpassword: '',
        newpassword: '',
        confirmPassword: '',
        rememberMe: false // Als Boolean für die Checkbox initialisiert
    });

    const [error, setError] = useState('');

    // Dynamische Passwort-Validierung (basiert jetzt korrekt auf 'newpassword')
    const hasLength = formData.newpassword.length >= 8;
    const hasLower = /[a-z]/.test(formData.newpassword);
    const hasUpper = /[A-Z]/.test(formData.newpassword);
    const hasNumber = /\d/.test(formData.newpassword);

    // Prüft, ob alle Kriterien erfüllt sind
    const isPasswordValid = hasLength && hasLower && hasUpper && hasNumber;

    // 2. Optimierte handleChange-Funktion (beachtet auch Checkboxes)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validierung: Username-Länge prüfen
        if (formData.username.length < 8) {
            setError("Der Username ist zu kurz! Er muss mindestens 8 Zeichen lang sein.");
            return;
        }

        // Validierung: Altes Passwort prüfen
        if (formData.oldpassword.length < 6) {
            setError("Das alte Passwort ist zu kurz!");
            alert("Bitte ein korrektes Passwort eingeben");
            return;
        }

        // Validierung: Neues Passwort muss den komplexen Kriterien entsprechen
        if (!isPasswordValid) {
            setError("Das neue Passwort erfüllt die Sicherheitsanforderungen nicht.");
            return;
        }

        // Validierung: Passwörter müssen übereinstimmen
        if (formData.newpassword !== formData.confirmPassword) {
            setError("Die Passwörter stimmen nicht überein!");
            return;
        }

        // Wenn alles passt:
        setError('');
        console.log("Passwort erfolgreich zurückgesetzt", formData);
        alert("Dein Passwort wurde erfolgreich geändert!");

        // Weiterleitung zum Login
        navigate("/login");
    };

    return (
        <div className="login-hintergrund-rot min-h-screen flex items-center justify-center">
            <div className="form-karte bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="form-titel text-2xl font-bold mb-6 reset-password2 text-center">Reset Password</h2>

                {/* Fehlermeldung im UI anzeigen */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Benutzername Feld */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Benutzername*:
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text" // Wenn es ein Username ist, lieber 'text'. Wenn E-Mail gewünscht, auf 'email' lassen.
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="DeinUsername"
                        />
                    </div>

                    {/* Altes Passwort Feld */}
                    <div>
                        <label htmlFor="oldpassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Altes Passwort:
                        </label>
                        <input
                            id="oldpassword"
                            name="oldpassword"
                            type="password"
                            required
                            value={formData.oldpassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="Altes Passwort eingeben"
                        />
                    </div>

                    {/* Neues Passwort Feld */}
                    <div>
                        <label htmlFor="newpassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Neues Passwort*:
                        </label>
                        <input
                            id="newpassword"
                            name="newpassword"
                            type="password"
                            required
                            value={formData.newpassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Passwort bestätigen Feld */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Neues Passwort bestätigen:
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="rememberMe" className="text-sm text-gray-700">
                            <b>Passwort speichern</b>
                        </label>
                    </div>

                    {/* Live-Validierungs-Box */}
                    <div id="message" className="password-box p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="title font-semibold text-sm mb-2 text-gray-700">Das Passwort muss Folgendes enthalten:</h3>

                        <p id="letter" className={hasLower ? 'text-green-600 text-sm' : 'text-red-500 text-sm'}>
                            {hasLower ? <span>✓ Ein <b>Kleinbuchstabe</b></span> : <span>• Ein <b>Kleinbuchstabe</b></span>}
                        </p>

                        <p id="capital" className={hasUpper ? 'text-green-600 text-sm' : 'text-red-500 text-sm'}>
                            {hasUpper ? <span>✓ Ein <b>Großbuchstabe</b></span> : <span>• Ein <b>Großbuchstabe</b></span>}
                        </p>

                        <p id="number" className={hasNumber ? 'text-green-600 text-sm' : 'text-red-500 text-sm'}>
                            {hasNumber ? <span>✓ Eine <b>Zahl</b></span> : <span>• Eine <b>Zahl</b></span>}
                        </p>

                        <p id="length" className={hasLength ? 'text-green-600 text-sm' : 'text-red-500 text-sm'}>
                            {hasLength ? <span>✓ Mindestens <b>8 Zeichen</b></span> : <span>• Mindestens <b>8 Zeichen</b></span>}
                        </p>
                    </div>

                    {/* Button zum Abschicken */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg reset-password transition"
                    >
                        Jetzt Passwort zurücksetzen
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;