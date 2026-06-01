import './style.css';
import { useState } from 'react';

function RegistrirungPage() {
    // 1. Dropdown 'cars' im State hinzugefügt mit einem Standardwert
    const [formData, setFormData] = useState({
        applikationsentwickler: '',
        plattformentwickler: '',
        ictfachmann: '',

    });

    // Änderungen an den Feldern erfassen
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Aktion beim Abschicken
    const handleSubmit = (e) => {
        e.preventDefault();

        // Zuerst die Validierungen prüfen!
        if (formData.username.length < 7) {
            alert("Der Username ist zu kurz und ungültig! Mindestens 7 Zeichen.");
            return;
        }

        if (formData.password.length < 8) {
            alert("Das Passwort ist zu kurz! Mindestens 8 Zeichen.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Die Passwörter stimmen nicht überein!");
            return;
        }

        // Wenn alle Prüfungen bestanden sind:
        console.log("Registrierungsdaten:", formData);
        alert(`Registrierung erfolgreich! Gewähltes Auto: ${formData.cars}`);
    };

    return (


        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Benutzername */}



            {/* Das Dropdown-Menü (korrigiert für React) */}
            <div>
                <label htmlFor="berufe">Beruf auswählen: </label>
                <select
                    name="berufe"
                    id="berufe"
                    value={formData.berufe}
                    onChange={handleChange}
                >
                    <option value="applikation">Informatiker/in in Applikationsentwicklung EFZ</option>
                    <option value="plattform">Informatiker/in in Plattformentwicklun EFZ</option>
                    <option value="opel">ICT-Fachmann/frau EFZ</option>
                    <option value="HF/Dipl-Fachausweis für WIrtschaftsinformatik">HF/Dipl.Eidgenössicher Fachausweis für Wirtschaftsinformatik</option>
                </select>
            </div>

            <br />
        </form>

    );
}

export default RegistrirungPage;