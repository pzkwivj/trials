import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';
import DiscountsPage from './pages/DiscountsPage';
import CompaniesPage from './pages/CompaniesPage';


function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial' }}>
        {/* Navigacioni meni koji je uvek vidljiv */}
        <nav style={{ padding: '20px', backgroundColor: '#333', color: '#fff' }}>
          <Link to="/categories" style={{ color: 'white', marginRight: '20px' }}>Kategorije</Link>
          <Link to="/products" style={{ color: 'white', marginRight: '20px' }}>Proizvodi</Link>
          <Link to="/companies" style={{ color: 'white', marginRight: '20px' }}>Kompanije</Link>
          <Link to="/discounts" style={{ color: 'white' }}>Popusti</Link>
        </nav>

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
    </Router>
  );
}

export default App;
