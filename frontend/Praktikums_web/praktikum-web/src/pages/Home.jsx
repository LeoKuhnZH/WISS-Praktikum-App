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
        gitlabUrl: "",
        linkedIn: "",
        nachricht: "",
        cvFile: null,
        telefon: "",
        zeugnisseFile: null,
        weitereDokus: null,
    });



    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatFile, setChatFile] = useState(null);
    const [chatPreviewUrl, setChatPreviewUrl] = useState(null);
    const [chatInput, setChatInput] = useState("");
    const chatFileInputRef = useRef(null);
    const chatEndRef = useRef(null);
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hallo! 👋 Ich bin dein persönlicher KI-Assistent Superchat. Lade gerne deinen CV hoch oder stelle mir Fragen zu Praktika!",
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

        // 1. Abbrechen, wenn weder Text noch Datei vorhanden ist
        if (!chatInput.trim() && !chatFile) return;

        // 2. Werte sichern
        const userMsg = chatInput.trim();
        const attachedFile = chatFile;
        const attachedPreview = chatPreviewUrl;
        let contextMessage = userMsg;
        // 3. Kontext aufbauen (Sicherer Zugriff: Verwendet applyingStelle oder stellt Fallback bereit)

        if (!contextMessage && attachedFile) {
            contextMessage= `Bitte analysiere die angehängte Datei (${attachedFile.name}) und gib mir eine Zusammenfassung oder relevante Informationen dazu.`;
        }

        const aktuelleStelle = applyingStelle || editingStelle;
        if (aktuelleStelle && aktuelleStelle.titel) {
            contextMessage = `[Frage zu Stelle: "${aktuelleStelle.titel}" bei "${aktuelleStelle.firma || ''}"]\n\n${contextMessage}`;
        }
        // 4. Nachricht LOKAL im UI anzeigen
        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: userMsg||`Datei:${attachedFile.name}`,
                fileName: attachedFile ? attachedFile.name : null,
                filePreview: attachedPreview,
            },
        ]);

        setChatInput("");
        if (typeof handleRemoveChatFile === "function") {
            handleRemoveChatFile();
        }

        // Basis-URL zentral (oder z.B. nur "/api/chat" falls Proxy aktiv)
        const API_BASE_URL = "http://localhost:8080";

        // 6. Request an Backend senden
        try {
            let response;

            if (attachedFile) {
                // MULTIPART / FILE UPLOAD
                const formData = new FormData();
                formData.append("message", contextMessage);
                formData.append("file", attachedFile);

                response = await fetch(`${API_BASE_URL}/api/chat/${sessionId}/upload`, {
                    method: "POST",
                    body: formData, // Kein Header "Content-Type" angeben, macht der Browser automatisch
                });
            } else {
                // REINER TEXT (JSON)
                response = await fetch(`${API_BASE_URL}/api/chat/${sessionId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: contextMessage }),
                });
            }

            if (!response.ok) {
                throw new Error(`Server-Fehler: ${response.status}`);
            }

            // 7. Antwort erhalten und dem Verlauf hinzufügen
            const botReply = await response.text();
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: botReply },
            ]);

        } catch (error) {
            console.error("Chatbot-Fehler:", error);
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

    // --- FAVORITEN / GEMERKT STATE ---
    const [favorites, setFavorites] = useState([]);

    const [sessionId] = useState(() => "session-" + Math.random().toString(36).substring(2, 9));

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
            gitlabUrl: "",
            linkedIn: "",
            nachricht: "",
            cvFile: null,
            telefon: "",
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
                        👨‍🎓 Für Bewerber
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
                        🏢 Für Unternehmen ({bewerbungen.length} Bewerbungen)
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

                            <option value="plattformentwicklung_wayup">Informatiker in Plattformentwicklung(Way-up)</option>
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
                            onChange={(e) => setSelectedStartdatum(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">-- Jedes Startdatum --</option>
                            <option value="August 2026">August 2026</option>
                            <option value="August 2027">August 2027</option>
                            <option value="Per sofort(As Soon as Possible)">Per sofort</option>
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
                            <option value="tag">Vor 1 Tag</option>
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
                                            flexWrap: "wrap",
                                            gap: "10px",
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

                                    <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f8fafc", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                                        <strong>Telefonnummer / Natel:</strong>
                                        {b.telefon ? (
                                            <p style={{ margin: "3px 0 0 0" }}>
                                                <a
                                                    href={`tel:${b.telefon}`}
                                                    style={{ color: "#0284c7", textDecoration: "underline", fontWeight: "bold" }}
                                                >
                                                    📞 {b.telefon}
                                                </a>
                                            </p>
                                        ) : (
                                            <p style={{ margin: "3px 0 0 0", color: "#888", fontStyle: "italic" }}>
                                                Keine Telefonnummer angegeben
                                            </p>
                                        )}
                                    </div>

                                    <div style={{ marginTop: "8px", padding: "8px", backgroundColor: "#f8fafc", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                                        <strong>LinkedIn-Profil URL:</strong>
                                        {b.linkedIn ? (
                                            <p style={{ margin: "3px 0 0 0", wordBreak: "break-all" }}>
                                                <a href={b.linkedIn} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                                                    🔗 {b.linkedIn}
                                                </a>
                                            </p>
                                        ) : (
                                            <p style={{ margin: "3px 0 0 0", color: "#888", fontStyle: "italic" }}>
                                                Kein LinkedIn-Profil angegeben
                                            </p>
                                        )}
                                    </div>

                                    <div style={{ marginTop: "8px", padding: "8px", backgroundColor: "#f8fafc", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                                        <strong>GitHub-Profil URL:</strong>
                                        {b.githubUrl || b.gitUrl ? (
                                            <p style={{ margin: "3px 0 0 0", wordBreak: "break-all" }}>
                                                <a href={b.githubUrl || b.gitUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                                                    💻 {b.githubUrl || b.gitUrl}
                                                </a>
                                            </p>
                                        ) : (
                                            <p style={{ margin: "3px 0 0 0", color: "#888", fontStyle: "italic" }}>
                                                Kein GitHub-Profil angegeben
                                            </p>
                                        )}
                                    </div>

                                    <div style={{ marginTop: "8px", padding: "8px", backgroundColor: "#f8fafc", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                                        <strong>GitLab-Profil URL:</strong>
                                        {b.gitlabUrl ? (
                                            <p style={{ margin: "3px 0 0 0", wordBreak: "break-all" }}>
                                                <a href={b.gitlabUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                                                    🦊 {b.gitlabUrl}
                                                </a>
                                            </p>
                                        ) : (
                                            <p style={{ margin: "3px 0 0 0", color: "#888", fontStyle: "italic" }}>
                                                Kein GitLab-Profil angegeben
                                            </p>
                                        )}
                                    </div>

                                    {b.nachricht && (
                                        <div style={{ marginTop: "8px", padding: "8px", backgroundColor: "#f8fafc", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                                            <strong>Nachricht:</strong>
                                            <p style={{ margin: "3px 0 0 0" }}>{b.nachricht}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* KARTEN-LISTE BEREICH */}
            <h2>Praktikumsstellen ({gefiltertePraktikas.length})</h2>
            {loading ? (
                <p>Lade Inserate...</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                    {gefiltertePraktikas.map((stelle) => {
                        const isFav = favorites.some((fav) => fav.id === stelle.id);
                        return (
                            <div
                                key={stelle.id}
                                style={{
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "8px",
                                    padding: "16px",
                                    backgroundColor: "#fff",
                                    display: "flex",
                                    flexDirection: "column",
                                    justify: "space-between",
                                }}
                            >
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h3 style={{ margin: "0 0 8px 0" }}>{stelle.titel}</h3>
                                        <button
                                            onClick={() => toggleFavorite(stelle)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                fontSize: "20px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {isFav ? "❤️" : "🤍"}
                                        </button>
                                    </div>
                                    <p style={{ color: "#64748b", margin: "0 0 12px 0", fontWeight: "bold" }}>
                                        {stelle.firma}
                                    </p>
                                    <p style={{ fontSize: "14px", margin: "0 0 8px 0" }}>
                                        <strong>Ort:</strong> {stelle.details?.standort}
                                    </p>
                                    <p style={{ fontSize: "14px", margin: "0 0 8px 0" }}>
                                        <strong>Start:</strong> {stelle.details?.start}
                                    </p>
                                    <p style={{ fontSize: "14px", margin: "0 0 12px 0" }}>
                                        <strong>Lohn:</strong> {stelle.verguetung}
                                    </p>
                                    <p style={{ fontSize: "14px", color: "#334155" }}>{stelle.beschreibung}</p>
                                </div>

                                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                                    {viewMode === "bewerber" ? (
                                        <button
                                            onClick={() => setApplyingStelle(stelle)}
                                            style={{
                                                flex: 1,
                                                padding: "8px",
                                                backgroundColor: "#2563eb",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Jetzt bewerben
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setEditingStelle(stelle)}
                                                style={{
                                                    flex: 1,
                                                    padding: "8px",
                                                    backgroundColor: "#f59e0b",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Bearbeiten
                                            </button>
                                            <button
                                                onClick={() => handleDeleteJob(stelle.id)}
                                                style={{
                                                    padding: "8px",
                                                    backgroundColor: "#ef4444",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Löschen
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* EDIT MODAL */}
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
                        justifyContent: "center",
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
                        <h2>Inserat bearbeiten</h2>
                        <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <label><strong>Titel:</strong></label>
                            <input
                                type="text"
                                required
                                value={editingStelle.titel}
                                onChange={(e) => setEditingStelle({ ...editingStelle, titel: e.target.value })}
                                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label><strong>Firma:</strong></label>
                            <input
                                type="text"
                                required
                                value={editingStelle.firma}
                                onChange={(e) => setEditingStelle({ ...editingStelle, firma: e.target.value })}
                                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label><strong>Anforderungen:</strong></label>
                            <textarea
                                rows="3"
                                value={editingStelle.details?.anforderung || ""}
                                onChange={(e) =>
                                    setEditingStelle({
                                        ...editingStelle,
                                        details: { ...editingStelle.details, anforderung: e.target.value },
                                    })
                                }
                                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label><strong>Startdatum:</strong></label>
                            <input
                                type="date"
                                value={editingStelle.details?.start || ""}
                                onChange={(e) =>
                                    setEditingStelle({
                                        ...editingStelle,
                                        details: { ...editingStelle.details, start: e.target.value },
                                    })
                                }
                                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label><strong>Veröffentlichungsdatum:</strong></label>
                            <input
                                type="date"
                                value={editingStelle.details?.publikationsdatum || ""}
                                onChange={(e) =>
                                    setEditingStelle({
                                        ...editingStelle,
                                        details: { ...editingStelle.details, publikationsdatum: e.target.value },
                                    })
                                }
                                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label><strong>Praktikumsdauer:</strong></label>
                            <input
                                type="number"
                                value={editingStelle.details?.dauer || ""}
                                onChange={(e) =>
                                    setEditingStelle({
                                        ...editingStelle,
                                        details: { ...editingStelle.details, dauer: e.target.value },
                                    })
                                }
                                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label><strong>Distanz (in km):</strong></label>
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
                                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label><strong>Standort:</strong></label>
                            <input
                                type="text"
                                placeholder={"Z.B Glattbrug"}
                                required
                                value={editingStelle.details?.standort || ""}
                                onChange={(e) =>
                                    setEditingStelle({
                                        ...editingStelle,
                                        details: { ...editingStelle.details, standort: e.target.value },
                                    })
                                }
                                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label><strong>Vergütung:</strong></label>
                            <input
                                type="text"
                                value={editingStelle.verguetung || ""}
                                onChange={(e) => setEditingStelle({ ...editingStelle, verguetung: e.target.value })}
                                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label><strong>Beschreibung:</strong></label>
                            <textarea
                                rows="4"
                                required
                                value={editingStelle.beschreibung || ""}
                                onChange={(e) => setEditingStelle({ ...editingStelle, beschreibung: e.target.value })}
                                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
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



            {/* --- FLOATING KI CHATBOT (SUPERCHAT) --- */}


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
                            <label><strong>Vollständiger Name *</strong></label>
                            <input
                                type="text"
                                required
                                placeholder="Vincent"
                                value={bewerbungForm.name}
                                onChange={(e) =>
                                    setBewerbungForm({ ...bewerbungForm, name: e.target.value })
                                }
                                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label><strong>E-Mail-Adresse *</strong></label>
                            <input
                                type="email"
                                required
                                placeholder="elias.kaiser@gmx.net"
                                value={bewerbungForm.email}
                                onChange={(e) =>
                                    setBewerbungForm({ ...bewerbungForm, email: e.target.value })
                                }
                                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label><strong>GitHub</strong></label>
                            <input
                                type="url"
                                required
                                placeholder="https://github.com/..."
                                value={bewerbungForm.gitUrl}
                                onChange={(e) =>
                                    setBewerbungForm({ ...bewerbungForm, gitUrl: e.target.value })
                                }
                                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label style={{ fontWeight: "bold", display: "block", marginTop: "10px", marginBottom: "4px" }}>
                                <strong>GitLab-Profil:</strong>
                            </label>
                            <input
                                type="url"
                                placeholder="https://gitlab.com/username"
                                value={bewerbungForm.gitlabUrl || ""}
                                onChange={(e) =>
                                    setBewerbungForm({ ...bewerbungForm, gitlabUrl: e.target.value })
                                }
                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label style={{ fontWeight: "bold", display: "block", marginTop: "10px", marginBottom: "4px" }}>
                                <strong>LinkedIn-Account:</strong>
                            </label>
                            <input
                                type="url"
                                required
                                placeholder="https://linkedin.com/in/username"
                                value={bewerbungForm.linkedIn || ""}
                                onChange={(e) =>
                                    setBewerbungForm({ ...bewerbungForm, linkedIn: e.target.value })
                                }
                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />
                            <label style={{ fontWeight: "bold", display: "block", marginTop: "10px", marginBottom: "4px" }}>
                                <strong>Telefonnummer / Natel:*</strong>
                            </label>
                            <input
                                type="number"
                                required
                                placeholder="+41 79 123 45 67"
                                value={bewerbungForm.telefon || ""}
                                onChange={(e) =>
                                    setBewerbungForm({ ...bewerbungForm, telefon: e.target.value })
                                }
                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label style={{ fontWeight: "bold", display: "block", marginTop: "10px", marginBottom: "4px" }}>
                                <strong>Nachricht an das Unternehmen:</strong>
                            </label>
                            <textarea
                                rows="4"
                                value={bewerbungForm.nachricht || ""}
                                onChange={(e) =>
                                    setBewerbungForm({ ...bewerbungForm, nachricht: e.target.value })
                                }
                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                            />

                            <label style={{ fontWeight: "bold", display: "block", marginTop: "10px", marginBottom: "4px" }}>
                                <strong>Lebenslauf (CV):</strong>
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileChange(e, "cvFile")}
                            />

                            <label style={{ fontWeight: "bold", display: "block", marginTop: "10px", marginBottom: "4px" }}>
                                <strong>Zeugnisse / Diplome:</strong>
                            </label>
                            <input
                                type="file"
                                accept=".docx,.pdf,.zip"
                                onChange={(e) => handleFileChange(e, "zeugnisseFile")}
                            />

                            <label style={{ fontWeight: "bold", display: "block", marginTop: "10px", marginBottom: "4px" }}>
                                <strong>Weitere Dokumente (Portfolio etc.):</strong>
                            </label>
                            <input
                                type="file"
                                accept=".docx,.pdf,.zip"
                                onChange={(e) => handleFileChange(e, "weitereDokus")}
                            />

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
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

            {/* 4. FLOATING KI-CHAT WIDGET (Jetzt innerhalb des Haupt-Divs) */}
            <div style={{ position: "fixed", bottom: "25px", right: "25px", zIndex: 1000 }}>
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
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        💬 KI-Superchat
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
                        {/* Chat Header */}
                        <div
                            style={{
                                backgroundColor: "#2563eb",
                                color: "#fff",
                                padding: "12px 16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <strong style={{ fontSize: "16px" }}>🤖 KI-Superchat</strong>
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
                                ✕
                            </button>
                        </div>

                        {/* Chat Nachrichtenverlauf */}
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
                            {messages?.map((m, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                                        maxWidth: "80%",
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: m.sender === "user" ? "#2563eb" : "#e2e8f0",
                                            color: m.sender === "user" ? "#fff" : "#000",
                                            padding: "10px 14px",
                                            borderRadius: "12px",
                                            fontSize: "14px",
                                        }}
                                    >
                                        {m.text}
                                        {m.fileName && (
                                            <div
                                                style={{
                                                    marginTop: "6px",
                                                    fontSize: "12px",
                                                    opacity: 0.9,
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                📎 Datei: {m.fileName}
                                            </div>
                                        )}
                                        {m.filePreview && (
                                            <img
                                                src={m.filePreview}
                                                alt="Preview"
                                                style={{ width: "100%", borderRadius: "6px", marginTop: "6px" }}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Vorschau der angehängten Datei */}
                        {chatFile && (
                            <div
                                style={{
                                    padding: "6px 12px",
                                    backgroundColor: "#e0f2fe",
                                    display: "flex",
                                    justify: "space-between",
                                    alignItems: "center",
                                    fontSize: "13px",
                                }}
                            >
                                <span>📄 {chatFile.name}</span>
                                <button
                                    onClick={handleRemoveChatFile}
                                    style={{
                                        border: "none",
                                        background: "none",
                                        color: "#ef4444",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Chat Input Formular */}
                        <form
                            onSubmit={handleSendMessage}
                            style={{
                                padding: "10px",
                                display: "flex",
                                gap: "6px",
                                borderTop: "1px solid #e2e8f0",
                                backgroundColor: "#fff",
                            }}
                        >
                            <input
                                type="file"
                                ref={chatFileInputRef}
                                onChange={handleChatFileChange}
                                style={{ display: "none" }}
                            />
                            <button
                                type="button"
                                onClick={() => chatFileInputRef.current?.click()}
                                style={{
                                    backgroundColor: "#f1f5f9",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "6px",
                                    padding: "8px",
                                    cursor: "pointer",
                                }}
                                title="CV oder Dokument anhängen"
                            >
                                📎
                            </button>
                            <input
                                type="text"
                                placeholder="Frage stellen oder CV senden..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "14px",
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: "#2563eb",
                                    color: "#fff",
                                    border: "none",
                                    padding: "8px 14px",
                                    borderRadius: "6px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                Send
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
