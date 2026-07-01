import './components/style/style.css';
import './JobAdd.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = '/api/posting';

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
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                setError('Bitte logge dich zuerst ein, bevor du ein Praktikum hinzufügst.');
                setLoading(false);
                return;
            }

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
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
            <div className="jobadd-success">
                <div className="jobadd-success-box">
                    <div className="jobadd-success-icon">✓</div>
                    <h2>Stelle erfolgreich erfasst!</h2>
                    <p>Die Stelle ist nun für Lernende sichtbar. Du wirst weitergeleitet...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="jobadd-wrapper">
            <div className="jobadd-card">
                <h2 className="jobadd-title">Neue Praktikumsstelle erfassen</h2>
                <p className="jobadd-subtitle">
                    Felder mit <span>*</span> sind Pflichtfelder.
                </p>

                {error && <div className="jobadd-error">{error}</div>}

                <form onSubmit={handleSubmit}>

                    {/* FIRMENDATEN */}
                    <div className="jobadd-section">
                        <span className="jobadd-section-label">Firmendaten</span>
                        <div className="jobadd-section-line" />
                    </div>

                    <div className="jobadd-field">
                        <label className="jobadd-label">Firmenname <span>*</span></label>
                        <input
                            className="jobadd-input"
                            type="text"
                            name="company"
                            placeholder="z.B. Muster AG"
                            value={formData.company}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="jobadd-field">
                        <label className="jobadd-label">Firmenbeschreibung</label>
                        <textarea
                            className="jobadd-textarea"
                            name="companyDescription"
                            placeholder="Kurze Beschreibung der Firma..."
                            value={formData.companyDescription}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className="jobadd-field">
                        <label className="jobadd-label">Website</label>
                        <input
                            className="jobadd-input"
                            type="url"
                            name="website"
                            placeholder="https://muster-ag.ch"
                            value={formData.website}
                            onChange={handleChange}
                        />
                    </div>

                    {/* KONTAKT */}
                    <div className="jobadd-section">
                        <span className="jobadd-section-label">Kontakt</span>
                        <div className="jobadd-section-line" />
                    </div>

                    <div className="jobadd-field">
                        <label className="jobadd-label">E-Mail <span>*</span></label>
                        <input
                            className="jobadd-input"
                            type="email"
                            name="email"
                            placeholder="kontakt@firma.ch"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="jobadd-field">
                        <label className="jobadd-label">Telefon</label>
                        <input
                            className="jobadd-input"
                            type="tel"
                            name="phone"
                            placeholder="044 123 45 67"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* STELLE */}
                    <div className="jobadd-section">
                        <span className="jobadd-section-label">Stelle</span>
                        <div className="jobadd-section-line" />
                    </div>

                    <div className="jobadd-field">
                        <label className="jobadd-label">Stellenbezeichnung <span>*</span></label>
                        <input
                            className="jobadd-input"
                            type="text"
                            name="title"
                            placeholder="z.B. Informatiker/in EFZ Applikationsentwicklung"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="jobadd-field">
                        <label className="jobadd-label">Lehrberuf</label>
                        <select
                            className="jobadd-select"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                        >
                            <option value="">– Lehrberuf wählen –</option>
                            <option value="IFZA">Informatiker/in EFZ (Applikationsentwicklung)</option>
                            <option value="IFZP">Informatiker/in EFZ (Plattformentwicklung)</option>
                            <option value="ICTF">ICT-Fachmann/-frau EFZ</option>
                            <option value="UICT">ICT-Fachmann/-frau EFZ (Quereinstieg)</option>
                            <option value="UIFZ">Informatiker/in EFZ Applikationsentwicklung (Quereinstieg)</option>
                        </select>
                    </div>

                    <div className="jobadd-field">
                        <label className="jobadd-label">Stellenbeschreibung</label>
                        <textarea
                            className="jobadd-textarea"
                            name="body"
                            placeholder="Aufgaben, Projekte, Anforderungen, Team..."
                            value={formData.body}
                            onChange={handleChange}
                            rows={5}
                        />
                    </div>

                    <div className="jobadd-field">
                        <label className="jobadd-label">Bewerbungsschluss</label>
                        <input
                            className="jobadd-input"
                            type="date"
                            name="expirationDate"
                            value={formData.expirationDate}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="jobadd-submit"
                        disabled={loading}
                    >
                        {loading ? 'Wird gespeichert...' : 'Stelle veröffentlichen'}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default JobAdd;