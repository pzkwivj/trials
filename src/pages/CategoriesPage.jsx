import { useContext, useState, useEffect } from 'react'; // Dodaj useContext
import { AdminContext } from '../context/AdminContext'; // Uvezi kontekst
import axios from 'axios';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState(null);

  // ADMIN SISTEM STANJA
  const { isAdmin, adminPassword } = useContext(AdminContext);

  // Pomoćna funkcija za slanje tokena u zaglavlju
  const getAdminHeaders = () => {
    return { headers: { 'X-Admin-Token': isAdmin ? adminPassword : '' } };
  };

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

    // Dodat getAdminHeaders() kao treći parametar za POST zahtev
    axios.post('http://localhost:8080/categories', { categoryName }, getAdminHeaders())
      .then(() => {
        setCategoryName('');
        setError(null);
        fetchCategories(); 
      })
      .catch(err => {
        const msg = err.response?.data?.categoryName || err.response?.data || "Greška pri čuvanju.";
        setError(msg);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovu kategoriju?")) {
      // Dodat getAdminHeaders() kao drugi parametar za DELETE zahtev
      axios.delete(`http://localhost:8080/categories/${id}`, getAdminHeaders())
        .then(() => {
          setError(null);
          fetchCategories();
        })
        .catch(err => {
          const msg = err.response?.data || "Nije moguće obrisati kategoriju. Možda je povezana sa proizvodom.";
          setError(msg);
        });
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Upravljanje Kategorijama</h2>
      </div>

      <div className="row">
        {/* Kolona za Formu - VIDI SE SAMO AKO JE KORISNIK ADMIN */}
        {isAdmin && (
          <div className="col-md-4">
            <div className="custom-card">
              <h4 className="mb-3">Nova Kategorija</h4>
              {error && <div className="alert alert-danger p-2">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Naziv kategorije</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="npr. Electronics"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 custom-btn">Sačuvaj</button>
              </form>
            </div>
          </div>
        )}

        {/* Kolona za Tabelu - Širi se na col-12 ako nismo admini */}
        <div className={isAdmin ? "col-md-8" : "col-md-12"}>
          <div className="custom-card">
            <h4 className="mb-3">Lista Kategorija</h4>
            {error && !isAdmin && <div className="alert alert-danger p-2">{error}</div>}
            <table className="table table-striped table-bordered custom-table">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Naziv Kategorije</th>
                  {isAdmin && <th>Akcija</th>}
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.categoryId}>
                    <td>{cat.categoryId}</td>
                    <td>{cat.categoryName}</td>
                    {isAdmin && (
                      <td>
                        <button className="btn btn-danger custom-btn" onClick={() => handleDelete(cat.categoryId)}>Obriši</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {categories.length === 0 && <p className="text-muted mt-3 mb-0">Nema unetih kategorija.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
