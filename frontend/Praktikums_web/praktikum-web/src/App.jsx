
/**import './App.css'
import "./RegistrierungPage.jsx"

function App() {
  return (
      <>
        <nav className="task">
          <Link to="/">Home</Link>
          <Link to="/filme">Filme</Link>
          <Link to="/gamingzubehör">Gaming Zubehör</Link>
          <Link to="/games">Games</Link>
          <Link to="/login">Login</Link>

        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filme" element={<Filme />} />
          <Route path="/gamingzubehör" element={<GamingZubehör />} />
          <Route path="/games" element={<Games />}/>
          <Route path="/login" element={<Login />}/>
          <Route
              path="/adminpage"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
          />

        </Routes>
      </>
  );
}

export default App;**/


