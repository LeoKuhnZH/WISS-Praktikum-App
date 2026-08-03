import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
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

    // --- VIEW MODE (Bewerbersicht vs. Unternehmenssicht) ---
    const [viewMode, setViewMode] = useState('bewerber'); // 'bewerber' | 'unternehmen'

    // --- FILTER STATES ---
    const [selectedBeruf, setSelectedBeruf] = useState('');
    const [selectedStandort, setSelectedStandort] = useState('');
    const [selectedStartdatum, setSelectedStartdatum] = useState('');
    const [selectedPublikation, setSelectedPublikation] = useState('');
    const [selectedFirma, setSelectedFirma] = useState('');
    const [selectedverguetung, setSelectedverguetung] = useState('');
    const [selectedDistanz, setSelectedDistanz] = useState('');

    // --- BACKEND / STELLEN STATE ---
    const [stellenAngebote, setStellenAngebote] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- EDIT MODAL STATE ---
    const [editingStelle, setEditingStelle] = useState(null);

    // --- FAVORITEN / GEMERKT STATE ---
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavorites(storedFavs);
    }, []);

    const toggleFavorite = (stelle) => {
        let updatedFavs;
        const isFav = favorites.some(fav => fav.id === stelle.id);
        if (isFav) {
            updatedFavs = favorites.filter(fav => fav.id !== stelle.id);
        } else {
            updatedFavs = [...favorites, stelle];
        }
        setFavorites(updatedFavs);
        localStorage.setItem("favorites", JSON.stringify(updatedFavs));
    };

    // --- NEUES INSERAT STATE (Unternehmenssicht) ---

    // --- KI CHATBOT STATES ---
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hallo! 👋 Ich bin dein persönlicher KI-Assistent. Frag mich etwas zu den aktuellen Praktikumsstellen!' }
    ]);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isChatOpen]);

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
                    verguetung: "1'250 CHF"
                }));
                setStellenAngebote(mapped);
            })
            .catch(err => console.error("Fehler beim Laden:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleDeleteJob = (id) => {
        if (window.confirm("Möchtest du dieses Jobangebot wirklich löschen?")) {
            const aktualisierteStellen = stellenAngebote.filter(stelle => stelle.id !== id);
            setStellenAngebote(aktualisierteStellen);
            alert("Praktikumsstelle wurde gelöscht!");
        }
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        setStellenAngebote(prev => prev.map(s => s.id === editingStelle.id ? editingStelle : s));
        setEditingStelle(null);
        alert("Inserat erfolgreich aktualisiert!");
    };



    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setChatInput('');

        try {
            const response = await fetch('/api/chat/session-123', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: userMsg
            });

            if (!response.ok) throw new Error(`Fehler vom Server: ${response.status}`);

            const botReply = await response.text();
            setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        } catch (error) {
            console.error("Chatbot API-Fehler:", error);
            setMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'Entschuldigung, es gab ein Problem bei der Verbindung zum Server.' }
            ]);
        }
    };

    const gefiltertePraktikas = stellenAngebote.filter(stelle => {
        const matchKategorie = selectedBeruf === '' || stelle.kategorie === selectedBeruf;
        const matchStandort = selectedStandort === '' || stelle.details.standort.toLowerCase().includes(selectedStandort.toLowerCase());
        const matchStart = selectedStartdatum === '' || stelle.details.start === selectedStartdatum;
        const matchSelectedFirma = selectedFirma === '' || stelle.firma.toLowerCase().includes(selectedFirma.toLowerCase());

        let matchDistanz = true;
        if (selectedDistanz !== '') {
            const maxDistanz = parseInt(selectedDistanz, 10);
            const tatsaechlicheDistanz = stelle.details.distanz !== undefined ? stelle.details.distanz : 999;
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
            const ersteZahlMatch = lohnText.replace(/['\s]/g, '').match(/\d+/);
            const lohnAnzahl = ersteZahlMatch ? parseInt(ersteZahlMatch[0], 10) : 0;

            if (selectedverguetung === 'lohn-bereich') {
                matchVergütung = lohnAnzahl >= 1250 && lohnAnzahl <= 1350;
            } else if (selectedverguetung === 'lohn-bereich2') {
                matchVergütung = lohnAnzahl >= 1350 && lohnAnzahl <= 1750;
            } else {
                const gewaehlterLohn = parseInt(selectedverguetung, 10) || 0;
                matchVergütung = lohnAnzahl === gewaehlterLohn;
            }
        }
        return matchKategorie && matchStandort && matchStart && matchPublikation && matchSelectedFirma && matchVergütung && matchDistanz;
    });

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
        <div className="home-container" style={{padding: '20px', fontFamily: 'sans-serif', position: 'relative', minHeight: '100vh'}}>

            <header className="home-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1 className="lg-title">Praktikumsportal</h1>

                <div style={{display: 'flex', gap: '10px'}}>
                    <button
                        onClick={() => setViewMode('bewerber')}
                        style={{padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', backgroundColor: viewMode === 'bewerber' ? '#2563eb' : '#e2e8f0', color: viewMode === 'bewerber' ? '#fff' : '#000', border: 'none', fontWeight: 'bold'}}
                    >
                        👨‍🎓 Bewerbersicht
                    </button>
                    <button
                        onClick={() => setViewMode('unternehmen')}
                        style={{padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', backgroundColor: viewMode === 'unternehmen' ? '#2563eb' : '#e2e8f0', color: viewMode === 'unternehmen' ? '#fff' : '#000', border: 'none', fontWeight: 'bold'}}
                    >
                        🏢 Unternehmenssicht
                    </button>
                </div>
            </header>

            <marquee>
                <h2 style={{textShadow: "2px 2px violet"}}>
                    {viewMode === 'bewerber' ? 'Entdecke einzigartige Jobangebote, welche auf dein Profil zugeschnitten sind' : 'Verwalte deine Inserate, erstelle neue Stellen und finde passende Lernende'}
                </h2>
            </marquee>


            {/* FILTER BEREICH */}
            <div className="filter-container">
                <h3 style={{marginTop: 0, marginBottom: '15px', color: '#1e293b'}}> Nach beliebigen Kriterien filtern</h3>
                <div className="filter-group">
                    <div>
                        <label htmlFor="beruf-select" className="filter-label">Fachbereich:</label>
                        <select id="beruf-select" value={selectedBeruf} onChange={(e) => setSelectedBeruf(e.target.value)} className="filter-select">
                            <option value="">-- Alle Berufe --</option>
                            <option value="applikationsentwicklung">Informatiker EFZ Applikationsentwicklung</option>
                            <option value="plattformentwicklung">Informatiker EFZ Plattformentwicklung</option>
                            <option value="applikationsentwicklung_wayup">Informatiker EFZ Applikationsentwicklung (Way-up)</option>
                            <option value="fachmann">ICT-Fachmann/Fachfrau EFZ</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="firma-select" className="filter-label">Firma:</label>
                        <select id="firma-select" value={selectedFirma} onChange={(e) => setSelectedFirma(e.target.value)} className="filter-select">
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
                        <select id="lohn-select" value={selectedverguetung} onChange={(e) => setSelectedverguetung(e.target.value)} className="filter-select">
                            <option value="">-- Alle Praktikumsvergütungen --</option>
                            <option value="lohn-bereich"> Zwischen 1'250 CHF - 1'350 CHF</option>
                            <option value="1250">1'250 CHF</option>
                            <option value="1100">1'100 CHF</option>
                            <option value="1350">1'350 CHF</option>
                            <option value="1280">1'280 CHF</option>
                            <option value="lohn-bereich2">Zwischen 1'350 CHF und 1'700 CHF</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="distanz-select" className="filter-label">Distanz zu Firma:</label>
                        <select id="distanz-select" value={selectedDistanz} onChange={(e) => setSelectedDistanz(e.target.value)} className="filter-select">
                            <option value="">-- Beliebige Distanz --</option>
                            <option value="2">Bis zu 2 km</option>
                            <option value="5">Bis zu 5 km</option>
                            <option value="10">Bis zu 10 km</option>
                            <option value="15">Bis zu 15 km</option>
                            <option value="25">Bis zu 25 km</option>
                            <option value="30">Bis zu 30 km</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="standort-select" className="filter-label">Region / Ort:</label>
                        <select id="standort-select" value={selectedStandort} onChange={(e) => setSelectedStandort(e.target.value)} className="filter-select">
                            <option value="">-- Alle Standorte --</option>
                            <option value="Zürich">Zürich (Gesamt)</option>
                            <option value="Oerlikon">Zürich-Oerlikon</option>
                            <option value="Altstetten">Zürich-Altstetten</option>
                            <option value="Winterthur">Winterthur</option>
                            <option value="Zürich-West">Züri-West</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="start-select" className="filter-label">Startzeitpunkt:</label>
                        <select id="start-select" value={selectedStartdatum} onChange={(e) => setSelectedStartdatum(e.target.value)} className="filter-select">
                            <option value="">-- Jedes Startdatum --</option>
                            <option value="August 2026">August 2026</option>
                            <option value="August 2027">August 2027</option>
                            <option value="Per sofort">Per sofort</option>
                            <option value="Nach Vereinbarung">Nach Vereinbarung</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="pub-select" className="filter-label">Veröffentlichungsdatum:</label>
                        <select id="pub-select" value={selectedPublikation} onChange={(e) => setSelectedPublikation(e.target.value)} className="filter-select">
                            <option value="">-- Beliebiges Datum --</option>
                            <option value="heute">Letzte 24-48 Stunden</option>
                            <option value="paar Tage">Letzte 5 Tage</option>
                            <option value="woche">Letzte 7 Tage</option>
                            <option value="monat">Letzte 30 Tage</option>
                        </select>
                    </div>
                </div>

                {(selectedBeruf || selectedStandort || selectedStartdatum || selectedPublikation || selectedFirma || selectedverguetung || selectedDistanz) && (
                    <button onClick={resetFilter} className="reset-button">
                        Filter zurücksetzen
                    </button>
                )}
            </div>

            {/* JOBCARDS ANZEIGE */}
            <main className="grid">
                {loading ? (
                    <p>Lade Inserate...</p>
                ) : gefiltertePraktikas.length > 0 ? (
                    gefiltertePraktikas.map((stelle) => {
                        const isFav = favorites.some(f => f.id === stelle.id);
                        return (
                            <div key={stelle.id} className="card" style={{position: 'relative'}}>
                                <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                    <div>
                                        <h2 className="job-title">{stelle.titel}</h2>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        <button
                                            onClick={() => toggleFavorite(stelle)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: '22px',
                                                cursor: 'pointer',
                                                padding: '4px'
                                            }}
                                            title={isFav ? "Gemerktes Inserat entfernen" : "Inserat merken"}
                                        >
                                            {isFav ? '⭐' : '🤍'}
                                        </button>
                                        <img className="logo" src={stelle.logo} alt={`${stelle.firma} Logo`} />
                                    </div>
                                </div>

                                <hr className="divider"/>

                                <div className="section">
                                    <h3 className="section-title">Berufsbeschreibung</h3>
                                    <p>{stelle.beschreibung}</p>
                                </div>

                                <div className="section">
                                    <h3 className="section-title">Details zur Praktikumsstelle</h3>
                                    <ul className="list">
                                        <li><strong>Firma:</strong> {stelle.firma}</li>
                                        <li><strong>Standort:</strong> {stelle.details.standort}</li>
                                        <li><strong>Praktikumsdauer:</strong> {stelle.details.dauer}</li>
                                        <li><strong>Start:</strong> {stelle.details.start}</li>
                                        <li><strong>Vergütung:</strong> {stelle.verguetung}</li>
                                        <li><strong>Anforderungen:</strong> {stelle.details.anforderung}</li>
                                        <li>
                                            <strong>Publikationsdatum:</strong> {stelle.details.publikationsdatum}
                                            {stelle.details.timerIcon && <img src={stelle.details.timerIcon} alt="Timer" style={{ width: '14px', marginLeft: '5px', verticalAlign: 'middle' }}/>}
                                        </li>
                                    </ul>
                                </div>

                                {(isLoggedIn || viewMode === 'unternehmen') && (
                                    <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                                        <button
                                            onClick={() => setEditingStelle(stelle)}
                                            style={{flex: 1, backgroundColor: '#eab308', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}
                                        >
                                            ✏️ Bearbeiten
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteJob(stelle.id)}
                                            style={{flex: 1, margin: 0}}
                                        >
                                            🗑️ Entfernen
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <h2>Keine passenden Stellenangebote gefunden.</h2>
                )}
            </main>

            {/* MODAL FÜR INSERAT BEARBEITEN */}
            {editingStelle && (
                <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000}}>
                    <div style={{backgroundColor: '#fff', padding: '25px', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto'}}>
                        <h2>Inserat bearbeiten</h2>
                        <form onSubmit={handleSaveEdit} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            <label>Titel:</label>
                            <input type="text" value={editingStelle.titel} onChange={(e) => setEditingStelle({...editingStelle, titel: e.target.value})} className="filter-select" />

                            <label>Firma:</label>
                            <input type="text" value={editingStelle.firma} onChange={(e) => setEditingStelle({...editingStelle, firma: e.target.value})} className="filter-select" />

                            <label>Beschreibung:</label>
                            <textarea value={editingStelle.beschreibung} onChange={(e) => setEditingStelle({...editingStelle, beschreibung: e.target.value})} className="filter-select" style={{height: '60px'}} />

                            <label>Standort:</label>
                            <input type="text" value={editingStelle.details.standort} onChange={(e) => setEditingStelle({...editingStelle, details: {...editingStelle.details, standort: e.target.value}})} className="filter-select" />

                            <label>Dauer:</label>
                            <input type="text" value={editingStelle.details.dauer} onChange={(e) => setEditingStelle({...editingStelle, details: {...editingStelle.details, dauer: e.target.value}})} className="filter-select" />

                            <label>Startdatum:</label>
                            <input type="text" value={editingStelle.details.start} onChange={(e) => setEditingStelle({...editingStelle, details: {...editingStelle.details, start: e.target.value}})} className="filter-select" />

                            <label>Vergütung:</label>
                            <input type="text" value={editingStelle.verguetung} onChange={(e) => setEditingStelle({...editingStelle, verguetung: e.target.value})} className="filter-select" />

                            <label>Anforderungen:</label>
                            <input type="text" value={editingStelle.details.anforderung} onChange={(e) => setEditingStelle({...editingStelle, details: {...editingStelle.details, anforderung: e.target.value}})} className="filter-select" />

                            <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                                <button type="submit" style={{flex: 1, backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Speichern</button>
                                <button type="button" onClick={() => setEditingStelle(null)} style={{flex: 1, backgroundColor: '#64748b', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Abbrechen</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* KI CHATBOT WIDGET */}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
                {!isChatOpen ? (
                    <button
                        onClick={() => setIsChatOpen(true)}
                        style={{
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50px',
                            padding: '14px 22px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        💬 KI-Assistent
                    </button>
                ) : (
                    <div style={{
                        width: '340px',
                        height: '450px',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            padding: '12px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontWeight: 'bold'
                        }}>
                            <span>🤖 KI-Chatbot</span>
                            <button onClick={() => setIsChatOpen(false)} style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '18px', cursor: 'pointer' }}>✖</button>
                        </div>

                        <div style={{
                            flex: 1,
                            padding: '12px',
                            overflowY: 'auto',
                            backgroundColor: '#f8fafc',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    style={{
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        backgroundColor: msg.sender === 'user' ? '#2563eb' : '#e2e8f0',
                                        color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                                        padding: '8px 12px',
                                        borderRadius: '12px',
                                        maxWidth: '80%',
                                        fontSize: '14px',
                                        lineHeight: '1.4'
                                    }}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} style={{ display: 'flex', borderTop: '1px solid #e2e8f0', padding: '8px', backgroundColor: '#fff' }}>
                            <input
                                type="text"
                                placeholder="Eine Frage stellen..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', fontSize: '14px' }}
                            />
                            <button type="submit" style={{ marginLeft: '6px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer', fontWeight: 'bold' }}>Senden</button>
                        </form>
                    </div>
                )}
            </div>

            <div className="box3"></div>
        </div>
    );
}

export default Home;