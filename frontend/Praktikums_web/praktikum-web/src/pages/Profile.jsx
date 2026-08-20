import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profil from "../assets/Profil.png";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getAppStatus = (app) => {
        if (!app.eingereichtAm) return app.status || 'Eingang der Bewerbung';

        const submitDate = new Date(app.eingereichtAm);
        const currentDate = new Date();

        const diffInTime = currentDate.getTime() - submitDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);

        if (diffInDays > 10 && app.status === 'Eingang der Bewerbung') {
            return 'In Bearbeitung';
        }

        return app.status || 'Eingang der Bewerbung';
    };

    useEffect(() => {
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
                setUser(data);

                const localFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
                setFavorites(localFavs);

            } catch (err) {
                setError(err.message);
                const localFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
                setFavorites(localFavs);
            } finally {
                setLoading(false);
            }
        };

        const storedApplications = JSON.parse(localStorage.getItem("bewerbungen") || "[]");
        setApplications(storedApplications);

        fetchUserData();
    }, [navigate]);


    /**
     * Favorites löschen
     * @param id
     */
    const removeFavorite = (id) => {
        const updatedFavs = favorites.filter(fav => fav.id !== id);
        setFavorites(updatedFavs);
        localStorage.setItem("favorites", JSON.stringify(updatedFavs));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) return <div className="profile-page" style={{ padding: '20px' }}>Lädt Profil...</div>;

    return (
        <div className="profile-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div className="profile-card" style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h2>Mein Profil</h2>
                    <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Abmelden
                    </button>
                </div>

                {error && <div style={{ color: '#ef4444', marginBottom: '10px' }}>{error}</div>}

                {user && (
                    <div className="user-info" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <img
                            src={Profil}
                            alt="Profilbild"
                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                            <p style={{ margin: '4px 0' }}><strong>ID:</strong> {user.id}</p>
                            <p style={{ margin: '4px 0' }}><strong>Username / E-Mail:</strong> {user["Username/E-Mail"] || user.username || user.email}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* GEMERKTE FAVORITEN */}
            <div className="favorites-section" style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '25px' }}>
                <h3>⭐ Gemerkte Praktikumsstellen ({favorites.length})</h3>
                {favorites.length === 0 ? (
                    <p style={{ color: '#64748b' }}>Du hast dir noch keine Stellen gemerkt.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                        {favorites.map((fav) => (
                            <div key={fav.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                                <div>
                                    <strong style={{ fontSize: '16px' }}>{fav.titel}</strong>
                                    <p style={{ margin: '4px 0 0 0', color: '#475569', fontSize: '14px' }}>
                                        {fav.firma} • {fav.details?.standort || 'Standort k.A.'} • {fav.verguetung}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeFavorite(fav.id)}
                                    style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Entfernen
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="applications-section" style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <h3>📄 Meine Bewerbungen ({applications.length})</h3>
                {applications.length === 0 ? (
                    <p style={{ color: '#64748b' }}>Noch keine Bewerbungen eingereicht.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                        {applications.map((app, index) => {
                            // Zeitberechnung seit der Bewerbung
                            const bewerbungsZeitpunkt = app.id || Date.now();
                            const verringerteZeit = Date.now() - bewerbungsZeitpunkt;
                            const istAbsage = app.status === 'absage';
                            const vierStundenInMs = 4 * 60 * 60 * 1000;
                            const vierUndZwanzigStundenInMs = 24 * 60 * 60 * 1000;

                            // Zustände prüfen
                            const istEingeladen = app.status === 'eingeladen' || verringerteZeit > vierUndZwanzigStundenInMs;
                            const istAngeschaut = verringerteZeit > vierStundenInMs;


                            // Farbe & Text dynamisch bestimmen
                            let statusText = '⏳ In Bearbeitung';
                            let bgColor = '#fef9c3'; // Gelb
                            let textColor = '#a16207';

                            if (istEingeladen) {
                                statusText = '🎉 Zum Gespräch eingeladen';
                                bgColor = '#dbeafe'; // Blau
                                textColor = '#1e40af';
                            } else if (istAngeschaut) {
                                statusText = '👀 Bewerbung angeschaut';
                                bgColor = '#dcfce7'; // Grün
                                textColor = '#15803d';
                            }


                            else if(istAbsage){
                                statusText = 'Absage'
                                bgColor = "#eb5b34"
                                textColor="#eb5b34"

                            }

                            return (
                                <div key={app.id || index} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                                    <strong style={{ fontSize: '16px', color: '#1e293b' }}>
                                        {app.titel || app.stelleTitel || 'Unbenannte Praktikumsstelle'}
                                    </strong>
                                    <p style={{ margin: '4px 0 8px 0', fontSize: '14px', color: '#475569' }}>
                                        <strong>Firma:</strong> {app.firma || 'Keine Angabe'}
                                    </p>

                                    <span
                                        style={{
                                            display: 'inline-block',
                                            backgroundColor: bgColor,
                                            color: textColor,
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Status: {statusText}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;

