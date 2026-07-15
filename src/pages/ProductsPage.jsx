import { useState, useEffect } from 'react';
import axios from 'axios';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Nova stanja za pretragu i sortiranje
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('productId');

  // Stanje za formu
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    productUrl: '',
    category: { categoryId: '' },
    company: { companyId: '' }
  });

  const [error, setError] = useState(null);

  // Ažurirana funkcija koja šalje parametre backendu
  const fetchProducts = () => {
    axios.get('http://localhost:8080/products', {
      params: { search, sortBy }
    })
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Greška pri učitavanju proizvoda."));
  };

  // useEffect reaguje na svaku promenu u poljima za pretragu i sortiranje
  useEffect(() => {
    fetchProducts();
  }, [search, sortBy]);

  // Podaci za padajuće menije se učitavaju samo jednom na početku
  useEffect(() => {
    axios.get('http://localhost:8080/categories')
      .then(res => setCategories(res.data))
      .catch(() => console.error("Greška sa kategorijama"));

    axios.get('http://localhost:8080/companies')
      .then(res => setCompanies(res.data))
      .catch(() => console.error("Greška sa kompanijama"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category.categoryId || !formData.company.companyId) {
      setError("Morate izabrati kategoriju i kompaniju!");
      return;
    }

    axios.post('http://localhost:8080/products', formData)
      .then(() => {
        setFormData({
          productName: '',
          price: '',
          productUrl: '',
          category: { categoryId: '' },
          company: { companyId: '' }
        });
        setError(null);
        fetchProducts(); 
      })
      .catch(err => {
        const errors = err.response?.data;
        if (typeof errors === 'object') {
          setError(Object.values(errors).join(', '));
        } else {
          setError("Greška pri čuvanju proizvoda.");
        }
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovaj proizvod?")) {
      axios.delete(`http://localhost:8080/products/${id}`)
        .then(() => fetchProducts())
        .catch(() => setError("Greška pri brisanju proizvoda."));
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Kolona za Formu */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h4 className="mb-3">Novi Proizvod</h4>
            {error && <div className="alert alert-danger p-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label">Naziv proizvoda</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Cena (RSD)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Link do proizvoda (URL)</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.productUrl}
                  onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Kategorija</label>
                <select
                  className="form-select"
                  value={formData.category.categoryId}
                  onChange={(e) => setFormData({
                    ...formData,
                    category: { categoryId: e.target.value }
                  })}
                  required
                >
                  <option value="">-- Izaberi kategoriju --</option>
                  {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Kompanija</label>
                <select
                  className="form-select"
                  value={formData.company.companyId}
                  onChange={(e) => setFormData({
                    ...formData,
                    company: { companyId: e.target.value }
                  })}
                  required
                >
                  <option value="">-- Izaberi kompaniju --</option>
                  {companies.map(com => (
                    <option key={com.companyId} value={com.companyId}>
                      {com.companyName} (PIB: {com.pib})
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100">Sačuvaj Proizvod</button>
            </form>
          </div>
        </div>

        {/* Kolona za Tabelu sa dodatim filterima */}
        <div className="col-md-8">
          <div className="card p-3 shadow-sm mb-4">
            
            {/* NOVI BLOK: Kontrole za pretragu i sortiranje u istom redu */}
            <div className="row g-2 mb-3 align-items-center">
              <div className="col-md-7">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Pretraži proizvode po nazivu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-5">
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
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
                  <th>Akcija</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.productId}>
                    <td>{p.productId}</td>
                    <td>{p.productName}</td>
                    <td>{p.price?.toFixed(2)} RSD</td>
                    <td>
                      {p.productUrl ? (
                        <a href={p.productUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info btn-sm">
                          Poseti sajt
                        </a>
                      ) : (
                        <span className="text-muted">Nema linka</span>
                      )}
                    </td>
                    <td>{p.category?.categoryName || 'N/A'}</td>
                    <td>{p.company?.companyName || 'N/A'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.productId)}>Obriši</button>
                    </td>
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
