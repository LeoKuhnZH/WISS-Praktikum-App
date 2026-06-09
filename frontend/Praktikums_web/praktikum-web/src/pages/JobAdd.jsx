import './components/style/style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8080/api/posting';

function JobAdd() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        body: '',
        email: '',
        phone: '',
        companyDescription: '',
        website: '',
        expirationDate: '',
        position: '',
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title || !formData.company || !formData.email) {
            setError('Bitte fülle alle Pflichtfelder (*) aus.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                company: formData.company,
                body: formData.body,
                email: formData.email,
                phone: formData.phone,
                companyDescription: formData.companyDescription,
                website: formData.website,
                status: 'ACTIVE',
                expirationDate: formData.expirationDate || null,
                position: formData.position || null,
            };

            const response = await fetch(`${API_BASE}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Server Fehler: ${response.status}`);
            }

            setSuccess(true);
            setTimeout(() => navigate('/'), 2500);
        } catch (err) {
            console.error(err);
            setError('Beim Speichern ist ein Fehler aufgetreten. Ist das Backend gestartet?');
        } finally {
            setLoading(false);
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
                        <h3 style={sectionStyle}>Firmendaten</h3>

                        <label style={labelStyle}>
                            Firmenname <span style={{ color: 'red' }}>*</span>
                            <input
                                type="text"
                                name="company"
                                placeholder="z.B. Muster AG"
                                value={formData.company}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </label>

                        <label style={labelStyle}>
                            Firmenbeschreibung
                            <textarea
                                name="companyDescription"
                                placeholder="Kurze Beschreibung der Firma..."
                                value={formData.companyDescription}
                                onChange={handleChange}
                                rows={3}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </label>

                        <label style={labelStyle}>
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

                        {/* --- KONTAKT --- */}
                        <h3 style={sectionStyle}>Kontakt</h3>

                        <label style={labelStyle}>
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

                        <label style={labelStyle}>
                            Telefon
                            <input
                                type="tel"
                                name="phone"
                                placeholder="044 123 45 67"
                                value={formData.phone}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </label>

                        {/* --- STELLE --- */}
                        <h3 style={sectionStyle}>Stelle</h3>

                        <label style={labelStyle}>
                            Stellenbezeichnung <span style={{ color: 'red' }}>*</span>
                            <input
                                type="text"
                                name="title"
                                placeholder="z.B. Informatiker/in EFZ Applikationsentwicklung"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </label>

                        <label style={labelStyle}>
                            Lehrberuf
                            <select
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="">– Lehrberuf wählen –</option>
                                <option value="IFZA">Informatiker/in EFZ (Applikationsentwicklung)</option>
                                <option value="IFZP">Informatiker/in EFZ (Plattformentwicklung)</option>
                                <option value="ICTF">ICT-Fachmann/-frau EFZ</option>
                                <option value="UICT">ICT-Fachmann/-frau EFZ (Quereinstieg)</option>
                                <option value="UIFZ">Informatiker/in EFZ Applikationsentwicklung (Quereinstieg)</option>
                            </select>
                        </label>

                        <label style={labelStyle}>
                            Stellenbeschreibung
                            <textarea
                                name="body"
                                placeholder="Aufgaben, Projekte, Anforderungen, Team..."
                                value={formData.body}
                                onChange={handleChange}
                                rows={5}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </label>

                        <label style={labelStyle}>
                            Bewerbungsschluss
                            <input
                                type="date"
                                name="expirationDate"
                                value={formData.expirationDate}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </label>

                        <button
                            type="submit"
                            className="button"
                            style={{ marginTop: '12px', opacity: loading ? 0.6 : 1 }}
                            disabled={loading}
                        >
                            {loading ? 'Wird gespeichert...' : 'Stelle veröffentlichen'}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}

const sectionStyle = {
    margin: '16px 0 4px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '4px',
    fontFamily: 'inherit',
};

const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#374151',
};

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
