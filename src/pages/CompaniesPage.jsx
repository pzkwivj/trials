import { useState, useEffect } from 'react';
import axios from 'axios';

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({ companyName: '', pib: '', address: '' });
  const [error, setError] = useState(null);

  // ADMIN SISTEM STANJA
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Funkcija za logovanje na frontendu
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (adminPassword === '123') {
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

  // Pomoćna funkcija za slanje tokena u zaglavlju
  const getAdminHeaders = () => {
    return { headers: { 'X-Admin-Token': adminPassword } };
  };

  const fetchCompanies = () => {
    axios.get('http://localhost:8080/companies')
      .then(res => setCompanies(res.data))
      .catch(() => setError("Greška pri učitavanju kompanija."));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Dodat getAdminHeaders() kao treći parametar za POST zahtev
    axios.post('http://localhost:8080/companies', formData, getAdminHeaders())
      .then(() => {
        setFormData({ companyName: '', pib: '', address: '' });
        setError(null);
        fetchCompanies();
      })
      .catch(err => {
        const errors = err.response?.data;
        if (typeof errors === 'object') {
          setError(Object.values(errors).join(', '));
        } else {
          setError(err.response?.data || "Greška pri čuvanju kompanije.");
        }
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovu kompaniju?")) {
      // Dodat getAdminHeaders() kao drugi parametar za DELETE zahtev
      axios.delete(`http://localhost:8080/companies/${id}`, getAdminHeaders())
        .then(() => {
          setError(null);
          fetchCompanies();
        })
        .catch(err => {
          setError(err.response?.data || "Nije moguće obrisati kompaniju. Možda ima aktivne proizvode.");
        });
    }
  };

  return (
    <div className="container mt-4">
      {/* Gornja traka sa Login / Logout dugmetom */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Upravljanje Kompanijama</h2>
        {isAdmin ? (
          <button className="btn btn-outline-danger" onClick={handleLogout}>Odjavi se (Admin)</button>
        ) : (
          <button className="btn btn-outline-primary" onClick={() => setShowLoginModal(true)}>Prijava za Admina</button>
        )}
      </div>

      {/* Prozor za unos šifre (Modal) */}
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
        {/* Kolona za Formu - VIDI SE SAMO AKO JE KORISNIK ADMIN */}
        {isAdmin && (
          <div className="col-md-4">
            <div className="card p-3 shadow-sm mb-4">
              <h4 className="mb-3">Nova Kompanija</h4>
              {error && <div className="alert alert-danger p-2">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="form-label">Naziv</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">PIB (9 cifara)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.pib}
                    onChange={(e) => setFormData({ ...formData, pib: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Adresa</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success w-100">Sačuvaj</button>
              </form>
            </div>
          </div>
        )}

        {/* Kolona za Tabelu - Širi se na col-12 ako nismo admini */}
        <div className={isAdmin ? "col-md-8" : "col-md-12"}>
          <div className="card p-3 shadow-sm">
            <h4 className="mb-3">Lista Kompanija</h4>
            {error && !isAdmin && <div className="alert alert-danger p-2">{error}</div>}
            <table className="table table-striped table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Naziv</th>
                  <th>PIB</th>
                  <th>Adresa</th>
                  {isAdmin && <th>Akcija</th>}
                </tr>
              </thead>
              <tbody>
                {companies.map(c => (
                  <tr key={c.companyId}>
                    <td>{c.companyId}</td>
                    <td>{c.companyName}</td>
                    <td>{c.pib}</td>
                    <td>{c.address}</td>
                    {isAdmin && (
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.companyId)}>Obriši</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {companies.length === 0 && <p className="text-muted mt-3 mb-0">Nema unetih kompanija.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompaniesPage;
