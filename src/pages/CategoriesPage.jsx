import { useState, useEffect } from 'react';
import axios from 'axios';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState(null);

  const fetchCategories = () => {
    axios.get('http://localhost:8080/categories')
      .then(res => setCategories(res.data))
      .catch(() => setError("Greška pri učitavanju kategorija."));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    axios.post('http://localhost:8080/categories', { categoryName })
      .then(() => {
        setCategoryName('');
        fetchCategories(); // Osvežava tabelu odmah nakon unosa
      })
      .catch(err => {
        // Ako backend vrati validacionu grešku (npr. Blank), prikazaće se ovde
        const msg = err.response?.data?.categoryName || "Greška pri čuvanju.";
        setError(msg);
      });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Kolona za Formu */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h4 className="mb-3">Nova Kategorija</h4>
            {error && <div className="alert alert-danger p-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Naziv kategorije</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={categoryName} 
                  onChange={(e) => setCategoryName(e.target.value)} 
                  placeholder="npr. Electronics"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Sačuvaj</button>
            </form>
          </div>
        </div>

        {/* Kolona za Tabelu */}
        <div className="col-md-8">
          <div className="card p-3 shadow-sm">
            <h4 className="mb-3">Lista Kategorija</h4>
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Naziv Kategorije</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.categoryId}>
                    <td>{cat.categoryId}</td>
                    <td>{cat.categoryName}</td>
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

export default CategoriesPage;
