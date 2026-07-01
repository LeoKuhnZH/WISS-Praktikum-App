
import {useNavigate} from "react-router-dom";
import { useState, useEffect } from 'react';
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

function Home({ isLoggedIn }) {
    const navigate = useNavigate();

    /**
     * Filter für Praktikas nach Datum etc
     */
    const [selectedBeruf, setSelectedBeruf] = useState('');
    const [selectedStandort, setSelectedStandort] = useState('');
    const [selectedStartdatum, setSelectedStartdatum] = useState('');
    const [selectedPublikation, setSelectedPublikation] = useState('');
    const [selectedFirma, setSelectedFirma] = useState('');
    const [selectedverguetung, setSelectedverguetung] = useState('');
    const [selectedDistanz, setSelectedDistanz] = useState('');

    // Backend Funktion
    const [stellenAngebote, setStellenAngebote] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/posting/all")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Backend Fehler ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                const mapped = data.map(p => ({
                    id: p.id,
                    kategorie: p.position || '',
                    titel: p.title,
                    firma: p.company,
                    logo: UBS,
                    beschreibung: p.body,
                    details: {
                        standort: p.position || "Standort nicht verfügbar",
                        dauer: p.expirationDate || "keine Angabe",
                        start: p.dateCreated ? new Date(p.dateCreated).toLocaleDateString() : "keine Angabe",
                        anforderung: p.companyDescription || "keine Angabe",
                        publikationsdatum: p.dateCreated ? new Date(p.dateCreated).toLocaleDateString() : "keine Angabe",
                        timerIcon: Timer,
                        distanz: p.distance || 5
                    },
                    verguetung: "nicht im Backend"
                }));
                setStellenAngebote(mapped);
            })
            .catch(err => console.error("Fehler beim Laden:", err))
            .finally(() => setLoading(false));
    }, []);

    // Funktion zum Löschen
    const handleDeleteJob = (id) => {
        if (window.confirm("Möchtest du dieses Jobangebot wirklich löschen?")) {
            const aktualisierteStellen = stellenAngebote.filter(stelle => stelle.id !== id);
            setStellenAngebote(aktualisierteStellen);
            alert("Praktikumsstelle wurde gelöscht!");
        }
    };




    // --- KOMBINIERTE FILTER-LOGIK ---
    const gefiltertePraktikas = stellenAngebote.filter(stelle => {
        const matchKategorie = selectedBeruf === '' || stelle.kategorie === selectedBeruf;

        const matchStandort = selectedStandort === '' ||
            stelle.details.standort.toLowerCase().includes(selectedStandort.toLowerCase());

        const matchStart = selectedStartdatum === '' || stelle.details.start === selectedStartdatum;

        const matchSelectedFirma = selectedFirma === '' ||
            stelle.firma.toLowerCase().includes(selectedFirma.toLowerCase());

        const matchEntfernung = selectedDistanz === ''||
            stelle.firma.toLowerCase().includes(selectedFirma.toLowerCase());



        let matchDistanz = true;
        if (selectedDistanz !== '') {
            const maxDistanz = parseInt(selectedDistanz, 10);
            const tatsaechlicheDistanz = stelle.distanz !== undefined ? stelle.distanz : 999; // Falls undefined, setze es hoch an, damit es rausfliegt
            matchDistanz = tatsaechlicheDistanz <= maxDistanz;
        }



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
            } else if (selectedverguetung === 'lohn-bereich2') {
                // Prüft den zweiten Bereich zwischen 1350 und 1750
                matchVergütung = lohnAnzahl >= 1350 && lohnAnzahl <= 1750;
            } else {
                // Vergleicht den extrahierten Mindestlohn mit dem exakt ausgewählten Einzelwert
                const gewaehlterLohn = parseInt(selectedverguetung, 10) || 0;
                matchVergütung = lohnAnzahl === gewaehlterLohn;
            }
        }
        return matchKategorie && matchStandort && matchStart && matchPublikation && matchSelectedFirma && matchVergütung && matchDistanz;

    }); // <-- Das hier behebt den Vite-Fehler! (Runde Klammer schliesst das .filter() )


    const resetFilter = () => {
        setSelectedBeruf('');
        setSelectedStandort('');
        setSelectedStartdatum('');
        setSelectedPublikation('');
        setSelectedFirma('');
        setSelectedverguetung('');
        setSelectedDistanz('');

    };

    return (
        <div className="home-container" style={{padding: '20px', fontFamily: 'sans-serif'}}>

            <header className="home-header">
                <h1 className="lg-title">Aktuelle verfügbare Praktikumsstellen</h1>
            </header>

            <marquee>
                <h2 style={{textShadow: "2px 2px violet"}}>
                    Entdecke einzigartige Jobangebote, welche einzigartig auf dein Profil zugeschnitten sind
                </h2>
            </marquee>


            {/* --- FILTER-BEREICH --- */}
            <div className="filter-container">
                <h3 style={{marginTop: 0, marginBottom: '15px', color: '#1e293b'}}> Nach beliebigen Kriterien
                    filtern</h3>
                <div className="filter-group">

                    {/* Filter 1: Kategorie */}
                    <div>
                        <label htmlFor="beruf-select" className="filter-label">Fachbereich:</label>
                        <select
                            id="beruf-select"
                            value={selectedBeruf}
                            onChange={(e) => setSelectedBeruf(e.target.value)}
                            className="filter-group"
                        >
                            <option value="">-- Alle Berufe --</option>
                            <option value="applikationsentwicklung">Informatiker EFZ Applikationsentwicklung</option>
                            <option value="plattformentwicklung">Informatiker EFZ Plattformentwicklung</option>
                            <option value="applikationsentwicklung_wayup">Informatiker EFZ Applikationsentwicklung
                                (Way-up)
                            </option>
                            <option value="fachmann">ICT-Fachmann/Fachfrau EFZ</option>
                        </select>
                    </div>

                    {/* Filter 2: Firma */}
                    <div>
                        <label htmlFor="firma-select" className="filter-label">Firma:</label>
                        <select
                            id="firma-select"
                            value={selectedFirma}
                            onChange={(e) => setSelectedFirma(e.target.value)}
                            className="filter-select"
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
                        <label htmlFor="lohn-select" className="filter-label">Praktikumslohn:</label>
                        <select
                            id="lohn-select"
                            value={selectedverguetung}
                            onChange={(e) => setSelectedverguetung(e.target.value)}
                            style={styles.filterSelect}
                        >
                            <option value="">-- Alle Praktikumsvergütungen --</option>
                            <option value="lohn-bereich"> Zwischen 1'250 CHF - 1'350 CHF</option>
                            <option value="1250">1'250 CHF</option>
                            <option value="1100">1'100 CHF</option>
                            <option value="1350">1'350 CHF</option>
                            <option value="1280">1'280 CHF</option>
                            <option value="lohn-bereich2">Zwischen 1'350 CHF und -1'700 CHF</option>
                        </select>
                    </div>





                    <div>
                        <label htmlFor="distanz-select" className="filter-label">Distanz zu Firma:</label>
                        <select
                            id="distanz-select"
                            value={selectedDistanz} // 💡 KORREKT: Variable statt Funktion!
                            onChange={(e) => setSelectedDistanz(e.target.value)}
                            className="filter-select" // Tipp: 'filter-select' statt 'filter-label' für korrektes CSS Styling
                        >
                            <option value="">-- Beliebige Distanz --</option>
                            <option value="2">Bis zu 2 km</option>
                            <option value="5">Bis zu 5 km</option>
                            <option value="25">Bis zu 25 km</option>
                            <option value="10">Bis zu 10 km</option>
                            <option value="15">Bis zu 15 km</option>
                            <option value="30">Bis zu 30 km</option>
                        </select>
                    </div>

                    {/* Filter 3: Standort */}
                    <div>
                        <label htmlFor="standort-select" className="filter-label">Region / Ort:</label>
                        <select
                            id="standort-select"
                            value={selectedStandort}
                            onChange={(e) => setSelectedStandort(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">-- Alle Standorte --</option>
                            <option value="Zürich">Zürich (Gesamt)</option>
                            <option value="Oerlikon">Zürich-Oerlikon</option>
                            <option value="Altstetten">Zürich-Altstetten</option>
                            <option value="Winterthur">Winterthur</option>
                            <option value="Zürich-West">Züri-West</option>
                        </select>
                    </div>

                    {/* Filter 4: Startzeitpunkt */}
                    <div>
                        <label htmlFor="start-select" className="filter-label">Startzeitpunkt:</label>
                        <select
                            id="start-select"
                            value={selectedStartdatum}
                            onChange={(e) => setSelectedStartdatum(e.target.value)}
                            className="filter-select"
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
                        <label htmlFor="pub-select" className="filter-label">Veröffentlichungsdatum:</label>
                        <select
                            id="pub-select"
                            value={selectedPublikation}
                            onChange={(e) => setSelectedPublikation(e.target.value)}
                            className="filter-select">
                            <option value="">-- Beliebiges Datum --</option>
                            <option value="heute">Letzte 24-48 Stunden</option>
                            <option value="paar Tage">Letzte 5 Tage</option>
                            <option value="woche">Letzte 7 Tage</option>
                            <option value="monat">Letzte 30 Tage</option>
                        </select>
                    </div>

                </div>

                {/* Filter zurücksetzen Button */}
                {(selectedBeruf || selectedStandort || selectedStartdatum || selectedPublikation || selectedFirma || selectedverguetung) && (
                    <button onClick={resetFilter} className="reset-button">
                        Filter zurücksetzen
                    </button>
                )}
            </div>

            {/* Grid-Anzeige der Stellenkarten */}
            <main className="grid">
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

                            <hr className="divider"/>

                            <div className="section">
                                <h3 className="section-title">Berufsbeschreibung</h3>
                                <p style={styles.text}>{stelle.beschreibung}</p>
                            </div>

                            {/* Details */}
                            <div style={styles.section}>
                                <h3 style={styles.sectionTitle}>Details zur Praktikumsstelle</h3>
                                <h2>
                                    <a href="#login" onClick={(e) => {
                                        e.preventDefault();
                                        navigate("/login");
                                    }}>
                                        Zu den Details
                                    </a>
                                </h2>
                                <ul className="list">
                                    <li><strong>Firma:</strong> {stelle.firma}</li>
                                    <li><strong>Standort:</strong> {stelle.details.standort}</li>
                                    <li><strong>Praktikumsdauer:</strong> {stelle.details.dauer}</li>
                                    <li><strong>Start:</strong> {stelle.details.start}</li>
                                    <li><strong>Anforderungen:</strong> {stelle.details.anforderung}</li>
                                    <li>
                                        <strong>Publikationsdatum:</strong> {stelle.details.publikationsdatum}
                                        {stelle.details.timerIcon && <img src={stelle.details.timerIcon} alt="Timer"
                                                                          style={{
                                                                              width: '14px',
                                                                              marginLeft: '5px',
                                                                              verticalAlign: 'middle'
                                                                          }}/>}
                                    </li>
                                </ul>
                            </div>

                            {/* Praktikumsvergütung */}
                            <div className="price-container">
                                <span className="price-label">Praktikumsvergütung:</span>
                                <span className="price-value">{stelle.verguetung}</span>
                            </div>

                            {isLoggedIn && (
                                <button className="delete-button"
                                        onClick={() => handleDeleteJob(stelle.id)}
                                >
                                    Inserat entfernen
                                </button>
                            )}
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

const styles = {};

export default Home;