import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useContext, useState } from 'react'; // Dodajemo useContext i useState
import { AdminProvider, AdminContext } from './context/AdminContext'; // Uvozimo i kontekst direktno ovde
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';
import DiscountsPage from './pages/DiscountsPage';
import CompaniesPage from './pages/CompaniesPage';

function AppContent() {
  // Izvlačimo admin stanja iz konteksta
  const { isAdmin, login, logout } = useContext(AdminContext);
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(password)) {
      setShowModal(false);
      setPassword('');
    } else {
      alert('Pogrešna šifra!');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial' }}>
      {/* JEDINSTVENI NAVIGACIONI MENI */}
      {/* JEDINSTVENI NAVIGACIONI MENI SA POMERENIM TEKSTOM UDESNO */}
      <nav style={{
        padding: '20px 40px', // 20px gore/dole, 40px levo/desno (pomera tekst sa ivica ekrana)
        backgroundColor: '#333',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Leva strana: Tvoji linkovi pomereni udesno */}
        <div>
          <Link to="/categories" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Kategorije</Link>
          <Link to="/products" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Proizvodi</Link>
          <Link to="/companies" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Kompanije</Link>
          <Link to="/discounts" style={{ color: 'white', textDecoration: 'none' }}>Popusti</Link>
        </div>

        {/* Desna strana: Administracija pomerena ulevo od same ivice */}
        <div>
          {isAdmin ? (
            <span
              style={{ color: '#ff6b6b', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
              onClick={logout}
            >
              ODJAVI SE (ADMIN)
            </span>
          ) : (
            <span
              style={{
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
                opacity: 0.3,
                transition: 'opacity 0.2s'
              }}
              onClick={() => setShowModal(true)}
              onMouseEnter={(e) => e.target.style.opacity = 0.9}
              onMouseLeave={(e) => e.target.style.opacity = 0.3}
            >
              ADMINISTRACIJA
            </span>
          )}
        </div>
      </nav>


      {/* Prozor za šifru (Modal) */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 text-dark shadow-lg">
              <h5 className="mb-3 fw-bold">Unesite Admin Šifru</h5>
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  className="form-control mb-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Šifra..."
                  required
                />
                <div className="d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Otkaži</button>
                  <button type="submit" className="btn btn-success btn-sm">Potvrdi</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mesto gde se sadržaj menja na klik */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/discounts" element={<DiscountsPage />} />
          <Route path="/" element={<h2>Dobrodošli! Izaberite opciju iz menija.</h2>} />
        </Routes>
      </div>
    </div>
  );
}

// Glavna App komponenta koja obmotava sve provajderom
function App() {
  return (
    <AdminProvider>
      <Router>
        <AppContent />
      </Router>
    </AdminProvider>
  );
}

export default App;
