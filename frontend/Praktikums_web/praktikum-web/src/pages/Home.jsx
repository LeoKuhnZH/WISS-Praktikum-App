import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import UBS from "../assets/UBS.png";
import Ergon from "../assets/Ergon.png";
import Timer from "../assets/Timer.png";
import Escola from "../assets/Escola.png";
import Smoca from "../assets/Smoca.png";
import Boutique from "../assets/Boutique.png";
import Bergos from "../assets/Bergos.jpg";
import Cloud from "../assets/Cloud.jpg";
import Netcetera from "../assets/Netcetera.jpg";
import Avaloq from "../assets/Avaloq.jpg";
import "./components/style/style.css";

function Home({ isLoggedIn }) {
    const navigate = useNavigate();

    // --- VIEW MODE (Bewerbersicht vs. Unternehmenssicht) ---
    const [viewMode, setViewMode] = useState("bewerber"); // 'bewerber' | 'unternehmen'

    // --- FILTER STATES ---
    const [selectedBeruf, setSelectedBeruf] = useState("");
    const [selectedStandort, setSelectedStandort] = useState("");
    const [selectedStartdatum, setSelectedStartdatum] = useState("");
    const [selectedPublikation, setSelectedPublikation] = useState("");
    const [selectedFirma, setSelectedFirma] = useState("");
    const [selectedverguetung, setSelectedverguetung] = useState("");
    const [selectedDistanz, setSelectedDistanz] = useState("");

    // --- BACKEND / STELLEN STATE ---
    const [stellenAngebote, setStellenAngebote] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- EDIT MODAL STATE ---
    const [editingStelle, setEditingStelle] = useState(null);

    // --- BEWERBUNG MODAL & STATE ---
    const [applyingStelle, setApplyingStelle] = useState(null);
    const [bewerbungen, setBewerbungen] = useState([]); // Eingegangene Bewerbungen
    const [bewerbungForm, setBewerbungForm] = useState({
        name: "",
        email: "",
        gitUrl: "",
        gitlabURL: "",
        linkedIn: "",
        nachricht: "",
        cvFile: null,
        zeugnisseFile: null,
        weitereDokus: null,
    });

    // --- FAVORITEN / GEMERKT STATE ---
    const [favorites, setFavorites] = useState([]);

    const [sessionId] = useState(
        () => "session-" + Math.random().toString(36).substring(2, 9)
    );

    useEffect(() => {
        const storedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavorites(storedFavs);

        const storedBewerbungen = JSON.parse(
            localStorage.getItem("bewerbungen") || "[]"
        );
        setBewerbungen(storedBewerbungen);
    }, []);

    const toggleFavorite = (stelle) => {
        let updatedFavs;
        const isFav = favorites.some((fav) => fav.id === stelle.id);
        if (isFav) {
            updatedFavs = favorites.filter((fav) => fav.id !== stelle.id);
        } else {
            updatedFavs = [...favorites, stelle];
        }
        setFavorites(updatedFavs);
        localStorage.setItem("favorites", JSON.stringify(updatedFavs));
    };

    // --- KI CHATBOT STATES ---
// --- KI CHATBOT STATES ---
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatFile, setChatFile] = useState(null);
    const [chatPreviewUrl, setChatPreviewUrl] = useState(null);
    const [chatInput, setChatInput] = useState("");
    const chatFileInputRef = useRef(null);
    const chatEndRef = useRef(null);
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hallo! 👋 Ich bin dein persönlicher KI-Assistent Superchat. Frag mich etwas zu den aktuellen Praktikumsstellen!",
        },
    ]);

    const handleRemoveChatFile = () => {
        setChatFile(null);
        setChatPreviewUrl(null);
        if (chatFileInputRef.current) chatFileInputRef.current.value = "";
    };

    const handleChatFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setChatFile(file);
            if (file.type.startsWith("image/")) {
                setChatPreviewUrl(URL.createObjectURL(file));
            } else {
                setChatPreviewUrl(null);
            }
        }
    };



    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() && !chatFile) return;

        const userMsg = chatInput.trim();
        const attachedFile = chatFile;
        const attachedPreview = chatPreviewUrl;

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: userMsg,
                fileName: attachedFile ? attachedFile.name : null,
                filePreview: attachedPreview,
            },
        ]);

        setChatInput("");
        handleRemoveChatFile();

        try {
            let response;
            if (attachedFile) {
                const formData = new FormData();
                formData.append("message", userMsg);
                formData.append("file", attachedFile);

                response = await fetch(`/api/chat/${sessionId}/upload`, {
                    method: "POST",
                    body: formData,
                });
            } else {
                response = await fetch(`/api/chat/${sessionId}`, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain" },
                    body: userMsg,
                });
            }

            if (!response.ok) throw new Error(`Serverfehler: ${response.status}`);

            const botReply = await response.text();
            setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
        } catch (error) {
            console.error("Chatbot Fehler:", error);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Entschuldigung, es gab ein Problem bei der Verbindung zum Backend.",
                },
            ]);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isChatOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isChatOpen]);

    useEffect(() => {
        fetch("/api/posting/all")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Backend Fehler ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then((data) => {
                const mapped = data.map((p) => ({
                    id: p.id,
                    kategorie: p.position || "",
                    titel: p.title || "Unbenannte Stelle",
                    firma: p.company || "Unbekannte Firma",
                    logo: UBS,
                    beschreibung: p.body || "Keine Beschreibung vorhanden.",
                    details: {
                        standort: p.position || "Standort nicht verfügbar",
                        dauer: p.expirationDate || "keine Angabe",
                        start: p.dateCreated
                            ? new Date(p.dateCreated).toLocaleDateString()
                            : "keine Angabe",
                        anforderung: p.companyDescription || "keine Angabe",
                        publikationsdatum: p.dateCreated
                            ? new Date(p.dateCreated).toLocaleDateString()
                            : "keine Angabe",
                        timerIcon: Timer,
                        distanz: p.distance || 5,
                    },
                    verguetung: "1'250 CHF",
                }));
                setStellenAngebote(mapped);
            })
            .catch((err) => console.error("Fehler beim Laden:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleDeleteJob = (id) => {
        if (window.confirm("Möchtest du dieses Jobangebot wirklich löschen?")) {
            const aktualisierteStellen = stellenAngebote.filter(
                (stelle) => stelle.id !== id
            );
            setStellenAngebote(aktualisierteStellen);
            alert("Praktikumsstelle wurde gelöscht!");
        }
    };

    // --- HANDLE EDIT SAVE ---
    const handleSaveEdit = (e) => {
        e.preventDefault();
        setStellenAngebote((prev) =>
            prev.map((s) => (s.id === editingStelle.id ? editingStelle : s))
        );
        setEditingStelle(null);
        alert("Inserat erfolgreich aktualisiert!");
    };
    // --- BEWERBUNG ABSCHICKEN ---
    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setBewerbungForm((prev) => ({
                ...prev,
                [field]: {
                    name: file.name,
                    url: URL.createObjectURL(file),
                    type: file.type,
                },
            }));
        }
    };

    const handleSubmitBewerbung = (e) => {
        e.preventDefault();

        const neueBewerbung = {
            id: Date.now(),
            stelleId: applyingStelle.id,
            stelleTitel: applyingStelle.titel,
            firma: applyingStelle.firma,
            datum: new Date().toLocaleDateString("de-CH"),
            ...bewerbungForm,
        };

        const updated = [...bewerbungen, neueBewerbung];
        setBewerbungen(updated);
        localStorage.setItem("bewerbungen", JSON.stringify(updated));

        alert(
            `Deine Bewerbung für "${applyingStelle.titel}" bei ${applyingStelle.firma} wurde erfolgreich hochgeladen!`
        );

        setApplyingStelle(null);
        setBewerbungForm({
            name: "",
            email: "",
            gitUrl: "",
            nachricht: "",
            cvFile: null,
            zeugnisseFile: null,
            weitereDokus: null,
        });
    };



    // SCHUTZ VOR NULL/UNDEFINED BEIM FILTERN
    const gefiltertePraktikas = stellenAngebote.filter((stelle) => {
        if (!stelle) return false;
        const details = stelle.details || {};

        const matchKategorie =
            selectedBeruf === "" || stelle.kategorie === selectedBeruf;
        const matchStandort =
            selectedStandort === "" ||
            (details.standort &&
                details.standort
                    .toLowerCase()
                    .includes(selectedStandort.toLowerCase()));
        const matchStart =
            selectedStartdatum === "" || details.start === selectedStartdatum;
        const matchSelectedFirma =
            selectedFirma === "" ||
            (stelle.firma &&
                stelle.firma.toLowerCase().includes(selectedFirma.toLowerCase()));

        let matchDistanz = true;
        if (selectedDistanz !== "") {
            const maxDistanz = parseInt(selectedDistanz, 10);
            const tatsaechlicheDistanz =
                details.distanz !== undefined ? details.distanz : 999;
            matchDistanz = tatsaechlicheDistanz <= maxDistanz;
        }

        let matchPublikation = true;
        if (selectedPublikation !== "" && details.publikationsdatum) {
            const tage =
                parseInt(details.publikationsdatum.replace(/[^0-9]/g, ""), 10) || 0;
            if (selectedPublikation === "heute") {
                matchPublikation =
                    details.publikationsdatum.includes("0 Tage") ||
                    details.publikationsdatum.includes("1 Tag");
            } else if (selectedPublikation === "woche") {
                matchPublikation = tage <= 7;
            } else if (selectedPublikation === "paar Tage") {
                matchPublikation = tage <= 5;
            } else if (selectedPublikation === "monat") {
                matchPublikation = tage <= 30;
            }
        }

        let matchVergütung = true;
        if (selectedverguetung !== "") {
            const lohnText = stelle.verguetung || "";
            const ersteZahlMatch = lohnText.replace(/['\s]/g, "").match(/\d+/);
            const lohnAnzahl = ersteZahlMatch ? parseInt(ersteZahlMatch[0], 10) : 0;

            if (selectedverguetung === "lohn-bereich") {
                matchVergütung = lohnAnzahl >= 1250 && lohnAnzahl <= 1350;
            } else if (selectedverguetung === "lohn-bereich2") {
                matchVergütung = lohnAnzahl >= 1350 && lohnAnzahl <= 1750;
            } else {
                const gewaehlterLohn = parseInt(selectedverguetung, 10) || 0;
                matchVergütung = lohnAnzahl === gewaehlterLohn;
            }
        }
        return (
            matchKategorie &&
            matchStandort &&
            matchStart &&
            matchPublikation &&
            matchSelectedFirma &&
            matchVergütung &&
            matchDistanz
        );
    });

    const resetFilter = () => {
        setSelectedBeruf("");
        setSelectedStandort("");
        setSelectedStartdatum("");
        setSelectedPublikation("");
        setSelectedFirma("");
        setSelectedverguetung("");
        setSelectedDistanz("");
    };

    return (
        <div
            className="home-container"
            style={{
                padding: "20px",
                fontFamily: "sans-serif",
                position: "relative",
                minHeight: "100vh",
            }}
        >
            <header
                className="home-header"
                style={{
                    display: "flex",
                    justify: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <h1 className="lg-title">ICT-Praktikumsportal WISS Connect</h1>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={() => setViewMode("bewerber")}
                        style={{
                            padding: "10px 16px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            backgroundColor: viewMode === "bewerber" ? "#2563eb" : "#e2e8f0",
                            color: viewMode === "bewerber" ? "#fff" : "#000",
                            border: "none",
                            fontWeight: "bold",
                        }}
                    >
                        👨‍🎓 Bewerbersicht
                    </button>
                    <button
                        onClick={() => setViewMode("unternehmen")}
                        style={{
                            padding: "10px 16px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            backgroundColor:
                                viewMode === "unternehmen" ? "#2563eb" : "#e2e8f0",
                            color: viewMode === "unternehmen" ? "#fff" : "#000",
                            border: "none",
                            fontWeight: "bold",
                        }}
                    >
                        🏢 Unternehmenssicht ({bewerbungen.length} Bewerbungen)
                    </button>
                </div>
            </header>

            <marquee>
                <h2 style={{ textShadow: "2px 2px violet" }}>
                    {viewMode === "bewerber"
                        ? "Entdecke einzigartige Jobangebote, welche auf dein Profil zugeschnitten sind"
                        : "Verwalte deine Inserate, erstelle neue Stellen und sichte eingegangene Bewerbungsunterlagen"}
                </h2>
            </marquee>

            {/* FILTER BEREICH */}
            <div className="filter-container">
                <h3 style={{ marginTop: 0, marginBottom: "15px", color: "#1e293b" }}>
                    Nach beliebigen Kriterien filtern
                </h3>
                <div className="filter-group">
                    <div>
                        <label htmlFor="beruf-select" className="filter-label">
                            Fachbereich:
                        </label>
                        <select
                            id="beruf-select"
                            value={selectedBeruf}
                            onChange={(e) => setSelectedBeruf(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">-- Alle Berufe --</option>
                            <option value="applikationsentwicklung">
                                Informatiker EFZ Applikationsentwicklung
                            </option>
                            <option value="plattformentwicklung">
                                Informatiker EFZ Plattformentwicklung
                            </option>
                            <option value="applikationsentwicklung_wayup">
                                Informatiker EFZ Applikationsentwicklung (Way-up)
                            </option>
                            <option value="fachmann">ICT-Fachmann/Fachfrau EFZ</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="firma-select" className="filter-label">
                            Firma:
                        </label>
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
                            <option value="Enterprise Cloud">
                                Enterprise Cloud Systems
                            </option>
                            <option value="Escola">Escola GmbH</option>
                            <option value="Bergos">Bergos AG</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="lohn-select" className="filter-label">
                            Praktikumslohn:
                        </label>
                        <select
                            id="lohn-select"
                            value={selectedverguetung}
                            onChange={(e) => setSelectedverguetung(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">-- Alle Praktikumsvergütungen --</option>
                            <option value="lohn-bereich">
                                Zwischen 1'250 CHF - 1'350 CHF
                            </option>
                            <option value="1250">1'250 CHF</option>
                            <option value="1100">1'100 CHF</option>
                            <option value="1350">1'350 CHF</option>
                            <option value="1280">1'280 CHF</option>
                            <option value="lohn-bereich2">
                                Zwischen 1'350 CHF und 1'700 CHF
                            </option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="distanz-select" className="filter-label">
                            Distanz zu Firma:
                        </label>
                        <select
                            id="distanz-select"
                            value={selectedDistanz}
                            onChange={(e) => setSelectedDistanz(e.target.value)}
                            className="filter-select"
                        >
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
                        <label htmlFor="standort-select" className="filter-label">
                            Region / Ort:
                        </label>
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

                    <div>
                        <label htmlFor="start-select" className="filter-label">
                            Startzeitpunkt:
                        </label>
                        <select
                            id="start-select"
                            value={selectedStartdatum}
                            required
                            placeholder="14.August 2026"
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

                    <div>
                        <label htmlFor="pub-select" className="filter-label">
                            Veröffentlichungsdatum:
                        </label>
                        <select
                            id="pub-select"
                            value={selectedPublikation}
                            onChange={(e) => setSelectedPublikation(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">-- Beliebiges Datum --</option>
                            <option value="heute">Letzte 24-48 Stunden</option>
                            <option value="paar Tage">Letzte 5 Tage</option>
                            <option value="woche">Letzte 7 Tage</option>
                            <option value="monat">Letzte 30 Tage</option>
                        </select>
                    </div>
                </div>

                {(selectedBeruf ||
                    selectedStandort ||
                    selectedStartdatum ||
                    selectedPublikation ||
                    selectedFirma ||
                    selectedverguetung ||
                    selectedDistanz) && (
                    <button onClick={resetFilter} className="reset-button">
                        Filter zurücksetzen
                    </button>
                )}
            </div>

            {/* UNTERNEHMENSSICHT: EINGEGANGENE BEWERBUNGEN ÜBERSICHT */}
            {viewMode === "unternehmen" && (
                <div
                    style={{
                        marginBottom: "30px",
                        padding: "20px",
                        backgroundColor: "#f1f5f9",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                    }}
                >
                    <h2>📩 Eingegangene Bewerbungen ({bewerbungen.length})</h2>
                    {bewerbungen.length === 0 ? (
                        <p>Noch keine Bewerbungen eingegangen.</p>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                            }}
                        >
                            {bewerbungen.map((b) => (
                                <div
                                    key={b.id}
                                    style={{
                                        backgroundColor: "#fff",
                                        padding: "15px",
                                        borderRadius: "6px",
                                        border: "1px solid #e2e8f0",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justify: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <h3 style={{ margin: 0 }}>
                                            {b.name} ({b.email})
                                        </h3>
                                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                      Eingegangen am: {b.datum}
                    </span>
                                    </div>
                                    <p style={{ margin: "5px 0" }}>
                                        <strong>Stelle:</strong> {b.stelleTitel} bei {b.firma}
                                    </p>
                                    {b.gitUrl && (
                                        <p style={{ margin: "5px 0" }}>
                                            <strong>GitHub / Portfolio:</strong>{" "}
                                            <a href={b.gitUrl} target="_blank" rel="noreferrer">
                                                {b.gitUrl}
                                            </a>
                                        </p>
                                    )}
                                    {b.nachricht && (
                                        <p style={{ margin: "5px 0" }}>
                                            <strong>Nachricht:</strong> {b.nachricht}
                                        </p>
                                    )}

                                    <div
                                        style={{
                                            marginTop: "10px",
                                            display: "flex",
                                            gap: "10px",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <strong>Angehängte Dokumente:</strong>
                                        {b.cvFile ? (
                                            <a
                                                href={b.cvFile.url}
                                                download={b.cvFile.name}
                                                style={{ color: "#2563eb", fontWeight: "bold" }}
                                            >
                                                📄 Lebenslauf ({b.cvFile.name})
                                            </a>
                                        ) : (
                                            <span style={{ color: "#94a3b8" }}>Kein CV</span>
                                        )}

                                        {b.zeugnisseFile && (
                                            <a
                                                href={b.zeugnisseFile.url}
                                                download={b.zeugnisseFile.name}
                                                style={{ color: "#2563eb", fontWeight: "bold" }}
                                            >
                                                📂 Zeugnisse ({b.zeugnisseFile.name})
                                            </a>
                                        )}

                                        {b.weitereDokus && (
                                            <a
                                                href={b.weitereDokus.url}
                                                download={b.weitereDokus.name}
                                                style={{ color: "#2563eb", fontWeight: "bold" }}
                                            >
                                                📎 Weitere Doku ({b.weitereDokus.name})
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}


            <div
                style={{
                    position: "fixed",
                    bottom: "25px",
                    right: "25px",
                    zIndex: 3000,
                }}
            >
                {!isChatOpen ? (
                    <button
                        onClick={() => setIsChatOpen(true)}
                        style={{
                            backgroundColor: "#2563eb",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50px",
                            padding: "14px 22px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        💬 KI-Chatbot
                    </button>
                ) : (
                    <div
                        style={{
                            width: "360px",
                            height: "500px",
                            backgroundColor: "#fff",
                            borderRadius: "12px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            border: "1px solid #cbd5e1",
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                backgroundColor: "#2563eb",
                                color: "#fff",
                                padding: "12px 16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontWeight: "bold",
                            }}
                        >
                            <span>🤖 KI Support Assistant</span>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "18px",
                                    cursor: "pointer",
                                }}
                            >
                                ✖
                            </button>
                        </div>

                        {/* Nachrichtenverlauf */}
                        <div
                            style={{
                                flex: 1,
                                padding: "12px",
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                backgroundColor: "#f8fafc",
                            }}
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    style={{
                                        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                        backgroundColor: msg.sender === "user" ? "#2563eb" : "#e2e8f0",
                                        color: msg.sender === "user" ? "#fff" : "#0f172a",
                                        padding: "8px 12px",
                                        borderRadius: "12px",
                                        maxWidth: "80%",
                                        fontSize: "14px",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {msg.text}
                                    {msg.filePreview && (
                                        <img
                                            src={msg.filePreview}
                                            alt="Anhang"
                                            style={{
                                                marginTop: "6px",
                                                maxWidth: "100%",
                                                maxHeight: "120px",
                                                borderRadius: "6px",
                                                display: "block",
                                            }}
                                        />
                                    )}
                                    {msg.fileName && !msg.filePreview && (
                                        <div
                                            style={{
                                                marginTop: "4px",
                                                fontSize: "11px",
                                                opacity: 0.8,
                                                fontStyle: "italic",
                                            }}
                                        >
                                            📎 {msg.fileName}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* DATEI-VORSCHAU IN DER EINGABEZEILE */}
                        {chatFile && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "6px 12px",
                                    backgroundColor: "#f1f5f9",
                                    borderTop: "1px solid #cbd5e1",
                                }}
                            >
                                {chatPreviewUrl ? (
                                    <img
                                        src={chatPreviewUrl}
                                        alt="Vorschau"
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                        }}
                                    />
                                ) : (
                                    <span style={{ fontSize: "12px", color: "#475569" }}>
                                        📄 {chatFile.name}
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={handleRemoveChatFile}
                                    style={{
                                        marginLeft: "auto",
                                        border: "none",
                                        background: "transparent",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        color: "#ef4444",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Input Formular */}
                        <form
                            onSubmit={handleSendMessage}
                            style={{
                                display: "flex",
                                padding: "8px",
                                borderTop: "1px solid #cbd5e1",
                                backgroundColor: "#fff",
                                gap: "6px",
                                alignItems: "center",
                            }}
                        >
                            <input
                                type="file"
                                ref={chatFileInputRef}
                                onChange={handleChatFileChange}
                                style={{ display: "none" }}
                                accept="image/*,application/pdf"
                            />

                            <button
                                type="button"
                                onClick={() => chatFileInputRef.current?.click()}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    fontSize: "18px",
                                    cursor: "pointer",
                                    padding: "4px",
                                }}
                                title="Datei oder Bild anhängen"
                            >
                                📎
                            </button>

                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Schreibe eine Nachricht..."
                                style={{
                                    flex: 1,
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "6px",
                                    padding: "8px",
                                    outline: "none",
                                }}
                            />

                            <button
                                type="submit"
                                style={{
                                    backgroundColor: "#2563eb",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }}
                            >
                                Senden
                            </button>
                        </form>
                   </div>
                )}
            </div>
            {/* JOBCARDS ANZEIGE */}
            <main className="grid">
                {loading ? (
                    <p>Lade Inserate...</p>
                ) : gefiltertePraktikas.length > 0 ? (
                    gefiltertePraktikas.map((stelle) => {
                        const isFav = favorites.some((f) => f.id === stelle.id);
                        return (
                            <div
                                key={stelle.id}
                                className="card"
                                style={{
                                    position: "relative",
                                    display: "flex",
                                    flexDirection: "column",
                                    justify: "space-between",
                                }}
                            >
                                <div>
                                    <div
                                        className="card-header"
                                        style={{
                                            display: "flex",
                                            justify: "space-between",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <div>
                                            <h2 className="job-title">{stelle.titel}</h2>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                            }}
                                        >
                                            <button
                                                onClick={() => toggleFavorite(stelle)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    fontSize: "22px",
                                                    cursor: "pointer",
                                                    padding: "4px",
                                                }}
                                                title={
                                                    isFav
                                                        ? "Gemerktes Inserat entfernen"
                                                        : "Inserat merken"
                                                }
                                            >
                                                {isFav ? "⭐" : "🤍"}
                                            </button>
                                            <img
                                                className="logo"
                                                src={stelle.logo}
                                                alt={`${stelle.firma} Logo`}
                                            />
                                        </div>
                                    </div>

                                    <hr className="divider" />

                                    <div className="section">
                                        <h3 className="section-title">Berufsbeschreibung</h3>
                                        <p>{stelle.beschreibung}</p>
                                    </div>

                                    <div className="section">
                                        <h3 className="section-title">
                                            Details zur Praktikumsstelle
                                        </h3>
                                        <ul className="list">
                                            <li>
                                                <strong>Firma:</strong> {stelle.firma}
                                            </li>
                                            <li>
                                                <strong>Standort:</strong>{" "}
                                                {stelle.details?.standort || "keine Angabe"}
                                            </li>
                                            <li>
                                                <strong>Praktikumsdauer:</strong>{" "}
                                                {stelle.details?.dauer || "keine Angabe"}
                                            </li>
                                            <li>
                                                <strong>Start:</strong>{" "}
                                                {stelle.details?.start || "keine Angabe"}
                                            </li>
                                            <li>
                                                <strong>Vergütung:</strong> {stelle.verguetung}
                                            </li>
                                            <li>
                                                <strong>Anforderungen:</strong>{" "}
                                                {stelle.details?.anforderung || "keine Angabe"}
                                            </li>

                                            <li>
                                                <strong>Publikationsdatum:</strong>{" "}
                                                {stelle.details?.publikationsdatum || "keine Angabe"}
                                                {stelle.details?.timerIcon && (
                                                    <img
                                                        src={stelle.details.timerIcon}
                                                        alt="Timer"
                                                        style={{
                                                            width: "14px",
                                                            marginLeft: "5px",
                                                            verticalAlign: "middle",
                                                        }}
                                                    />
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* BEWERBEN & BEARBEITEN BUTTONS */}
                                <div style={{ marginTop: "15px" }}>
                                    {viewMode === "bewerber" && (
                                        <button
                                            onClick={() => setApplyingStelle(stelle)}
                                            style={{
                                                width: "100%",
                                                backgroundColor: "#2563eb",
                                                color: "#fff",
                                                border: "none",
                                                padding: "10px",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                fontSize: "15px",
                                            }}
                                        >
                                            📤 Jetzt Bewerben / Unterlagen hochladen
                                        </button>
                                    )}

                                    {(isLoggedIn || viewMode === "unternehmen") && (
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                                marginTop: "10px",
                                            }}
                                        >
                                            <button
                                                onClick={() => setEditingStelle(stelle)}
                                                style={{
                                                    flex: 1,
                                                    backgroundColor: "#f59e0b",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "8px",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                ✏️ Bearbeiten
                                            </button>
                                            <button
                                                onClick={() => handleDeleteJob(stelle.id)}
                                                style={{
                                                    flex: 1,
                                                    backgroundColor: "#ef4444",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "8px",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                🗑️ Löschen
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>Keine Stellenangebote für die gewählten Filter gefunden.</p>
                )}
            </main>


            {/* BEARBEITEN-MODAL (Pop-up) */}
            {editingStelle && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justify: "center",
                        alignItems: "center",
                        zIndex: 4000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "24px",
                            borderRadius: "8px",
                            maxWidth: "550px",
                            width: "90%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                        }}
                    >
                        <h2>✏️ Stelleninserat bearbeiten</h2>

                        <form
                            onSubmit={handleSaveEdit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}
                        >
                            <label>
                                <strong>Jobtitel:</strong>
                            </label>
                            <input
                                type="text"
                                required
                                value={editingStelle.titel}
                                onChange={(e) =>
                                    setEditingStelle({ ...editingStelle, titel: e.target.value })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            <label>
                                <strong>Firma:</strong>
                            </label>
                            <input
                                type="text"
                                required
                                value={editingStelle.firma}
                                onChange={(e) =>
                                    setEditingStelle({ ...editingStelle, firma: e.target.value })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            <label>
                                <strong>Anforderungen:</strong>
                            </label>
                            <textarea
                                rows="3"
                                value={editingStelle.details?.anforderung || ""}
                                onChange={(e) =>
                                    setEditingStelle({
                                        ...editingStelle,
                                        details: {
                                            ...editingStelle.details,
                                            anforderung: e.target.value,
                                        },
                                    })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            {/* STARTDATUM ALS KALENDER-PICKER */}
                            <label>
                                <strong>Startdatum:</strong>
                            </label>
                            <input
                                type="date"
                                value={editingStelle.details?.start || ""}
                                onChange={(e) =>
                                    setEditingStelle({
                                        ...editingStelle,
                                        details: {
                                            ...editingStelle.details,
                                            start: e.target.value,
                                        },
                                    })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            {/* PUBLIKATIONSDATUM ALS KALENDER-PICKER */}
                            <label>
                                <strong>Veröffentlichungsdatum:</strong>
                            </label>
                            <input
                                type="date"
                                value={editingStelle.details?.publikationsdatum || ""}
                                onChange={(e) =>
                                    setEditingStelle({
                                        ...editingStelle,
                                        details: {
                                            ...editingStelle.details,
                                            publikationsdatum: e.target.value,
                                        },
                                    })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            <label>
                                <strong>Praktikumsdauer:</strong>
                            </label>
                            <input
                                type="text"
                                value={editingStelle.details?.dauer || ""}
                                onChange={(e) =>
                                    setEditingStelle({
                                        ...editingStelle,
                                        details: {
                                            ...editingStelle.details,
                                            dauer: e.target.value,
                                        },
                                    })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            <label>
                                <strong>Distanz (in km):</strong>
                            </label>
                            <input
                                type="number"
                                value={editingStelle.details?.distanz ?? 0}
                                onChange={(e) =>
                                    setEditingStelle({
                                        ...editingStelle,
                                        details: {
                                            ...editingStelle.details,
                                            distanz: parseInt(e.target.value, 10) || 0,
                                        },
                                    })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            <label>
                                <strong>Standort:</strong>
                            </label>
                            <input
                                type="text"
                                value={editingStelle.details?.standort || ""}
                                onChange={(e) =>
                                    setEditingStelle({
                                        ...editingStelle,
                                        details: {
                                            ...editingStelle.details,
                                            standort: e.target.value,
                                        },
                                    })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            <label>
                                <strong>Vergütung:</strong>
                            </label>
                            <input
                                type="text"
                                value={editingStelle.verguetung || ""}
                                onChange={(e) =>
                                    setEditingStelle({
                                        ...editingStelle,
                                        verguetung: e.target.value,
                                    })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            <label>
                                <strong>Beschreibung:</strong>
                            </label>
                            <textarea
                                rows="4"
                                value={editingStelle.beschreibung || ""}
                                onChange={(e) =>
                                    setEditingStelle({
                                        ...editingStelle,
                                        beschreibung: e.target.value,
                                    })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            <div
                                style={{
                                    display: "flex",
                                    justify: "flex-end",
                                    gap: "10px",
                                    marginTop: "15px",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setEditingStelle(null)}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        border: "1px solid #cbd5e1",
                                        backgroundColor: "#fff",
                                        cursor: "pointer",
                                    }}
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        border: "none",
                                        backgroundColor: "#f59e0b",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                    }}
                                >
                                    Änderungen Speichern
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            {/* BEWERBUNGS-MODAL (Pop-up) */}
            {applyingStelle && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justify: "center",
                        alignItems: "center",
                        zIndex: 4000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "24px",
                            borderRadius: "8px",
                            maxWidth: "500px",
                            width: "90%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                        }}
                    >
                        <h2>
                            Bewerbung für: {applyingStelle.titel} bei {applyingStelle.firma}
                        </h2>

                        <form
                            onSubmit={handleSubmitBewerbung}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}
                        >
                            <label>
                                <strong>Vollständiger Name *</strong>
                            </label>
                            <input
                                type="text"
                                required
                                value={bewerbungForm.name}
                                onChange={(e) =>
                                    setBewerbungForm({
                                        ...bewerbungForm,
                                        name: e.target.value,
                                    })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            <label>
                                <strong>E-Mail-Adresse *</strong>
                            </label>
                            <input
                                type="email"
                                required
                                value={bewerbungForm.email}
                                onChange={(e) =>
                                    setBewerbungForm({
                                        ...bewerbungForm,
                                        email: e.target.value,
                                    })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            <label>
                                <strong>GitHub / GitLab / Portfolio Link</strong>
                            </label>
                            <input
                                type="url"
                                placeholder="https://github.com/..."
                                value={bewerbungForm.gitUrl}
                                onChange={(e) =>
                                    setBewerbungForm({
                                        ...bewerbungForm,
                                        gitUrl: e.target.value,
                                    })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            <label>
                                <strong>Nachricht an das Unternehmen</strong>
                            </label>
                            <textarea
                                rows="4"
                                value={bewerbungForm.nachricht}
                                onChange={(e) =>
                                    setBewerbungForm({
                                        ...bewerbungForm,
                                        nachricht: e.target.value,
                                    })
                                }
                                style={{
                                    padding: "8px",
                                    borderRadius: "4px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />

                            <label>
                                <strong>Lebenslauf (CV):</strong>
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileChange(e, "cvFile")}
                            />

                            <label>
                                <strong>Zeugnisse / Diplome:</strong>
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.zip"
                                onChange={(e) => handleFileChange(e, "zeugnisseFile")}
                            />

                            <label>
                                <strong>Weitere Dokumente (Portfolio etc.):</strong>
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.zip"
                                onChange={(e) => handleFileChange(e, "weitereDokus")}
                            />

                            <div
                                style={{
                                    display: "flex",
                                    justify: "flex-end",
                                    gap: "10px",
                                    marginTop: "15px",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setApplyingStelle(null)}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        border: "1px solid #cbd5e1",
                                        backgroundColor: "#fff",
                                        cursor: "pointer",
                                    }}
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        border: "none",
                                        backgroundColor: "#2563eb",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                    }}
                                >
                                    Bewerbung Absenden
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;