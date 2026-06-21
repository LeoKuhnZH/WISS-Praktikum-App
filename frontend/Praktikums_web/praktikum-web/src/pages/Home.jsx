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
import "./components/style/style.css";
import ForgotPassword from "./ForgotPassword";


function Home() {
    const navigate = useNavigate();




    const [formData, setFormData] = useState({
        username: "",
        password: "",
        rememberMe: false,
    });


    /**
     * Filter für Praktikas nach Datum etc
     */
    const [selectedBeruf, setSelectedBeruf] = useState('');
    const [selectedStandort, setSelectedStandort] = useState('');
    const [selectedStartdatum, setSelectedStartdatum] = useState('');
    const [selectedPublikation, setSelectedPublikation] = useState('');
    const [selectedFirma, setSelectedFirma] = useState('');
    const [selectedverguetung, setSelectedverguetung] = useState('');

    // State für das "Neue Stelle hinzufügen"-Formular
    /*const [newJob, setNewJob] = useState({
        titel: '',
        firma: '',
        kategorie: 'applikationsentwicklung',
        beschreibung: '',
        standort: '',
        dauer: '',
        start: '',
        anforderung: '',
        verguetung: ''
    });*/

    // Die Angebote im State
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
            titel: "Informatik-Praktikum EFZ  als Webentwickler(React)",
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
            titel: " Praktikum als UX/UI-Designer (m/w/d)",
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
            titel: "Informatik-Praktikum EFZ  in  Backend Java Entwicklung",
            firma: "Ergon Informatik AG",
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
                publikationsdatum: "Vor 14 Tagen",
                timerIcon: Timer
            },
            verguetung: "CHF 1'300.00 — CHF 1'700.00 / Monat"
        },
        {
            id: 6,
            titel: "Informatik-Praktikum EFZ in  Full-Stack (React & Spring Boot)",
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
            titel: "Praktikum Applikationsentwicklung  in  Web & Security",
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
            titel: "Informatik-Praktikum EFZ im Bereich Software Engineering im Banking",
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
            titel: "Informatik-Praktikum EFZ in Applikationsentwicklung Way-Up(w/m/d)",
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
            titel: "ICT-Fachmann / Fachfrau EFZ  in Support & Application Management",
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

    // Handler für die Formular-Eingaben
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewJob(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /* Funktion zum Hinzufügen einer neuen Stelle
    const handleAddJob = (e) => {
        e.preventDefault();

        if (!newJob.titel || !newJob.firma || !newJob.beschreibung) {
            alert("Bitte fülle mindestens Titel, Firma und Beschreibung aus!");
            return;
        }

        const neueStelle = {
            id: Date.now(),
            titel: newJob.titel,
            firma: newJob.firma,
            logo: Timer,
            kategorie: newJob.kategorie,
            beschreibung: newJob.beschreibung,
            details: {
                standort: newJob.standort || "Nicht angegeben",
                dauer: newJob.dauer || "Nach Vereinbarung",
                start: newJob.start || "August 2026",
                anforderung: newJob.anforderung || "Keine speziellen Anforderungen",
                timerIcon: Timer,
                publikationsdatum: "Vor 0 Tagen"
            },
            verguetung: newJob.verguetung ? `CHF ${newJob.verguetung} / Monat` : "Nicht angegeben"
        };

        setStellenAngebote([neueStelle, ...stellenAngebote]);
        alert("Neue Praktikumsstelle erfolgreich hinzugefügt!");

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
    };*/

    // --- KOMBINIERTE FILTER-LOGIK ---
    const gefiltertePraktikas = stellenAngebote.filter(stelle => {
        const matchKategorie = selectedBeruf === '' || stelle.kategorie === selectedBeruf;

        const matchStandort = selectedStandort === '' ||
            stelle.details.standort.toLowerCase().includes(selectedStandort.toLowerCase());

        const matchStart = selectedStartdatum === '' || stelle.details.start === selectedStartdatum;

        const matchSelectedFirma = selectedFirma === '' ||
            stelle.firma.toLowerCase().includes(selectedFirma.toLowerCase());

        let matchPublikation = true;
        if (selectedPublikation !== '') {
            const tage = parseInt(stelle.details.publikationsdatum.replace(/[^0-9]/g, ''), 10) || 0;

            if (selectedPublikation === 'heute') {
                matchPublikation = stelle.details.publikationsdatum.includes('0 Tage') || stelle.details.publikationsdatum.includes('1 Tag');
            } else if (selectedPublikation === 'woche') {
                matchPublikation = tage <= 7;
            } else if (selectedPublikation === 'paar Tage') {
                matchPublikation = tage <= 5;
            } else if (selectedPublikation === 'monat') {
                matchPublikation = tage <= 30;
            }
            else if (selectedPublikation === '3 tage') {
                matchPublikation = tage < 3;
            }
        }

        let matchVergütung = true;
        if (selectedverguetung !== '') {
            const lohnText = stelle.verguetung || '';

            // Holt nur die allererste Zahl vor dem ersten "CHF"- / Trennzeichen-Wirrwarr.
            // Macht aus "CHF 1'250.00 — CHF 1'650.00" sauber -> "1250"
            const ersteZahlMatch = lohnText.replace(/['\s]/g, '').match(/\d+/);
            const lohnAnzahl = ersteZahlMatch ? parseInt(ersteZahlMatch[0], 10) : 0;

            if (selectedverguetung === 'lohn-bereich') {
                // Prüft, ob der Mindestlohn im Bereich zwischen 1250 und 1350 liegt
                matchVergütung = lohnAnzahl >= 1250 && lohnAnzahl <= 1350;
            }
            else if (selectedverguetung === 'lohn-bereich2') {
                // Prüft den zweiten Bereich zwischen 1350 und 1750
                matchVergütung = lohnAnzahl >= 1350 && lohnAnzahl <= 1750;
            }
            else {
                // Vergleicht den extrahierten Mindestlohn mit dem exakt ausgewählten Einzelwert
                const gewaehlterLohn = parseInt(selectedverguetung, 10) || 0;
                matchVergütung = lohnAnzahl === gewaehlterLohn;
            }
        }

        return matchKategorie && matchStandort && matchStart && matchPublikation && matchSelectedFirma && matchVergütung;
    }); // <-- Das hier behebt den Vite-Fehler! (Runde Klammer schliesst das .filter() )


    const resetFilter = () => {
        setSelectedBeruf('');
        setSelectedStandort('');
        setSelectedStartdatum('');
        setSelectedPublikation('');
        setSelectedFirma('');
        setSelectedverguetung('');

    };

    return (
        <div className="home-container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>

            <header className="home-header">
                <h1 className="lg-title">Aktuelle verfügbare Praktikumsstellen</h1>
            </header>

            <marquee>
                <h2 style={{ textShadow: "2px 2px violet" }}>
                    Entdecke einzigartige Jobangebote, welche einzigartig auf dein Profil zugeschnitten sind
                </h2>
            </marquee>

            {/* Formular zum Hinzufügen einer neuen Praktikumsstelle */}
            {/*<div className="add-job-section" style={styles.formContainer}>
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

                    <input type="text" name="standort" placeholder="Standort (z.B. Zürich Oerlikon)" value={newJob.standort} onChange={handleInputChange} style={styles.input} />

                    <select name="start" value={newJob.start} onChange={handleInputChange} style={styles.input}>
                        <option value="August 2026">August 2026 (Lehrbeginn)</option>
                        <option value="August 2027">August 2027 (Lehrbeginn)</option>
                        <option value="Per sofort">Per sofort</option>
                        <option value="Nach Vereinbarung">Nach Vereinbarung</option>
                    </select>

                    <input type="text" name="dauer" placeholder="Dauer (z.B. 24 Monate)" value={newJob.dauer} onChange={handleInputChange} style={styles.input} />
                    <input type="text" name="verguetung" placeholder="Vergütung (z.B. 1'200.00)" value={newJob.verguetung} onChange={handleInputChange} style={styles.input} />

                    <textarea name="beschreibung" placeholder="Kurze Berufsbeschreibung..." value={newJob.beschreibung} onChange={handleInputChange} style={{ ...styles.input, gridColumn: '1 / -1', height: '60px' }} />
                    <textarea name="anforderung" placeholder="Anforderungen an den Bewerber..." value={newJob.anforderung} onChange={handleInputChange} style={{ ...styles.input, gridColumn: '1 / -1', height: '60px' }} />

                    <button type="submit" style={styles.submitButton}>Inserat aufschalten</button>
                </form>
            </div>*/}

            {/* --- FILTER-BEREICH --- */}
            <div className="filter-section" style={styles.filterContainer}>
                <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#1e293b' }}>  Nach beliebigen Kriterien  filtern</h3>
                <div style={styles.filterGrid}>

                    {/* Filter 1: Kategorie */}
                    <div>
                        <label htmlFor="beruf-select" style={styles.filterLabel}>Fachbereich:</label>
                        <select
                            id="beruf-select"
                            value={selectedBeruf}
                            onChange={(e) => setSelectedBeruf(e.target.value)}
                            style={styles.filterSelect}
                        >
                            <option value="">-- Alle Berufe --</option>
                            <option value="applikationsentwicklung">Informatiker EFZ Applikationsentwicklung</option>
                            <option value="plattformentwicklung">Informatiker EFZ Plattformentwicklung</option>
                            <option value="applikationsentwicklung_wayup">Informatiker EFZ Applikationsentwicklung (Way-up)</option>
                            <option value="fachmann">ICT-Fachmann/Fachfrau EFZ</option>
                        </select>
                    </div>

                    {/* Filter 2: Firma */}
                    <div>
                        <label htmlFor="firma-select" style={styles.filterLabel}>Firma:</label>
                        <select
                            id="firma-select"
                            value={selectedFirma}
                            onChange={(e) => setSelectedFirma(e.target.value)}
                            style={styles.filterSelect}
                        >
                            <option value="">-- Alle Firmen --</option>
                            <option value="Ergon">Ergon Informatik AG</option>
                            <option value="Smoca">Smoca AG</option>
                            <option value="UBS">UBS AG</option>
                            <option value="Avaloq">Avaloq</option>
                            <option value="Netcetera">Netcetera</option>
                            <option value="Boutique">Boutique Tech Agency</option>
                            <option value="Enterprise Cloud">Enterprise Cloud Systems</option>
                            <option value="Escola">Escola GmbH</option>
                            <option value="Bergos">Bergos AG</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="lohn-select" style={styles.filterLabel}>Praktikumslohn:</label>
                        <select
                            id="lohn-select"
                            value={selectedverguetung}
                            onChange={(e) => setSelectedverguetung(e.target.value)}
                            style={styles.filterSelect}
                        >
                            <option value="">-- Alle Praktikumsvergütungen --</option>
                            <option value="lohn-bereich"> Zwischen 1'250 CHF - 1'350 CHF </option>
                            <option value="1250">1'250 CHF</option>
                            <option value="1100">1'100 CHF</option>
                            <option value="1350">1'350 CHF</option>
                            <option value="1280">1'280 CHF</option>
                            <option value="lohn-bereich2">Zwischen 1'350  CHF und -1'700 CHF </option>
                        </select>
                    </div>

                    {/* Filter 3: Standort */}
                    <div>
                        <label htmlFor="standort-select" style={styles.filterLabel}>Region / Ort:</label>
                        <select
                            id="standort-select"
                            value={selectedStandort}
                            onChange={(e) => setSelectedStandort(e.target.value)}
                            style={styles.filterSelect}
                        >
                            <option value="">-- Alle Standorte --</option>
                            <option value="Zürich">Zürich (Gesamt)</option>
                            <option value="Oerlikon">Zürich-Oerlikon</option>
                            <option value="Altstetten">Zürich-Altstetten</option>
                            <option value="Winterthur">Winterthur</option>
                            <option value="Zürich-West">Züri-West</option>
                            <option value="Zürich (Zentrum)">Zürich (Zentrum)</option>
                        </select>
                    </div>

                    {/* Filter 4: Startzeitpunkt */}
                    <div>
                        <label htmlFor="start-select" style={styles.filterLabel}>Startzeitpunkt:</label>
                        <select
                            id="start-select"
                            value={selectedStartdatum}
                            onChange={(e) => setSelectedStartdatum(e.target.value)}
                            style={styles.filterSelect}
                        >
                            <option value="">-- Jedes Startdatum --</option>
                            <option value="August 2026">August 2026</option>
                            <option value="August 2027">August 2027</option>
                            <option value="Per sofort">Per sofort</option>
                            <option value="Nach Vereinbarung">Nach Vereinbarung</option>
                        </select>
                    </div>

                    {/* Filter 5: Publikationsdatum */}
                    <div>
                        <label htmlFor="pub-select" style={styles.filterLabel}>Veröffentlichungsdatum:</label>
                        <select
                            id="pub-select"
                            value={selectedPublikation}
                            onChange={(e) => setSelectedPublikation(e.target.value)}
                            style={styles.filterSelect}
                        >
                            <option value="">-- Beliebiges Datum --</option>
                            <option value="heute">Letzte 24-48 Stunden</option>
                            <option value="paar Tage">Letzte 5 Tage</option>
                            <option value="woche">Letzte 7 Tage</option>
                            <option value="monat">Letzte 30 Tage</option>
                            <option value="3">Letzte 3 Tage</option>
                        </select>
                    </div>

                </div>

                {/* Filter zurücksetzen Button */}
                {(selectedBeruf || selectedStandort || selectedStartdatum || selectedPublikation || selectedFirma || selectedverguetung) && (
                    <button onClick={resetFilter} style={styles.resetButton}>
                        Filter zurücksetzen
                    </button>
                )}
            </div>

            {/* Grid-Anzeige der Stellenkarten */}
            <main className="grid" >
                {gefiltertePraktikas.length > 0 ? (
                    gefiltertePraktikas.map((stelle) => (
                        <div className="card">
                            <div className="card-header">
                                <h2 className="job-title">{stelle.titel}</h2>
                                <img
                                    className="logo"
                                    src={stelle.logo}
                                    alt={`${stelle.firma} Logo`}
                                />
                            </div>

                            <hr className="divider" />

                            <div className="section">
                                <h3 className="section-title">Berufsbeschreibung</h3>
                                <p style={styles.text}>{stelle.beschreibung}</p>
                            </div>

                            {/* Details */}
                            <div style={styles.section}>

                                <ul className="list">
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
                            <div className="price-container">
                                <span className="price-label">Praktikumsvergütung:</span>
                                <span className="price-value">{stelle.verguetung}</span>
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
                    <h1>Top Stellen</h1>
                )}
            </main>

            <div className="box3">

            </div>
        </div>
    );
};

const styles = {













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
    },
    filterContainer: {
        margin: '20px 0',
        padding: '20px',
        backgroundColor: 'brown',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
    },
    filterGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
    },
    filterLabel: {
        display: 'block',
        fontSize: '13px',
        fontWeight: 'bold',
        marginBottom: '5px',
        color: '#475569'
    },
    filterSelect: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #cbd5e1',
        fontSize: '14px',
        backgroundColor: '#fff'
    },
    resetButton: {
        marginTop: '15px',
        backgroundColor: '#64748b',

        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600'
    }
};

export default Home;