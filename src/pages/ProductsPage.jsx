import { useContext, useState, useEffect } from 'react'; // Dodaj useContext
import { AdminContext } from '../context/AdminContext'; // Uvezi kontekst
import axios from 'axios';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);

  // ADMIN SISTEM STANJA
const { isAdmin, adminPassword } = useContext(AdminContext);

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


  // Pomoćna funkcija za slanje zahteva sa Admin tokenom u headeru
  const getAdminHeaders = () => {
    return { headers: { 'X-Admin-Token': isAdmin ? adminPassword : '' } };
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
      <div className="row">
        {/* Kolona za Formu - PRIKAZUJE SE SAMO AKO JE KORISNIK ADMIN */}
        {isAdmin && (
          <div className="col-md-4">
            <div className="custom-card">
              <h4 className="mb-3">Novi Proizvod</h4>
              {error && <div className="alert alert-danger p-2">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="form-label">Naziv proizvoda</label>
                  <input type="text" className="form-control custom-input" value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Cena (RSD)</label>
                  <input type="number" step="0.01" className="form-control custom-input" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Link do proizvoda</label>
                  <input type="url" className="form-control custom-input" value={formData.productUrl} onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Kategorija</label>
                  <select className="form-select custom-select" value={formData.category.categoryId} onChange={(e) => setFormData({ ...formData, category: { categoryId: e.target.value } })} required>
                    <option value="">-- Izaberi kategoriju --</option>
                    {categories.map(cat => <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Kompanija</label>
                  <select className="form-select custom-select" value={formData.company.companyId} onChange={(e) => setFormData({ ...formData, company: { companyId: e.target.value } })} required>
                    <option value="">-- Izaberi kompaniju --</option>
                    {companies.map(com => <option key={com.companyId} value={com.companyId}>{com.companyName}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100 custom-btn">Sačuvaj Proizvod</button>
              </form>
            </div>
          </div>
        )}

        {/* Kolona za Tabelu - Širi se na ceo ekran (col-12) ako nismo admini, ili zauzima col-8 ako jesmo */}
        <div className={isAdmin ? "col-md-8" : "col-md-12"}>
          <div className="custom-card">
            
            {/* Kontrole za pretragu i sortiranje */}
            <div className="row g-2 mb-3 align-items-center">
              <div className="col-md-7">
                <input type="text" className="form-control custom-input" placeholder="Pretraži proizvode po nazivu..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="col-md-5">
                <select className="form-select custom-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="productId">Podrazumevano (ID)</option>
                  <option value="priceAsc">Cena: Od najjeftinijeg</option>
                  <option value="priceDesc">Cena: Od najskupljeg</option>
                  <option value="nameAsc">Naziv: A-Z</option>
                </select>
              </div>
            </div>

            <h4 className="mb-3">Lista Proizvoda</h4>
            <table className="table table-striped table-bordered custom-table">
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
                        <button className="btn btn-danger custom-btn" onClick={() => handleDelete(p.productId)}>Obriši</button>
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
