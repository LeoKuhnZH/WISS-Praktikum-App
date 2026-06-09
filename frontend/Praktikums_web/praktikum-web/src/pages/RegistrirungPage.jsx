import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import "./components/style/style.css"



function RegistrirungPage() {
      // Token
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault(); // Formular-Standardverhalten verhindern

        try {
            const response = await API.post("/auth/register", {
                username,
                password,
                email
            });
                        // Bei Erfolg z.B. Weiterleitung oder Meldung
            console.log("Registrierung erfolgreich:", response.data);
            navigate("/login"); // Beispiel: Weiterleitung zur Login-Seite
        } catch (error) {
            console.error("Fehler bei der Registrierung:", error);
            alert("Bitte Prüfen sie ob ihr paswort 8 zeichen Lang ist ud die E-MAil adresse stimmt");

        }
    };
    return (
        <div>


        <div className="div1">
            <div className="div2">
                <div className="card">
                    <h2 className="titel">Registrierung</h2>
                    <div className="divreg">
                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Benutzername"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />


                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Passwort"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button type="submit" className="button">Registrieren</button>
                    </form>
                    </div>


                </div>


            </div>

        </div>
        </div>
    )
}
export default RegistrirungPage;