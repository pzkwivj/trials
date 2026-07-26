import { useState, useEffect } from 'react';
import axios from 'axios';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);

  // ADMIN SISTEM STANJA
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Stanja za filtere i formu
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('productId');
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    productUrl: '',
    category: { categoryId: '' },
    company: { companyId: '' }
  });
  const [error, setError] = useState(null);

  // Funkcija za logovanje na frontendu
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (adminPassword === '123') { // Mora biti ista šifra kao na backendu
      setIsAdmin(true);
      setShowLoginModal(false);
      setError(null);
    } else {
      alert("Pogrešna šifra!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminPassword('');
  };

  // Pomoćna funkcija za slanje zahteva sa Admin tokenom u headeru
  const getAdminHeaders = () => {
    return { headers: { 'X-Admin-Token': adminPassword } };
  };

  const fetchProducts = () => {
    axios.get('http://localhost:8080/products', { params: { search, sortBy } })
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Greška pri učitavanju proizvoda."));
  };

  useEffect(() => {
    fetchProducts();
  }, [search, sortBy]);

  useEffect(() => {
    axios.get('http://localhost:8080/categories').then(res => setCategories(res.data));
    axios.get('http://localhost:8080/companies').then(res => setCompanies(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category.categoryId || !formData.company.companyId) {
      setError("Morate izabrati kategoriju i kompaniju!");
      return;
    }

    // Šaljemo getAdminHeaders() kao treći parametar kod POST zahteva
    axios.post('http://localhost:8080/products', formData, getAdminHeaders())
      .then(() => {
        setFormData({ productName: '', price: '', productUrl: '', category: { categoryId: '' }, company: { companyId: '' } });
        setError(null);
        fetchProducts(); 
      })
      .catch(err => setError(err.response?.data || "Greška pri čuvanju."));
  };

  const handleDelete = (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovaj proizvod?")) {
      // Šaljemo getAdminHeaders() kao drugi parametar kod DELETE zahteva
      axios.delete(`http://localhost:8080/products/${id}`, getAdminHeaders())
        .then(() => fetchProducts())
        .catch(err => setError(err.response?.data || "Greška pri brisanju."));
    }
  };

  return (
    <div className="container mt-4">
      {/* Gornja traka sa Login / Logout dugmetom */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Sistem za popuste</h2>
        {isAdmin ? (
          <button className="btn btn-outline-danger" onClick={handleLogout}>Odjavi se (Admin)</button>
        ) : (
          <button className="btn btn-outline-primary" onClick={() => setShowLoginModal(true)}>Prijava za Admina</button>
        )}
      </div>

      {/* Prozor za unos šifre (Pojavljuje se na klik Prijava) */}
      {showLoginModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Unesite Admin Šifru</h5>
              <form onSubmit={handleLoginSubmit}>
                <input 
                  type="password" 
                  className="form-control mb-3" 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)} 
                  placeholder="Šifra..."
                  required
                />
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success">Potvrdi</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowLoginModal(false)}>Otkaži</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        {/* Kolona za Formu - PRIKAZUJE SE SAMO AKO JE KORISNIK ADMIN */}
        {isAdmin && (
          <div className="col-md-4">
            <div className="card p-3 shadow-sm mb-4">
              <h4 className="mb-3">Novi Proizvod</h4>
              {error && <div className="alert alert-danger p-2">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="form-label">Naziv proizvoda</label>
                  <input type="text" className="form-control" value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Cena (RSD)</label>
                  <input type="number" step="0.01" className="form-control" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Link do proizvoda</label>
                  <input type="url" className="form-control" value={formData.productUrl} onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Kategorija</label>
                  <select className="form-select" value={formData.category.categoryId} onChange={(e) => setFormData({ ...formData, category: { categoryId: e.target.value } })} required>
                    <option value="">-- Izaberi kategoriju --</option>
                    {categories.map(cat => <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Kompanija</label>
                  <select className="form-select" value={formData.company.companyId} onChange={(e) => setFormData({ ...formData, company: { companyId: e.target.value } })} required>
                    <option value="">-- Izaberi kompaniju --</option>
                    {companies.map(com => <option key={com.companyId} value={com.companyId}>{com.companyName}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">Sačuvaj Proizvod</button>
              </form>
            </div>
          </div>
        )}

        {/* Kolona za Tabelu - Širi se na ceo ekran (col-12) ako nismo admini, ili zauzima col-8 ako jesmo */}
        <div className={isAdmin ? "col-md-8" : "col-md-12"}>
          <div className="card p-3 shadow-sm mb-4">
            
            {/* Kontrole za pretragu i sortiranje */}
            <div className="row g-2 mb-3 align-items-center">
              <div className="col-md-7">
                <input type="text" className="form-control" placeholder="Pretraži proizvode po nazivu..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="col-md-5">
                <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="productId">Podrazumevano (ID)</option>
                  <option value="priceAsc">Cena: Od najjeftinijeg</option>
                  <option value="priceDesc">Cena: Od najskupljeg</option>
                  <option value="nameAsc">Naziv: A-Z</option>
                </select>
              </div>
            </div>

            <h4 className="mb-3">Lista Proizvoda</h4>
            <table className="table table-striped table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Naziv</th>
                  <th>Cena</th>
                  <th>Link</th>
                  <th>Kategorija</th>
                  <th>Kompanija</th>
                  {isAdmin && <th>Akcija</th>} {/* Kolona Akcija se vidi samo za admina */}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.productId}>
                    <td>{p.productId}</td>
                    <td>{p.productName}</td>
                    <td>{p.price?.toFixed(2)} RSD</td>
                    <td>
                      {p.productUrl ? <a href={p.productUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info btn-sm">Poseti sajt</a> : <span className="text-muted">Nema linka</span>}
                    </td>
                    <td>{p.category?.categoryName || 'N/A'}</td>
                    <td>{p.company?.companyName || 'N/A'}</td>
                    {isAdmin && ( // Dugme obriši se vidi samo za admina
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.productId)}>Obriši</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <p className="text-muted mt-3 mb-0">Nema unetih ili pronađenih proizvoda.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
