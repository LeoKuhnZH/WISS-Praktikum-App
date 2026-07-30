# 🚀 ICT_Stellenportal WISS Connect  für  WISS Praktikanten 

Eine moderne Fullstack-Webapplikation zur effizienten Vermittlung und Verwaltung von Informatik-Praktikumsstellen. Die Webapp unterstützt WISS-Studenten bei der Suche nach Praktika, der  Verwaltung und dem Hinzufügen von neuen Inseraten. Für Unternehmen gibt es eine eigene Ansicht zur Entgegennahme und Verwaltung von Bewerbungen sowie ein persönliches Bewerber-Dashboard, welches die Favoritenstellen mit dem jeweiligen Bewerbungsstatus nach dem Login anzeigt. Um den Datenschutz der Bewerber zu gewährleisten, ist ein Privacy Banner mit integrierten AGBs eingebunden.
---

## 📌 Hauptfunktionen (Key Features)

### 👨‍🎓 Für Schülerinnen, Schüler & Praktikanten
* **Praktikumsstellen anzeigen & filtern:** Übersichtliche Darstellung aller offenen Praktikumsplätze mit Such- und Filterfunktionen nach Standort, Lohn etc.
* **Favoritenliste:** Spannende Stellenangebote schnell auf einer persönlichen Merkliste speichern.
* **Bewerbungssystem:** Direktes Einreichen und Verwalten von Bewerbungsunterlagen über 
* **Praktikanten-Profil:** Erstellung eines eigenen Profils inklusive Login und Einsicht in die persönlichen Profilinformationen, dem Status der Bewerbungsunterlagen
* **Unternehmen in der Nähe:** Karten- bzw. Umkreisansicht für regionale Ausbildungsbetriebe.

### 🏢 Für Betriebe & Schulen
* **Stellenverwaltung (CRUD):** Erstellung neuer Angebote sowie Bearbeiten und Löschen veralteter Einträge.
* **Verwaltungsoberfläche:** Übersichtliche Administration von Stellen und Bewerbungseingängen.

### 🔒 Datenschutz & Compliance
* **Datenschutz & AGB-Banner:** Integriertes Banner zur Einholung von Einwilligungen und zur Gewährleistung der Datenschutzrichtlinien mittels Datenschutzerklärung
* **Konforme Datenverarbeitung:** Sicherer Umgang mit personenbezogenen Daten und Bewerbungsunterlagen(DSG +DSGVO)

### 🛡️ Sicherheitsarchitektur
* **Protected Routes:** Schutz vor geschützten Pages  im Frontend vor unbefugtem Zugriff  nur für ADMIN zugreifbar
* **Role-Based Access Control (RBAC):** Strenge Berechtigungstrennung für Schüler, Praktikumbetrieben(Schulen) und dem Root(Admin)
* **Zero-Trust-Prinzip:** Jede Anfrage wird sowohl im Frontend als auch auf Backend-Ebene durchgehend authentifiziert und autorisiert

---

## 🛠 Tech Stack

