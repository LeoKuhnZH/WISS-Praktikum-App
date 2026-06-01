import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
export default function LoginForm() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Validation checks based on your regex logic
    const hasLength = password.length >= 8;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/register");
    };


    const [formData, setFormData] = useState({
        username: '', // Geändert von email zu username für die Stellenanzeigen-App
        password: '',
        rememberMe: false
    });


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
        if (hasLength && hasLower && hasNumber) {
            console.log("Formular erfoglreich abgeschickt!", { username, password });
        }
        else {
            alert("Bitte gültiges Password eingeben");
        }
        // Hier kommt deine Login-Logik (z.B. API-Call an dein Backend) hin
        console.log('Praktikums-Login abgeschickt:', formData);
        alert("Erfolgreich eingeloggt");

        if (formData.password.length < 8) {
            alert("Das Password ist zu kurz, bitte erneut eingeben!");
        }
        else {
            alert("Password wurde korrekt validiert!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center login-hintergrund-rot px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">

                {/* Header-Bereich für das Praktikumsportal */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900  shadow-red">
                        Login mit  Stellenkonto
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Benutzername Feld */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Benutzername:
                        </label>
                        <br></br>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder=" DeinUsername"
                        />
                    </div>
                    <br></br>

                    {/* Passwort Feld */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Passwort:
                        </label>
                        <br></br>
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

                        <a href="#" className="font-medium text-blue-600 hover:underline">
                            Passwort vergessen?
                        </a>
                    </div>
                    <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span>Angemeldet bleiben</span>

                    </label>
                    <br></br>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                    >
                        Einloggen
                    </button>
                </form>

                <div id="message">
                    <h3>Password must contain the following:</h3>
                    <p id="letter" className={hasLower ? 'valid' : 'invalid'}>
                        A {hasLower ? <s>lowercase</s> : <b>lowercase</b>} letter
                    </p>
                    <p id="capital" className={hasUpper ? 'valid' : 'invalid'}>
                        A {hasUpper ? <s>capital (uppercase)</s> : <b>capital (uppercase)</b>} letter
                    </p>
                    <p id="number" className={hasNumber ? 'valid' : 'invalid'}>
                        A {hasNumber ? <s>number</s> : <b>number</b>}
                    </p>
                    <p id="length" className={hasLength ? 'valid' : 'invalid'}>
                        Minimum {hasLength ? <s>8 characters</s> : <b>8 characters</b>}
                    </p>
                </div>

                {/* Registrieren Link */}
                <p className="text-sm text-center text-gray-600 mt-6">
                    Noch keinen Account für deine Bewerbung?{' '}
                    <a href="#" onClick={handleClick} className="font-medium text-blue-600 register hover:underline">
                        <p> &#8594; Jetzt  Registrieren&#8592;</p>
                    </a>

                </p>

            </div>
        </div>
    );
}