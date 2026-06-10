import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './components/style/style.css'; // Pfad bei Bedarf anpassen

function Home() {
    const [selectedBeruf, setSelectedBeruf] = useState('');
    return (
        <div className="home-container">
            {/* Header-Bild */}
            <div className="header-image-container">
                <img
                    src=""
                    alt="Team Working"
                    className="header-banner"
                />
            </div>

            <header className="home-header">
                <h1>Aktuelle Stelleninserate</h1>
            </header>

            {/* Filter-Bereich */}
            <div className="filter-section">
                <label htmlFor="beruf-select">IT-beruf auswählen: </label>
                <select
                    name="beruf"
                    id="beruf-select"
                    value={selectedBeruf}
                    onChange={(e) => setSelectedBeruf(e.target.value)}
                >
                    <option value="">-- Alle Berufe --</option>
                    <option value="applikationsentwicklung">Informatiker EFZ Applikationsentwicklung</option>
                    <option value="plattformentwicklung">Informatiker EFZ Plattformentwicklung</option>
                    <option value={"applikationsentwicklung"}>Informatiker EFZ Applikationsentwicklung </option>
                    <option value="fachmann">ICT-Fachmann/Fachfrau</option>
                </select>
            </div>

            {/* Hier kommen deine Stelleninserate hin */}
            <main className="job-list">
                {/* Die Job-Karten können hier wie gewohnt ausgegeben werden */}
            </main>
        </div>
    );
}

export default Home;