### Frontend
* **Framework / Library:** [React](https://react.dev/) 
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Routing & Security:** React Router (mit Protected Routes & RBAC-State)

### Backend
* **Sprache / Framework:** Java (Servlet API / Spring Boot) und der Authentifizierungs via Spring Security
* Build-Tool:** Maven
* **Application Server:** [Apache Tomcat](https://tomcat.apache.org/) mit Hibewrnateserverlet Webserver
* **Datenbank:** Relationale Datenbank (MySQL 8.4 via Docker Container)


## 🐳 Docker & Datenbank-Setup

### 🔍 Erklärung der Docker-Container "praktikum-mysql"  Konfiguration

* **Image & Container-Name (`mysql:8.4` / `praktikum-mysql`):** Nutzt das offizielle MySQL 8.4 Image und weist dem Container einen eindeutigen Namen zur einfachen Steuerung zu.
* **Port-Mapping (`3306:3306`):** Leitet den internen MySQL-Port auf den Port `3306` deines Host-Rechners weiter (Expose nach außen). Dadurch können sowohl das Spring Boot Backend als auch externe Tools (z. B. DBeaver, DataGrip, MySQL Workbench) über `localhost:3306` auf die Datenbank zugreifen.
* **Umgebungsvariablen (`environment`):**
  * `MYSQL_DATABASE`: Erstellt beim Container-Start automatisch die Datenbank `praktikum_db`.
  * `MYSQL_USER` & `MYSQL_PASSWORD`: Richtet den Anwendungs-Benutzer (`praktikum` / `praktikum`) für das Backend ein.
  * `MYSQL_ROOT_PASSWORD`: Legt das Admin-Passwort (`root`) für volle Datenbankrechte fest.
* **Daten-Persistenz (`volumes: praktikum_mysql_data`):** Speichert die MySQL-Daten außerhalb des Containers im Docker-Volume. So bleiben erstelle Tabellen und Testdaten auch nach einem Container-Neustart (`docker compose down`) vollständig erhalten.
---
## 🚀 Installationsanleitung

### Voraussetzungen2. Datenbank (MySQL) mit Docker starten
Bevor das Backend gestartet wird, muss der Container "praktikum-mysql" deployed sein, um die DB mit den Stelleninseraten  und Usern  zu initalisieren

* **Node.js** (v18+)
* **Java JDK** (v17+)
* **Docker & Docker Compose**
* **Apache Tomcat** (v10+)
* **Git**
* **React** Packages installiert (React-Router-Dom Libarys installiert)

---

### 1. Repository klonen


git clone [https://github.com/dein-user/praktikums-plattform.git](https://github.com/dein-user/praktikums-plattform.git)
cd praktikums-plattform





 ### 2. Docker-Container starten
Führe die Befehle im Root-Verzeichnis des Projekts aus:


 2.1Container im Hintergrund starten
docker compose up -d

 2.2Container stoppen (falls nötig)
docker compose down
2.2 Verbindungsdaten für das Spring Boot Backend
JDBC URL: jdbc:mysql://localhost:3306/praktikum_db

Benutzer: praktikum

Passwort: praktikum

Root-Passwort: root

### 3. Backend starten
Backend-Projekt in der Java-IDE (z. B. IntelliJ IDEA) öffnen im Rootverzeichnis  öffnen C:\Users\elias\WISS-Praktikum-App\backend> 


Maven- oder Gradle-Dependencies auflösen lassen.

Apache Tomcat Server in der IDE konfigurieren und das Artefakt (.war) erstellen.

 Tomcatserver starten:
 $ mvn spring-boot:run
 — die Java-API mit Backend der Fullstackapp  ist anschließend unter http://localhost:8080/api erreichbar 

### 4. Frontend starten
4.1 In das Frontend-Rootverzeichnis wechseln==> Users\elias\WISS-Praktikum-App\frontend\Praktikums_web\praktikum-web>

4.2
  cd frontend
 cd Praktikums_web/praktikum-web
4.3 Packages (inkl. react-router-dom) installieren

npm install(Bei jedem Deployment neue Dependencies installieren)
4.4 Viteserver  starten 

npm run dev

Link zu Trello mit Sprints und Product Backlog: 

https://trello.com/w/wissoneshot/home  

## Sprint 1:

 Review :
Gezeigt haben wir das add Job das in der theorie funktionieren sollte
Vite Projekt erstellt
Boiler Plate erstellt
Navigation Bar ohne Protected Root
Frontend auf Port 5173 deployed
Registrierungsseite
Login Formular
Routing der Komonennten und Navigationsleiste
Backend läuft auf Port 8080




Retrospektive:
Gut:
Planung des Projekts, Ideenfindung
Delegation der Aufgaben je nach Stärke und Präferenz
Effiziente Arbeit bei einigen Teammitgliedern



 Nicht so gut:
Technische Komplikationen
keine Testbranches für Testumgebung keine Branchingstrategie verwendet(Dev Branch vs. Testbranch)
Verwirrung bei Git Merges und Merge-Konflikten durch
teils unklare Team-Kommunikation (Zuständigkeiten, Abstimmung zwischen Teams)
Nicht immer neue Features hinzufügen nur die vom Sprint 1 und nicht mit sprint 2 anfangen
Zu wenig Refacotring unnötige Klassenbezeichnunge für das Styling

Verbesserungsvorschläge:
Bessere Kommunikation untereinander
damit Arbeit aufeinander abgestimmt ist, die Software besser funktioniert und  weniger Frustration aufkommt
Behebung technischer Probleme (Hardware Dominik)
Einsteiger besser schulen
Git-Commit schulung über Vs Studio code (tutorials online suchen)
Refactoring der Codebase im Frontend mit Klassen 
Für jede Styling jeweils eine einzelne Styling Klasse hinzufügen	 

## Sprint 2

Review:
Neue Features: Bei jeder Page ein einheitliches Layout
Testing der wichtigsten Komponenten(Homescreen und Login)
Suchleiste erstellen neben Navbar für SEO
schöneres Design für Icon  bei URL hinzufügen (Runder Icon) an Navbar   anheften
Page um Ansicht der Firma darzustellen mit Login und ForgotPassword implementieren
Icon Grösse muss  verkleinert werden und muss an Navbar angeheftet werden nicht im Header
Refactoring für jede Klasse bei jedem Styling(Styles.css) einzeln  in         Div-Containern
Forgot-Password Page  um Link zurückzusetzen bei Login-Screen Verlinkung anstatt eigene Page

	
Retrospektive:
Wichtigste Funktionalitäten wie Anzeige der Praktikumsplätze Beschränken(Login,GET-Methode und POST-Methode) beschränkt
Protected Route implementiert  um geschützte Seiten für Role based Access Control (RBAC)
Styling der einzelnen Card-Grids verbessern mit Hover-Effekt und besserem Styling 
Page für Unternehmenssicht erstellen
Lokaler Branch origin dev löschen(origin dev) 
Neue Page um ehemalige Praktikanten aufzuteilen(Home-Komponente) mit Stellenportal
Was lief schlecht?
Backend mit HTTP-Methoden nicht vorhanden nur im Frontend möglich
Login kann nicht simuliert werden da Backend keine  Testdaten in DB vorhanden ist
Unklarheiten ob neue Features  implementiert werden müssen oder zuerst        Protected Route implementiert werden muss
Login und Home-Screen verschiedene Styling der Pages 

Verbesserungsvorschläge:
Bei ForgotPassword und Login ein Show-Password Button hinzufügen um Passwort anzeigen zu können
Echtzeitüberprüfung der Firma bei Praktikum hinzufügen mit Filter 
Portfolio für Praktikant mit Job Favorites setzen
Protected-Route für Zero-Trust-Prinzip hinzufügen mit Admin
Styling der Homepage verbessern
Pro  Feature ein eigener Branch erstellen(Feature Branching-Methode) 
Logout erstellen um Abmelden
Echte Daten der E-Mail-Adresse, Passwort und aus Excelliste holen für Datenbank
  
Bilder im Frontend im Backend implementieren mit HTTP-Methode damit sie im UI angezeigt werden
ForgotPassword Routing in Login verlinken  anstatt eigene Page 
Bei Styling der Container 


## Sprint 3:

Review:  
Protected Route implementiert 
Home mit Backend Verbinden
API Calls definiert für Kommunikation zwischen Backend und Frontend
An/Abmeldung Icon
Code in Clean Code Umwandeln




Retrospektive:
Was war gut?
Zusammenarbeit im Backend klare aufgaben wer was macht keine doppelarbeiten
Planung im vorhinein war sehr gut

Was war schlecht?
Doppelarbeiten im Frontend 
Neue Features implementiert die im Backend Datenbankmodell nicht implementiert wurden
Verbesserungsvorschläge:
Feature Branch einrichten
Bessere Kommunikation im Frontend mit genauer Aufgab
Bessere Aufgabenverteilung sowie genauer Releasezeiten definieren(Planung)






<img width="1395" height="1413" alt="image" src="https://github.com/user-attachments/assets/d8e32091-f40b-4a6a-b58f-c1dea59b0520" />


## Releaseplan der 3 Sprints:


<img width="1260" height="1379" alt="image" src="https://github.com/user-attachments/assets/d10c3b9e-bb2c-423d-9c4e-86aa444adc61" />
<img width="1464" height="1172" alt="image" src="https://github.com/user-attachments/assets/1f4053fb-4b91-46c9-8fb9-7749aa2ce4e6" />








