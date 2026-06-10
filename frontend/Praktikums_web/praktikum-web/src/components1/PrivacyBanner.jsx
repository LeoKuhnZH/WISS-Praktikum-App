import { useState } from 'react';
import './PrivacyBanner.css';

function PrivacyModal({ onClose }) {
    const [activeTab, setActiveTab] = useState('datenschutz');

    const tabs = [
        { id: 'datenschutz', label: 'Datenschutz' },
        { id: 'dsgvo', label: 'DSGVO' },
        { id: 'agb', label: 'AGB' },
    ];

    const content = {
        datenschutz: (
            <>
                <h3>Datenschutzerklärung</h3>
                <p>Diese Anwendung erhebt und verarbeitet personenbezogene Daten ausschliesslich im Rahmen der geltenden Datenschutzgesetze.</p>
                <h4>Welche Daten werden erhoben?</h4>
                <ul>
                    <li>Name und E-Mail-Adresse bei der Registrierung</li>
                    <li>Login-Zeitpunkte und Sitzungsdaten</li>
                    <li>Eingaben im Zusammenhang mit Praktikumsstellen</li>
                </ul>
                <h4>Zweck der Verarbeitung</h4>
                <p>Die Daten werden ausschliesslich zur Bereitstellung der Plattformfunktionen (Praktikumsvermittlung, Nutzerverwaltung) verwendet.</p>
                <h4>Speicherdauer</h4>
                <p>Personenbezogene Daten werden gelöscht, sobald der Zweck der Speicherung entfällt oder der Nutzer eine Löschung beantragt.</p>
                <h4>Kontakt</h4>
                <p>Bei Fragen zum Datenschutz: datenschutz@wiss.ch</p>
            </>
        ),
        dsgvo: (
            <>
                <h3>DSGVO – Ihre Rechte</h3>
                <p>Gemäss der Datenschutz-Grundverordnung (EU) 2016/679 haben Sie folgende Rechte:</p>
                <ul>
                    <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können jederzeit Auskunft über Ihre gespeicherten Daten verlangen.</li>
                    <li><strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Unrichtige Daten können Sie korrigieren lassen.</li>
                    <li><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten verlangen ("Recht auf Vergessenwerden").</li>
                    <li><strong>Recht auf Einschränkung (Art. 18 DSGVO):</strong> Die Verarbeitung kann unter bestimmten Umständen eingeschränkt werden.</li>
                    <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können der Verarbeitung Ihrer Daten widersprechen.</li>
                    <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können Ihre Daten in maschinenlesbarem Format erhalten.</li>
                </ul>
                <h4>Beschwerde</h4>
                <p>Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde (EDÖB, Schweiz) zu beschweren.</p>
            </>
        ),
        agb: (
            <>
                <h3>Allgemeine Geschäftsbedingungen</h3>
                <h4>§1 Geltungsbereich</h4>
                <p>Diese AGB gelten für die Nutzung der WISS-Praktikum-App. Mit der Registrierung akzeptieren Sie diese Bedingungen.</p>
                <h4>§2 Nutzungsbedingungen</h4>
                <ul>
                    <li>Die Plattform darf nur für schulische Zwecke im Rahmen des Praktikumsprogramms verwendet werden.</li>
                    <li>Die Weitergabe von Zugangsdaten ist nicht gestattet.</li>
                    <li>Falsche oder irreführende Angaben führen zur Sperrung des Accounts.</li>
                </ul>
                <h4>§3 Haftungsausschluss</h4>
                <p>Die Betreiber übernehmen keine Haftung für die Richtigkeit der eingetragenen Praktikumsstellen oder daraus entstehende Schäden.</p>
                <h4>§4 Änderungen</h4>
                <p>Diese AGB können jederzeit angepasst werden. Nutzer werden per E-Mail informiert.</p>
                <h4>§5 Anwendbares Recht</h4>
                <p>Es gilt Schweizer Recht. Gerichtsstand ist Zürich.</p>
            </>
        ),
    };

    return (
        <div className="privacy-modal-overlay" onClick={onClose}>
            <div className="privacy-modal" onClick={e => e.stopPropagation()}>
                <button className="privacy-modal-close" onClick={onClose}>✕</button>
                <div className="privacy-modal-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`privacy-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="privacy-modal-content">
                    {content[activeTab]}
                </div>
            </div>
        </div>
    );
}

function PrivacyBanner() {
    const [accepted, setAccepted] = useState(
        () => localStorage.getItem('privacy_accepted') === 'true'
    );
    const [modalOpen, setModalOpen] = useState(false);

    const handleAccept = () => {
        localStorage.setItem('privacy_accepted', 'true');
        setAccepted(true);
    };

    const handleDecline = () => {
        window.location.href = 'https://www.google.com';
    };

    if (accepted) return null;

    return (
        <>
            {modalOpen && <PrivacyModal onClose={() => setModalOpen(false)} />}

            <div className="privacy-banner">
                <div className="privacy-banner-text">
                    <strong>Datenschutzhinweis</strong>
                    <p>
                        Diese Anwendung verwendet Daten zur Bereitstellung der Plattformfunktionen.
                        Mit dem Klick auf "Akzeptieren" stimmen Sie der Verarbeitung Ihrer Daten gemäss
                        unserer Datenschutzerklärung zu.
                    </p>
                </div>
                <div className="privacy-banner-actions">
                    <button className="privacy-btn-info" onClick={() => setModalOpen(true)}>
                        📄 Datenschutzerklärung
                    </button>
                    <button className="privacy-btn-decline" onClick={handleDecline}>
                        Ablehnen
                    </button>
                    <button className="privacy-btn-accept" onClick={handleAccept}>
                        Akzeptieren
                    </button>
                </div>
            </div>
        </>
    );
}

export default PrivacyBanner;
