import { useContext, useState, useEffect } from 'react'; // Dodaj useContext
import { AdminContext } from '../context/AdminContext'; // Uvezi kontekst
import axios from 'axios';

function DiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);

  // ADMIN SISTEM STANJA
  const { isAdmin, adminPassword } = useContext(AdminContext);

  // Stanje za formu
  const [formData, setFormData] = useState({
    percentage: '',
    startDate: '',
    endDate: '',
    product: { productId: '' },
    company: { companyId: '' }
  });

  const [error, setError] = useState(null);

  // Pomoćna funkcija za slanje tokena u zaglavlju (Šaljemo '123' direktno ako je admin ulogovan)
  const getAdminHeaders = () => {
    return { headers: { 'X-Admin-Token': isAdmin ? adminPassword : '' } };
  };

  const fetchDiscounts = () => {
    axios.get('http://localhost:8080/discounts')
      .then(res => setDiscounts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Greška pri učitavanju popusta."));
  };

  useEffect(() => {
    fetchDiscounts();

    axios.get('http://localhost:8080/products')
      .then(res => setProducts(res.data))
      .catch(() => console.error("Greška sa proizvodima"));

    axios.get('http://localhost:8080/companies')
      .then(res => setCompanies(res.data))
      .catch(() => console.error("Greška sa kompanijama"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.product.productId || !formData.company.companyId) {
      setError("Morate izabrati proizvod i kompaniju!");
      return;
    }

    axios.post('http://localhost:8080/discounts', formData, getAdminHeaders())
      .then(() => {
        setFormData({
          percentage: '',
          startDate: '',
          endDate: '',
          product: { productId: '' },
          company: { companyId: '' }
        });
        setError(null);
        fetchDiscounts();
      })
      .catch(err => {
        const serverError = err.response?.data;
        if (typeof serverError === 'object') {
          setError(Object.values(serverError).join(', '));
        } else if (typeof serverError === 'string') {
          setError(serverError);
        } else {
          setError("Greška pri čuvanju popusta.");
        }
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Da li ste sigurni da želite da uklonite ovaj popust?")) {
      axios.delete(`http://localhost:8080/discounts/${id}`, getAdminHeaders())
        .then(() => {
          setError(null);
          fetchDiscounts();
        })
        .catch(err => {
          setError(err.response?.data || "Greška pri brisanju popusta.");
        });
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Upravljanje Popustima</h2>
      </div>



      <div className="row">
        {/* Kolona za Formu - VIDI SE SAMO AKO JE KORISNIK ADMIN */}
        {isAdmin && (
          <div className="col-md-4">
            <div className="custom-card">
              <h4 className="mb-3">Novi Popust</h4>
              {error && <div className="alert alert-danger p-2">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="form-label">Procenat popusta (%)</label>
                  <input
                    type="number"
                    className="form-control custom-input"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Datum početka</label>
                  <input
                    type="date"
                    className="form-control custom-input"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Datum završetka</label>
                  <input
                    type="date"
                    className="form-control custom-input"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Proizvod</label>
                  <select
                    className="form-select custom-select"
                    value={formData.product.productId}
                    onChange={(e) => setFormData({
                      ...formData,
                      product: { productId: e.target.value }
                    })}
                    required
                  >
                    <option value="">-- Izaberi proizvod --</option>
                    {products.map(p => (
                      <option key={p.productId} value={p.productId}>
                        {p.productName} ({p.price?.toFixed(2)} RSD)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Kompanija</label>
                  <select
                    className="form-select custom-select"
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
                        {com.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-danger w-100">Aktiviraj Popust</button>
              </form>
            </div>
          </div>
        )}

        {/* Kolona za Tabelu - SADA JE PRAVILNO ZATVORENA I ŠIRI SE AKO KORISNIK NIJE ADMIN */}
        <div className={isAdmin ? "col-md-8" : "col-md-12"}>
          <div className="custom-card">
            <h4 className="mb-3">Lista Popusta</h4>
            {error && !isAdmin && <div className="alert alert-danger p-2">{error}</div>}
            <table className="table table-striped table-bordered custom-table">
              <thead className="table-dark">
                <tr>
                  <th>Proizvod</th>
                  <th>Originalna Cena</th>
                  <th>Popust</th>
                  <th>Nova Cena</th>
                  <th>Ušteda</th>
                  <th>Period Važenja</th>
                  {isAdmin && <th>Akcija</th>}
                </tr>
              </thead>
              <tbody>
                {discounts.map(d => {
                  const originalPrice = d.product?.price || 0;
                  const savings = originalPrice - (d.discountedPrice || 0);

                  return (
                    <tr key={d.discountId}>
                      <td><strong>{d.product?.productName || 'N/A'}</strong></td>
                      <td>{originalPrice.toFixed(2)} RSD</td>
                      <td className="text-danger fw-bold">-{d.percentage}%</td>
                      <td className="text-success fw-bold">{d.discountedPrice?.toFixed(2)} RSD</td>
                      <td>{savings.toFixed(2)} RSD</td>
                      <td>
                        <small className="d-block">Od: {d.startDate}</small>
                        <small className="d-block">Do: {d.endDate}</small>
                      </td>
                      {isAdmin && (
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.discountId)}>Ukloni</button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {discounts.length === 0 && <p className="text-muted mt-3 mb-0">Trenutno nema unetih popusta.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscountsPage;

