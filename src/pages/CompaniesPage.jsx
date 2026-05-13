import { useState, useEffect } from 'react';
import axios from 'axios';

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({ companyName: '', pib: '', address: '' });
  const [error, setError] = useState(null);

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
    axios.post('http://localhost:8080/companies', formData)
      .then(() => {
        setFormData({ companyName: '', pib: '', address: '' });
        setError(null);
        fetchCompanies();
      })
      .catch(err => {
        // Hvata poruke iz tvog GlobalExceptionHandler-a (npr. za PIB ili NotBlank)
        const errors = err.response?.data;
        if (typeof errors === 'object') {
          setError(Object.values(errors).join(', '));
        } else {
          setError("Greška pri čuvanju kompanije.");
        }
      });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h4 className="mb-3">Nova Kompanija</h4>
            {error && <div className="alert alert-danger p-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label">Naziv</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">PIB (9 cifara)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.pib}
                  onChange={(e) => setFormData({...formData, pib: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Adresa</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-success w-100">Sačuvaj</button>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-3 shadow-sm">
            <h4 className="mb-3">Lista Kompanija</h4>
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Naziv</th>
                  <th>PIB</th>
                  <th>Adresa</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(c => (
                  <tr key={c.companyId}>
                    <td>{c.companyId}</td>
                    <td>{c.companyName}</td>
                    <td>{c.pib}</td>
                    <td>{c.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompaniesPage;
