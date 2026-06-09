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

            // Simulierter Login (kein Context mehr)
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username.trim(),
                    password: formData.password,
                }),
            });

            if (!res.ok) {
                throw new Error("Login failed");
            }

            // optional: token speichern
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
        <div className="min-h-screen flex items-center justify-center login-hintergrund-rot px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">

                <h2 className="text-3xl font-extrabold text-center mb-6">
                    Login
                </h2>

                {error && (
                    <div className="mb-4 text-center text-red-600 font-semibold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Username */}
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />

                    {/* Password */}
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((prev) => !prev)
                            }
                            className="absolute right-3 top-2 text-sm text-blue-600"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {/* Remember */}
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                        Remember me
                    </label>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg"
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>

                </form>

                <div className="text-center mt-6">
                    <Link to="/" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Login;
