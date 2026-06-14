import { useState } from 'react'; // Wichtig: useState importieren!
import { useNavigate } from "react-router-dom";
import UBS from '../assets/UBS.png';
import Ergon from '../assets/Ergon.png';
import Timer from '../assets/Timer.png';
import Escola from '../assets/Escola.png';
import Smoca from '../assets/Smoca.png';
import Boutique from '../assets/Boutique.png';
import Bergos from '../assets/Bergos.jpg';
import Cloud from '../assets/Cloud.jpg';
import Netcetera from '../assets/Netcetera.jpg';
import Avaloq from '../assets/Avaloq.jpg';


function Home() {
    const navigate = useNavigate();
    const [selectedBeruf, setSelectedBeruf] = useState('');

    // State für das "Neue Stelle hinzufügen"-Formular
    const [newJob, setNewJob] = useState({
        titel: '',
        firma: '',
        kategorie: '',
        beschreibung: '',
        standort: '',
        dauer: '',
        start: '',
        anforderung: '',
        verguetung: ''
    });

    // 1. Die Angebote leben jetzt im State, damit man sie löschen und hinzufügen kann
    const [stellenAngebote, setStellenAngebote] = useState([
        {
            id: 1,
            titel: "Praktikant Frontend Entwicklung (m/w/d)",
            firma: "UBS AG",
            logo: UBS,
            kategorie: "applikationsentwicklung",
            beschreibung: "Unterstütze unser Team bei der Modernisierung von Web-Dashboards mit React und TypeScript. Du lernst agile Softwareentwicklung in einem internationalen Umfeld kennen.",
            details: {
                standort: "Zürich (Oerlikon / Altstetten)",
                dauer: "12 - 24 Monate",
                start: "August 2026",
                anforderung: "Grundkenntnisse in HTML, CSS und JavaScript. Erste Erfahrungen mit einem Framework (z.B. React) von Vorteil.",
                timerIcon: Timer,
                publikationsdatum: "Vor 14 Tagen"
            },
            verguetung: "CHF 1'200.00 — CHF 1'600.00 / Monat"
        },
        {
            id: 2,
            titel: "Informatik-Praktikum EFZ — Web-Entwicklung",
            firma: "Boutique Tech Agency",
            kategorie: "applikationsentwicklung",
            logo: Boutique,
            beschreibung: "Konzeption und Umsetzung von responsiven Webseiten und Full-Stack-Komponenten (React & Spring Boot) für KMU-Kunden in einem kleinen, agilen Team.",
            details: {
                standort: "Zürich-West",
                dauer: "24 Monate (Pflichtpraktikum)",
                start: "August 2026",
                anforderung: "Laufende Informatik-Ausbildung (z.B. WISS), Motivation für moderne Frontend-Technologien wie Vue.js, React, Angular, Ruby",
                timerIcon: Timer,
                publikationsdatum: "Vor 10 Tagen",

            },
            verguetung: "CHF 1'100.00 — CHF 1'500.00 / Monat"
        },
        {
            id: 3,
            titel: "UX/UI-Designer (m/w/d)",
            firma: "Boutique Tech Agency",
            logo: Boutique,
            kategorie: "applikationsentwicklung",
            beschreibung: "Gestaltung von intuitiven Benutzeroberflächen, Wireframes und interaktiven Prototypen für Web- und Mobile-Applikationen in enger Zusammenarbeit mit der Entwicklung.",
            details: {
                standort: "Zürich-West",
                dauer: "24 Monate (Pflichtpraktikum)",
                start: "August 2026",
                anforderung: "Gutes Auge für Design, Typografie und Nutzerführung. Erste Erfahrungen mit Figma oder Adobe XD von Vorteil.",
                timerIcon: Timer,
                publikationsdatum: "Vor 5 Tagen",

            },
            verguetung: "CHF 1'100.00 — CHF 1'450.00 / Monat"
        },
        {
            id: 4,
            titel: "Informatik-Praktikum EFZ — Backend Java Entwicklung",
            firma: "Ergon Informatik Ag",
            logo: Ergon,
            kategorie: "applikationsentwicklung",
            beschreibung: "Konzeption, Entwicklung und Absicherung von RESTful APIs und Microservices im Banking-Umfeld. Du arbeitest an Kernkomponenten moderner Finanzsoftware.",
            details: {
                standort: "Zürich (Oerlikon)",
                dauer: "24 Monate (Pflichtpraktikum)",
                start: "August 2026",
                anforderung: "Solide Grundkenntnisse in Java und objektorientierter Programmierung. Erste Erfahrungen mit Spring Boot, Java SQL oder Docker sind ein Plus aber kein Muss",
                timerIcon: Timer,
                publikationsdatum: "Vor 5 Tagen",

            },
            verguetung: "CHF 1'250.00 — CHF 1'650.00 / Monat"
        },
        {
            id: 5,
            titel: "Praktikant ICT Platform Engineering / DevOps",
            firma: "Enterprise Cloud Systems",
            logo: Cloud,
            beschreibung: "Unterstützung beim Aufbau und Betrieb moderner Cloud-Infrastrukturen, der Automatisierung von CI/CD-Pipelines und der Container-Orchestrierung.",
            kategorie: "plattformentwicklung",
            details: {
                standort: "Zürich (Altstetten)",
                dauer: "12 - 24 Monate",
                start: "August 2026",
                anforderung: "Interesse an Linux-Systemen, Netzwerken und Automatisierung. Erste Berührungspunkte mit Docker, Kubernetes, Git oder Bash-Scripting sowie Linux",
                publikationsdatum: "am 29.5.2025",
                timerIcon: Timer
            },
            verguetung: "CHF 1'300.00 — CHF 1'700.00 / Monat"
        },
        {
            id: 6,
            titel: "Informatik-Praktikum EFZ — Full-Stack (React & Spring Boot)",
            firma: "Smoca AG",
            logo: Smoca,
            kategorie: "applikationsentwicklung",
            beschreibung: "Entwickle innovative Full-Stack-Webapps und Dashboards. Du arbeitest aktiv an der Schnittstelle zwischen Business und IT und setzt moderne Architekturen mit React im Frontend und Java Spring Boot im Backend um.",
            details: {
                standort: "Winterthur",
                dauer: "24 Monate (Pflichtpraktikum)",
                start: "August 2026",
                anforderung: "Laufende Ausbildung zum Informatiker EFZ. Gute Basis in Java und JavaScript. Motivation für das Designen von übersichtlichen Dashboards und RESTful APIs.",
                timerIcon: Timer,
                publikationsdatum: "Vor 2 Tagen"
            },
            verguetung: "CHF 1'200.00 — CHF 1'600.00 / Monat"
        },
        {
            id: 7,
            titel: "Praktikum Applikationsentwicklung — Web & Security",
            firma: "Escola GmbH",
            logo: Escola,
            kategorie: "applikationsentwicklung",
            beschreibung: "Unterstütze die Weiterentwicklung unserer Web-Plattform im Bildungsbereich. Du implementierst responsive UI-Komponenten und hilfst dabei, Backend-Logiken sowie moderne Authentifizierungslösungen (JWT, Spring Security) abzusichern.",
            details: {
                standort: "Zürich (Oerlikon)",
                dauer: "24 Monate (Pflichtpraktikum)",
                start: "August 2026",
                anforderung: "Verständnis von relationalen Datenbanken (MySQL) und Spass an UI/UX-Design. Erste Erfahrungen mit Git und Containerisierung (Docker) von Vorteil.",
                publikationsdatum: "Vor 5 Tagen",
                timerIcon: Timer

            },
            verguetung: "CHF 1'250.00 — CHF 1'550.00 / Monat"
        },
        {
            id: 8,
            titel: "Informatik-Praktikum EFZ — Software Engineering im Banking",
            firma: "Bergos AG",
            logo: Bergos,
            kategorie: "applikationsentwicklung",
            beschreibung: "Mitarbeit an der Schnittstelle von Finanzdaten und Softwareentwicklung. Du unterstützt unser Team bei der Anbindung von REST-Schnittstellen, der Pflege von Datenbanken und der Erstellung von automatisierten Unit-Tests.",
            details: {
                standort: "Zürich (Zentrum)",
                dauer: "24 Monate (Pflichtpraktikum)",
                start: "August 2026",
                anforderung: "Grundwissen in objektorientierter Programmierung (Java) und SQL. Interesse an wirtschaftlichen Zusammenhängen und hoher Code-Qualität durch automatisiertes Testen.",
                timerIcon: Timer,
                publikationsdatum: "Vor 6 Tagen",

            },
            verguetung: "CHF 1'350.00 — CHF 1'750.00 / Monat"
        },
        {
            id: 9,
            titel: "Informatik-Praktikum EFZ — Applikationsentwicklung Way-Up(w/m/d)",
            firma: "Netcetera AG",
            logo: Netcetera,
            kategorie: "applikationsentwicklung_wayup",
            beschreibung: "Unterstütze unser Team bei der Entwicklung massgeschneiderter Softwarelösungen. Du arbeitest aktiv an der Schnittstelle zwischen Business-Anforderungen und IT, begleitest den gesamten Software-Lebenszyklus und hilfst bei der Anbindung und dem Design von RESTful APIs.",
            details: {
                standort: "Zürich (Zentrum)",
                dauer: "24 Monate (Pflichtpraktikum)",
                start: "August 2026",
                anforderung: "Laufende Ausbildung Informatik EFZ. Erste praktische Erfahrungen in der objektorientierten Programmierung (Java/C#) und relationalen Datenbanken. Starkes Interesse an der Brücke zwischen Wirtschaft und IT.",
                timerIcon: Timer,
                publikationsdatum: "Vor 1 Tag",

            },
            verguetung: "CHF 1'300.00 — CHF 1'650.00 / Monat"
        },
        {
            id: 10,
            titel: "ICT-Fachmann / Fachfrau EFZ — Support & Application Management",
            firma: "Avaloq Evolution AG",
            logo: Avaloq,
            kategorie: "fachmann",
            beschreibung: "Betreuung und Konfiguration unserer Applikationslandschaft im FinTech-Bereich. Du agierst als Bindeglied zwischen Anwendern und Entwicklung, analysierst Systemmeldungen, unterstützt im 2nd-Level-Support und hilfst bei kleineren Code-Anpassungen sowie API-Tests mit.",
            details: {
                standort: "Zürich-West",
                dauer: "24 Monate (Pflichtpraktikum)",
                start: "August 2026",
                anforderung: "Ausbildung zum ICT-Fachmann/-frau oder Informatiker EFZ. Rasche Auffassungsgabe für komplexe IT- und Wirtschaftsstrukturen, Grundkenntnisse in SQL und Freude am direkten Kunden- und Systemkontakt.",
                timerIcon: Timer,
                publikationsdatum: "Vor 3 Tagen",
            },
            verguetung: "CHF 1'280.00 — CHF 1'580.00 / Monat"
        }
    ]);

    // Funktion zum Löschen
    const handleDeleteJob = (id) => {
        if (window.confirm("Möchtest du dieses Jobangebot wirklich löschen?")) {
            const aktualisierteStellen = stellenAngebote.filter(stelle => stelle.id !== id);
            setStellenAngebote(aktualisierteStellen);
            alert("Praktikumsstelle wurde gelöscht!");
        }
    };

    // NEU: Handler für die Formular-Eingaben
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewJob(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // NEU: Funktion zum Hinzufügen einer neuen Stelle
    const handleAddJob = (e) => {
        e.preventDefault();

        // Validierung, ob die wichtigsten Felder ausgefüllt sind
        if (!newJob.titel || !newJob.firma || !newJob.beschreibung) {
            alert("Bitte fülle mindestens Titel, Firma und Beschreibung aus!");
            return;
        }

        const neueStelle = {
            id: Date.now(), // Eindeutige ID generieren
            titel: newJob.titel,
            firma: newJob.firma,
            logo: Timer, // Standard-Platzhalter, da lokale Bild-Imports statisch sind
            kategorie: newJob.kategorie,
            beschreibung: newJob.beschreibung,
            details: {
                standort: newJob.standort || "Nicht angegeben",
                dauer: newJob.dauer || "Nach Vereinbarung",
                start: newJob.start || "Sofort",
                anforderung: newJob.anforderung || "Keine speziellen Anforderungen",
                timerIcon: Timer,
                publikationsdatum: "Gerade eben"
            },
            verguetung: newJob.verguetung ? `CHF ${newJob.verguetung} / Monat` : "Nicht angegeben"
        };

        setStellenAngebote([neueStelle, ...stellenAngebote]); // Neue Stelle oben hinzufügen
        alert("Neue Praktikumsstelle erfolgreich hinzugefügt!");

        // Formular zurücksetzen
        setNewJob({
            titel: '',
            firma: '',
            kategorie: 'applikationsentwicklung',
            beschreibung: '',
            standort: '',
            dauer: '',
            start: '',
            anforderung: '',
            verguetung: ''
        });
    };

    // Filter-Logik
    const gefiltertePraktikas = stellenAngebote.filter(stelle => {
        if (selectedBeruf === '') {
            return true;
        } else {
            return stelle.kategorie === selectedBeruf;
        }
    });

    return (
        <div className="home-container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>

            <header className="home-header">
                <h1><ins>Aktuelle verfügbare Praktikumsstellen</ins></h1>
            </header>

            <h2>
                <marquee>Entdecke einzigartige Jobangebote, welche einzigartig auf dein Profil zugeschnitten sind</marquee>
            </h2>

            {/* NEU: Formular zum Hinzufügen einer neuen Praktikumsstelle */}
            <div className="add-job-section" style={styles.formContainer}>
                <h3 style={{ marginTop: 0, color: '#0f172a' }}>Neue Praktikumsstelle hinzufügen</h3>
                <form onSubmit={handleAddJob} style={styles.form}>
                    <input type="text" name="titel" placeholder="Job-Titel (z.B. Frontend Entwickler)" value={newJob.titel} onChange={handleInputChange} style={styles.input} />
                    <input type="text" name="firma" placeholder="Firma (z.B. MyTech AG)" value={newJob.firma} onChange={handleInputChange} style={styles.input} />

                    <select name="kategorie" value={newJob.kategorie} onChange={handleInputChange} style={styles.input}>
                        <option value="applikationsentwicklung">Informatiker EFZ Applikationsentwicklung</option>
                        <option value="plattformentwicklung">Informatiker EFZ Plattformentwicklung</option>
                        <option value="applikationsentwicklung_wayup">Informatiker EFZ Applikationsentwicklung (Way-up)</option>
                        <option value="fachmann">ICT-Fachmann/Fachfrau EFZ</option>
                    </select>

                    <input type="text" name="standort" placeholder="Standort (z.B. Zürich)" value={newJob.standort} onChange={handleInputChange} style={styles.input} />
                    <select
                        name="start"
                        value={newJob.start}
                        onChange={handleInputChange}
                        style={styles.input}
                    >
                        <option value="">-- Startzeitpunkt wählen --</option>
                        <option value="August 2026">August 2026 (Lehrbeginn)</option>
                        <option value="Per sofort">Per sofort</option>
                        <option value="Nach Vereinbarung">Nach Vereinbarung</option>
                    </select>

                    <div>
                        <label htmlFor="dauer-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>Dauer auswählen: </label>
                        <select
                            name="dauer"
                            id="dauer-select"
                            value={newJob.dauer}
                            onChange={handleInputChange}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="">-- Alle Zeiträume --</option>
                            <option value="6">6 Monate(Minimum)</option>
                            <option value="8">8 Monate</option>
                            <option value="12 - 24 Monate">12-Monate</option>
                            <option value="24 Monate (Pflichtpraktikum)">1 Jahr(24 Monate Pflichtpraktikum)</option>
                            <option value="48 Monate">2 Jahre Pflichtpraktikum</option>
                        </select>
                    </div>
                    <input type="text" name="verguetung" placeholder="Vergütung (z.B. 1'200.00)" value={newJob.verguetung} onChange={handleInputChange} style={styles.input} />

                    <textarea name="beschreibung" placeholder="Kurze Berufsbeschreibung..." value={newJob.beschreibung} onChange={handleInputChange} style={{ ...styles.input, gridColumn: '1 / -1', height: '60px' }} />
                    <textarea name="anforderung" placeholder="Anforderungen an den Bewerber..." value={newJob.anforderung} onChange={handleInputChange} style={{ ...styles.input, gridColumn: '1 / -1', height: '60px' }} />

                    <button type="submit" style={styles.submitButton}>Inserat aufschalten</button>
                </form>
            </div>

            {/* Filter-Bereich */}
            <div className="filter-section" style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                <label htmlFor="beruf-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>Beruf auswählen: </label>
                <select
                    name="beruf"
                    id="beruf-select"
                    value={selectedBeruf}
                    onChange={(e) => setSelectedBeruf(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="">-- IT-Beruf auswählen --</option>
                    <option value="applikationsentwicklung">Informatiker EFZ Applikationsentwicklung</option>
                    <option value="plattformentwicklung">Informatiker EFZ Plattformentwicklung</option>
                    <option value="applikationsentwicklung_wayup">Informatiker EFZ Applikationsentwicklung (Way-up)</option>
                    <option value="fachmann">ICT-Fachmann/Fachfrau EFZ</option>
                </select>
            </div>

            {/* Grid-Anzeige der Stellenkarten */}
            <main className="job-list" style={styles.grid}>
                {gefiltertePraktikas.length > 0 ? (
                    gefiltertePraktikas.map((stelle) => (
                        <div key={stelle.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h2 style={styles.jobTitle}>{stelle.titel}</h2>
                                <img
                                    style={styles.logo}
                                    src={stelle.logo}
                                    alt={`${stelle.firma} Logo`}
                                />
                            </div>

                            <hr style={styles.divider} />

                            <div style={styles.section}>
                                <h3 style={styles.sectionTitle}>Berufsbeschreibung</h3>
                                <p style={styles.text}>{stelle.beschreibung}</p>
                            </div>

                            {/* Details */}
                            <div style={styles.section}>
                                <h3 style={styles.sectionTitle}>Details zur Praktikumsstelle</h3>
                                <h2>
                                    <a href="#login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
                                        Zu den Details
                                    </a>
                                </h2>
                                <ul style={styles.list}>
                                    <li><strong>Firma:</strong> {stelle.firma}</li>
                                    <li><strong>Standort:</strong> {stelle.details.standort}</li>
                                    <li><strong>Praktikumsdauer:</strong> {stelle.details.dauer}</li>
                                    <li><strong>Start:</strong> {stelle.details.start}</li>
                                    <li><strong>Anforderungen:</strong> {stelle.details.anforderung}</li>
                                    <li>
                                        <strong>Publikationsdatum:</strong> {stelle.details.publikationsdatum}
                                        {stelle.details.timerIcon && <img src={stelle.details.timerIcon} alt="Timer" style={{ width: '14px', marginLeft: '5px', verticalAlign: 'middle' }} />}
                                    </li>
                                </ul>
                            </div>

                            {/* Praktikumsvergütung */}
                            <div style={styles.priceContainer}>
                                <span style={styles.priceLabel}>Praktikumsvergütung:</span>
                                <span style={styles.priceValue}>{stelle.verguetung}</span>
                            </div>

                            <button
                                onClick={() => handleDeleteJob(stelle.id)}
                                style={styles.deleteButton}
                            >
                                Inserat entfernen
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', padding: '20px' }}>
                        Aktuell keine offenen Praktikumsstellen für diesen Fachbereich vorhanden.
                    </p>
                )}
            </main>
            <div className="box3">
                <h2 onClick={() => navigate("/search")} style={{ cursor: 'pointer' }}><ins>Du suchst etwas spezielles? Individuelles Suchauftrag erstellen </ins></h2>
            </div>
        </div>
    );
}

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '25px',
        marginTop: '20px',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid #e2e8f0'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '10px',
    },
    jobTitle: {
        fontSize: '18px',
        color: '#0f172a',
        margin: '0 0 10px 0',
    },
    logo: {
        height: '120px',
        objectFit: 'contain',
        maxWidth: '100px',
    },
    divider: {
        border: '0',
        height: '1px',
        backgroundColor: '#e2e8f0',
        margin: '15px 0',
    },
    section: {
        marginBottom: '12px',
    },
    sectionTitle: {
        fontSize: '13px',
        textTransform: 'uppercase',
        color: '#64748b',
        margin: '0 0 6px 0',
    },
    text: {
        fontSize: '14px',
        color: '#334155',
        margin: 0,
    },
    list: {
        paddingLeft: '18px',
        margin: 0,
        fontSize: '13px',
        color: '#334155',
    },
    priceContainer: {
        backgroundColor: '#f1f5f9',
        padding: '10px',
        borderRadius: '6px',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
        marginBottom: '15px',
    },
    priceLabel: {
        fontSize: '13px',
        fontWeight: '600',
    },
    priceValue: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#0284c7',
    },
    deleteButton: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
        border: 'none',
        padding: '10px',
        borderRadius: '6px',
        cursor: 'pointer',
        width: '100%',
        fontWeight: '600',
        marginTop: '10px'
    },
    // NEU: Styles für das Eingabeformular
    formContainer: {
        backgroundColor: '#f8fafc',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
    },
    form: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px'
    },
    input: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #cbd5e1',
        fontSize: '14px',
        fontFamily: 'sans-serif'
    },
    submitButton: {
        gridColumn: '1 / -1',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '15px',
        marginTop: '5px'
    }
};

export default Home;