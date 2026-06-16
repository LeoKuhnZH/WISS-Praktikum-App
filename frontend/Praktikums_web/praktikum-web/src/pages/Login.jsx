import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
 
function Login() {
    const navigate = useNavigate();
 
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        rememberMe: false,
    });
 
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
 
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
 
        if (!formData.username.trim() || !formData.password) {
            setError("Bitte alle Felder ausfüllen.");
            return;
        }
 
        try {
            setLoading(true);
 
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username.trim(),
                    password: formData.password,
                }),
            });
 
            if (!res.ok) {
                throw new Error("Login failed");
            }
 
            const data = await res.json();
            if (formData.rememberMe) {
                localStorage.setItem("token", data.token);
            } else {
                sessionStorage.setItem("token", data.token);
            }
 
            navigate("/konto");
        } catch (err) {
            setError("Login fehlgeschlagen.");
        } finally {
            setLoading(false);
        }
    };
 
    return (
<div className="lg-page">
<style>{`
                .lg-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    background: #ffffff;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
                .lg-card {
                    width: 100%;
                    max-width: 400px;
                    padding: 40px 32px;
                    border-radius: 16px;
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
                }
                .lg-title {
                    color: #1f2937;
                    font-size: 26px;
                    font-weight: 700;
                    text-align: center;
                    margin: 0 0 8px;
                }
                .lg-sub {
                    color: #6b7280;
                    font-size: 14px;
                    text-align: center;
                    margin: 0 0 28px;
                }
                .lg-error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                    font-size: 13.5px;
                    text-align: center;
                    padding: 10px 14px;
                    border-radius: 10px;
                    margin-bottom: 18px;
                }
                .lg-field { margin-bottom: 16px; position: relative; }
                .lg-input {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 13px 15px;
                    border-radius: 10px;
                    border: 1px solid #d1d5db;
                    background: #ffffff;
                    color: #1f2937;
                    font-size: 15px;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .lg-input::placeholder { color: #9ca3af; }
                .lg-input:focus {
                    border-color: #87CEEB;
                    box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.3);
                }
                .lg-toggle {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #6b7280;
                    font-size: 13px;
                    padding: 6px 8px;
                    border-radius: 8px;
                }
                .lg-toggle:hover { color: #1f2937; }
                .lg-remember {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #4b5563;
                    font-size: 13.5px;
                    cursor: pointer;
                    user-select: none;
                    margin-bottom: 22px;
                }
                .lg-remember input {
                    width: 16px;
                    height: 16px;
                    accent-color: #87CEEB;
                    cursor: pointer;
                }
                .lg-btn {
                    width: 100%;
                    padding: 13px;
                    border: none;
                    border-radius: 10px;
                    font-size: 15px;
                    font-weight: 600;
                    color: #1f2937;
                    cursor: pointer;
                    background: #87CEEB;
                    transition: background 0.2s, transform 0.15s;
                }
                .lg-btn:hover:not(:disabled) {
                    background: #6fc2e3;
                    transform: translateY(-1px);
                }
                .lg-btn:active:not(:disabled) { transform: translateY(0); }
                .lg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .lg-footer {
                    margin-top: 24px;
                    text-align: center;
                    font-size: 14px;
                    color: #6b7280;
                }
                .lg-footer a {
                    color: #4aa8d8;
                    text-decoration: none;
                    font-weight: 600;
                }
                .lg-footer a:hover { text-decoration: underline; }
                @media (max-width: 480px) {
                    .lg-card { padding: 32px 22px; border: none; box-shadow: none; }
                }
            `}</style>
 
            <div className="lg-card">
<h1 className="lg-title">Login</h1>
<p className="lg-sub">Melde dich an, um fortzufahren</p>
 
                {error && <div className="lg-error" role="alert">{error}</div>}
 
                <form onSubmit={handleSubmit}>
<div className="lg-field">
<input
                            className="lg-input"
                            name="username"
                            type="text"
                            placeholder="Username"
                            autoComplete="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
</div>
 
                    <div className="lg-field">
<input
                            className="lg-input"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Passwort"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{ paddingRight: "70px" }}
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
 
                    <button type="submit" className="lg-btn" disabled={loading}>
                        {loading ? "Wird geladen..." : "Login"}
</button>
</form>

 
                <div className="lg-footer">Passwort vergessen?<Link to="/forgotpassword">Passwort vergessen</Link> </div>
                <div className="lg-footer">
                    Noch kein Konto? <Link to="/register">Registrieren</Link>
</div>

</div>
</div>
    );
}
 
export default Login;