import './components/style/style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JobAdd() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firmenname: '',
        branche: '',
        strasseNr: '',
        plzOrt: '',
        kontaktperson: '',
        email: '',
        telefon: '',
        website: '',
        stellenbezeichnung: '',
        beschreibung: '',
        pensum: '100',
        startdatum: '',
        bewerbungsschluss: '',
        anforderungen: '',
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.firmenname || !formData.email || !formData.stellenbezeichnung) {
            setError('Bitte fülle alle Pflichtfelder (*) aus.');
            return;
        }

        try {
            // TODO: API-Call an Backend z.B.:
            // await API.post('/jobs', formData);
            console.log('Neue Stelle erfasst:', formData);
            setSuccess(true);
            setTimeout(() => navigate('/'), 2500);
        } catch (err) {
            console.error(err);
            setError('Beim Speichern ist ein Fehler aufgetreten. Bitte versuche es erneut.');
        }
    };

    if (success) {
        return (
            <div className="div1">
                <div className="div2" style={{ textAlign: 'center', marginTop: '40px' }}>
                    <h2 className="titel" style={{ color: '#16a34a' }}>✓ Stelle erfolgreich erfasst!</h2>
                    <p style={{ color: '#555', marginTop: '12px' }}>
                        Die Stelle ist nun für Lernende sichtbar. Du wirst weitergeleitet...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="div1">
            <div className="div2" style={{ maxWidth: '600px' }}>
                <h2 className="titel">Neue Praktikumsstelle erfassen</h2>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
                    Felder mit <span style={{ color: 'red' }}>*</span> sind Pflichtfelder.
                </p>

                {error && (
                    <div id="message" style={{ marginBottom: '16px', color: '#b91c1c', background: '#fee2e2', border: '1px solid #fca5a5' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="divreg">

                        {/* --- FIRMENDATEN --- */}
                        <h3 style={{ margin: '8px 0 4px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
                            Firmendaten
                        </h3>

                        <label>
                            Firmenname <span style={{ color: 'red' }}>*</span>
                            <input
                                type="text"
                                name="firmenname"
                                placeholder="z.B. Muster AG"
                                value={formData.firmenname}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            Branche
                            <select
                                name="branche"
                                value={formData.branche}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="">– Branche wählen –</option>
                                <option value="IT">Informatik / IT</option>
                                <option value="Kaufmann">Kaufmann / KV</option>
                                <option value="Gesundheit">Gesundheit</option>
                                <option value="Handel">Handel / Detailhandel</option>
                                <option value="Bau">Bau / Handwerk</option>
                                <option value="Medien">Medien / Grafik</option>
                                <option value="Andere">Andere</option>
                            </select>
                        </label>

                        <label>
                            Strasse &amp; Hausnummer
                            <input
                                type="text"
                                name="strasseNr"
                                placeholder="z.B. Bahnhofstrasse 12"
                                value={formData.strasseNr}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            PLZ &amp; Ort
                            <input
                                type="text"
                                name="plzOrt"
                                placeholder="z.B. 8001 Zürich"
                                value={formData.plzOrt}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            Website
                            <input
                                type="url"
                                name="website"
                                placeholder="https://muster-ag.ch"
                                value={formData.website}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </label>

                        {/* --- KONTAKTPERSON --- */}
                        <h3 style={{ margin: '16px 0 4px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
                            Kontaktperson
                        </h3>

                        <label>
                            Name der Kontaktperson
                            <input
                                type="text"
                                name="kontaktperson"
                                placeholder="z.B. Max Muster"
                                value={formData.kontaktperson}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            E-Mail <span style={{ color: 'red' }}>*</span>
                            <input
                                type="email"
                                name="email"
                                placeholder="kontakt@firma.ch"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            Telefon
                            <input
                                type="tel"
                                name="telefon"
                                placeholder="044 123 45 67"
                                value={formData.telefon}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </label>

                        {/* --- STELLE --- */}
                        <h3 style={{ margin: '16px 0 4px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
                            Stelle
                        </h3>

                        <label>
                            Stellenbezeichnung <span style={{ color: 'red' }}>*</span>
                            <input
                                type="text"
                                name="stellenbezeichnung"
                                placeholder="z.B. Informatiker/in EFZ Applikationsentwicklung"
                                value={formData.stellenbezeichnung}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            Beschreibung der Stelle
                            <textarea
                                name="beschreibung"
                                placeholder="Was erwartet die Lernenden? Aufgaben, Projekte, Team..."
                                value={formData.beschreibung}
                                onChange={handleChange}
                                rows={4}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </label>

                        <label>
                            Anforderungen
                            <textarea
                                name="anforderungen"
                                placeholder="z.B. gute Schulnoten, Teamfähigkeit, Interesse an Technik..."
                                value={formData.anforderungen}
                                onChange={handleChange}
                                rows={3}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </label>

                        <label>
                            Pensum (%)
                            <input
                                type="number"
                                name="pensum"
                                min="20"
                                max="100"
                                step="10"
                                value={formData.pensum}
                                onChange={handleChange}
                                style={{ ...inputStyle, width: '100px' }}
                            />
                        </label>

                        <label>
                            Startdatum
                            <input
                                type="date"
                                name="startdatum"
                                value={formData.startdatum}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            Bewerbungsschluss
                            <input
                                type="date"
                                name="bewerbungsschluss"
                                value={formData.bewerbungsschluss}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </label>

                        <button type="submit" className="button" style={{ marginTop: '12px' }}>
                            Stelle veröffentlichen
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}

const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '8px 12px',
    marginTop: '4px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
};

export default JobAdd;
