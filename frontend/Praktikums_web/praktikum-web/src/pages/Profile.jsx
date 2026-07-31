import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Profil from "../assets/Profil.jpg";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Hilfsfunktion: Prüft, ob seit der Einreichung mehr als 10 Tage vergangen sind
    const getAppStatus = (app) => {
        if (!app.eingereichtAm) return app.status || 'Eingang der Bewerbung';

        const submitDate = new Date(app.eingereichtAm);
        const currentDate = new Date();

        // Differenz in Tagen berechnen
        const diffInTime = currentDate.getTime() - submitDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);

        // Nach 10 Tagen von "Eingang der Bewerbung" auf "In Bearbeitung" wechseln
        if (diffInDays > 10 && app.status === 'Eingang der Bewerbung') {
            return 'In Bearbeitung';
        }

        return app.status || 'Eingang der Bewerbung';
    };

    useEffect(() => {
        // Token aus Speicher holen
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("Fehler beim Laden des Profils");

                const data = await res.json();
                setUser(data.user || data);

                // Falls das Backend Favoriten liefert, nutzen; sonst Fallback aus LocalStorage
                if (data.favorites && data.favorites.length > 0) {
                    setFavorites(data.favorites);
                } else {
                    const localFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
                    setFavorites(localFavs);
                }
            } catch (err) {
                setError(err.message);
                // Fallback bei Fehler: Lokale Favoriten trotzdem laden
                const localFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
                setFavorites(localFavs);
            } finally {
                setLoading(false);
            }
        };

        // Eingereichte Bewerbungen aus LocalStorage laden
        const storedApplications = JSON.parse(localStorage.getItem("bewerbungen") || "[]");
        setApplications(storedApplications);

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) return <div className="profile-page">Lädt Profil...</div>;

    return (
        <div className="profile-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div className="profile-card" style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <h2>Mein Profil</h2>

                {error && <div style={{ color: '#ef4444', marginBottom: '10px' }}>{error}</div>}

                {/* Benutzer-Informationen */}
                {user && (
                    <div className="user-info" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                        <img src={Profil} alt="Profilbild" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                            <p style={{ margin: '4px 0' }}><strong>UserId:</strong> {user.id}</p>
                            <p style={{ margin: '4px 0' }}><strong>Benutzername:</strong> {user.username}</p>
                            <p style={{ margin: '4px 0' }}><strong>E-Mail:</strong> {user.email}</p>
                        </div>
                    </div>
                )}

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

                {/* ABSCHNITT: EINGEREICHTE BEWERBUNGEN & STATUS */}
                <h3>Meine Bewerbungen ({applications.length})</h3>

                {applications.length === 0 ? (
                    <p style={{ color: '#64748b' }}>Du hast noch keine Bewerbungen eingereicht.</p>
                ) : (
                    <div className="applications-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
                        {applications.map((app) => {
                            const currentStatus = getAppStatus(app);
                            const isEingang = currentStatus === 'Eingang der Bewerbung';
                            const rawAnforderungen = app.anforderungen || app.anf ||app.requirements;
                            const displayAnforderungen = Array.isArray(rawAnforderungen)
                                ? rawAnforderungen.join(", ")
                                : rawAnforderungen;

                            return (
                                <div
                                    key={app.id}
                                    style={{
                                        padding: '15px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        backgroundColor: '#f8fafc',
                                        display: 'flex',
                                        justify: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '10px'
                                    }}
                                >
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>{app.jobTitel}</h4>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>
                                            <strong>Firma:</strong> {app.firmaName}
                                        </p>
                                        <p style={{ margin: '4px 0', fontSize: '14px', color: '#475569' }}>
                                            <strong>Praktikumsstart:</strong> {app.startDate || 'August 2027'}
                                        </p>

                                        {displayAnforderungen && (
                                            <p style={{ margin: '4px 0', fontSize: '13px', color: '#334155' }}>
                                                <strong>Anforderungen:</strong> {displayAnforderungen}
                                            </p>
                                        )}



                                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                                            Eingereicht am: {new Date(app.eingereichtAm).toLocaleDateString()}
                                        </p>


                                    </div>

                                    <div>
                                        <span style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            backgroundColor: isEingang ? '#e0f2fe' : '#dcfce7',
                                            color: isEingang ? '#0369a1' : '#15803d',
                                            border: '1px solid ' + (isEingang ? '#bae6fd' : '#bbf7d0')
                                        }}>
                                            Status: {currentStatus}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

                {/* GELIKTE / GESPEICHERTE PRAKTIKUMSSTELLEN */}
                <h3>Meine Favoriten ({favorites.length})</h3>

                {favorites.length === 0 ? (
                    <p style={{ color: '#64748b' }}>Du hast noch keine Praktikumsstellen gelikt.</p>
                ) : (
                    <ul className="favorites-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {favorites.map((item, index) => {
                            const isObject = typeof item === 'object' && item !== null;
                            const itemId = isObject ? item.id : item;
                            const title = isObject ? (item.titel || item.title || item.name) : `Favorit ID: ${item}`;
                            const firma = isObject ? (item.firma || item.company) : '';
                            const standort = isObject ? (item.details?.standort || item.location) : '';

                            return (
                                <li key={itemId || index} className="favorite-item" style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff' }}>
                                    <h4 style={{ margin: '0 0 4px 0' }}>{title}</h4>
                                    {firma && <p style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#475569' }}><strong>{firma}</strong> {standort ? `– ${standort}` : ''}</p>}
                                    <Link to={`/api/posting/search/id/${itemId}`} style={{ color: '#0284c7', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>Details ansehen →</Link>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <div style={{ marginTop: '30px' }}>
                    <button onClick={handleLogout} className="logout-btn" style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Abmelden
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;