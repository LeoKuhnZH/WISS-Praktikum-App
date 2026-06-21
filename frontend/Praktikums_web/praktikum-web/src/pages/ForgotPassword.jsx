import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./components/style/style.css";

function ForgotPassword() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        oldpassword: '',
        newpassword: '',
        confirmPassword: '',
        rememberMe: false
    });

    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Dynamische Passwort-Validierung
    const hasLength = formData.newpassword.length >= 8;
    const hasLower = /[a-z]/.test(formData.newpassword);
    const hasUpper = /[A-Z]/.test(formData.newpassword);
    const hasNumber = /\d/.test(formData.newpassword);

    const isPasswordValid = hasLength && hasLower && hasUpper && hasNumber;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.username.length < 8) {
            setError("Der Username ist zu kurz! Er muss mindestens 8 Zeichen lang sein.");
            return;
        }

        if (!isPasswordValid) {
            setError("Das neue Passwort erfüllt die Sicherheitsanforderungen nicht.");
            alert("Neues Passwort ist nicht valide!");
            return;
        }

        if (formData.newpassword !== formData.confirmPassword) {
            setError("Die Passwörter stimmen nicht überein!");
            alert("Neues und altes Passwort stimmen nicht überein!");
            return;
        }

        setError('');
        console.log("Passwort erfolgreich zurückgesetzt", formData);
        alert("Dein Passwort wurde erfolgreich geändert!");
        navigate("/login");
    };

    return (
        <div className="lg-page">
            <div className="lg-card">
                <h1 className="lg-title">Reset Password</h1>
                <br />

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Benutzername Feld */}
                    <div className="lg-field">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="lg-input"
                            placeholder="E-mail"
                            autoComplete="username"
                        />
                    </div>

                    {/* Neues Passwort Feld mit integriertem Button */}
                    <div className="lg-field">
                        <input
                            id="newpassword"
                            name="newpassword"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.newpassword}
                            onChange={handleChange}
                            placeholder="New Password"
                            className="lg-input"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="lg-toggle"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {/* Passwort bestätigen Feld mit integriertem Button */}
                    <div className="lg-field">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="lg-input"
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="lg-toggle"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <label className="lg-remember">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                        Remember me
                    </label>

                    {/* Live-Validierungs-Box */}
                    <div className="rg-card">
                        <h3 className="title font-semibold text-sm mb-2 text-gray-700">Das Passwort muss Folgendes enthalten:</h3>
                        <p className={hasLower ? 'text-green-600 text-sm' : 'text-red-500 text-sm'}>
                            {hasLower ? <span>✓ Ein <b>Kleinbuchstabe</b></span> : <span>• Ein <b>Kleinbuchstabe</b></span>}
                        </p>
                        <p className={hasUpper ? 'text-green-600 text-sm' : 'text-red-500 text-sm'}>
                            {hasUpper ? <span>✓ Ein <b>Großbuchstabe</b></span> : <span>• Ein <b>Großbuchstabe</b></span>}
                        </p>
                        <p className={hasNumber ? 'text-green-600 text-sm' : 'text-red-500 text-sm'}>
                            {hasNumber ? <span>✓ Eine <b>Zahl</b></span> : <span>• Eine <b>Zahl</b></span>}
                        </p>
                        <p className={hasLength ? 'text-green-600 text-sm' : 'text-red-500 text-sm'}>
                            {hasLength ? <span>✓ Mindestens <b>8 Zeichen</b></span> : <span>• Mindestens <b>8 Zeichen</b></span>}
                        </p>
                    </div>

                    <br />
                    <button type="submit" className="lg-btn">
                        Jetzt Passwort zurücksetzen
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;