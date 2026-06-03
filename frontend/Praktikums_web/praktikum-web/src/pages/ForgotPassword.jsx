import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate();

    // 1. State für Formulardaten und Fehlermeldungen definiert
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        oldpassword: '',
        rememberMe: ''
    });




    const hasLength = formData.password.length >= 8;
    const hasLower = /[a-z]/.test(formData.password);
    const hasUpper = /[A-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);

    // Prüft, ob alle Kriterien erfüllt sind
    const isPasswordValid = hasLength && hasLower && hasUpper && hasNumber;

    const [error, setError] = useState('');

    // 2. handleChange-Funktion hinzugefügt, damit man überhaupt tippen kann
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validierung: Username-Länge prüfen
        if (formData.username.length < 8) {
            setError("Der Username ist zu kurz! Er muss mindestens 8 Zeichen lang sein.");
            return;
        }

        // Validierung: Mindestlänge für Passwort
        if (formData.password.length < 6) {
            setError("Das neue Passwort muss mindestens 6 Zeichen lang sein.");
            return;
        }

        // Validierung: Passwörter müssen übereinstimmen
        if (formData.password !== formData.confirmPassword) {
            setError("Die Passwörter stimmen nicht überein!");
            return;
        }

        if (formData.oldpassword < 6) {
            setError("Das alte Password ist zu kurz!");
            alert("Bitte ein korrektes Password eingeben");
        }

        // Wenn alles passt:
        setError('');
        console.log("Passwort erfolgreich zurückgesetzt", formData);
        alert("Dein Passwort wurde erfolgreich geändert!");

        // Weiterleitung zum Login (oder wo auch immer du hinwillst)
        navigate("/login");
    };

    return (
        <div className="login-hintergrund-rot min-h-screen flex items-center justify-center">
            <div className="form-karte bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="form-titel text-2xl font-bold mb-6 reset-password2 text-center">Reset Password</h2>

                {/* Fehlermeldung im UI anzeigen, wenn eine existiert */}
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
                            type="text"
                            required="username eingeben..."
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="DeinUsername"
                        />

                    </div>

                    <div>
                        <label htmlfor="oldpassword" classname=" block text-sm font-medium text-gray-700 mb-1">Altes Password</label>
                        <input
                            id="oldpassword"
                            name="oldpassword"
                            type="password"
                            required="Bitte Password eingeben"
                            value={formData.oldpassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="Altes Password eingeben"
                        />



                    </div>
                    {/* Passwort Feld */}
                    <div>
                        <label htmlFor="oldpassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Neues Passwort*:
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required="Password bitte eingeben"
                            value={formData.o}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Passwort bestätigen Feld (Fehlte im JSX) */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Neues Passwort bestätigen:
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required="Neues Password eingeben"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                    />
                    <label htmlFor="rememberMe"><b>Passwort speichern</b></label>


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


                    {/* Button zum Abschicken */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg  reset-password transition"
                    >
                        Jetzt Password zurücksetzen
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;