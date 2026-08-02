import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState(null);

  // NOVO STANJE ZA EDIT REŽIM
  const [editingId, setEditingId] = useState(null);

  // Globalni admin kontekst
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

  // Pokreće se kada admin klikne na "Izmeni" u tabeli
  const startEdit = (category) => {
    setEditingId(category.categoryId);
    setCategoryName(category.categoryName); // Upisujemo trenutni naziv u input polje
    setError(null);
  };

  // Resetuje formu u prvobitno stanje
  const cancelEdit = () => {
    setEditingId(null);
    setCategoryName('');
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingId) {
      // --- REŽIM IZMENE (PUT ZAHTEV) ---
      axios.put(`http://localhost:8080/categories/${editingId}`, { categoryName }, getAdminHeaders())
        .then(() => {
          cancelEdit(); // Resetujemo formu i izlazimo iz edit režima
          fetchCategories(); // Osvežavamo tabelu
        })
        .catch(err => {
          setError(err.response?.data?.categoryName || err.response?.data || "Greška pri izmeni.");
        });
    } else {
      // --- REŽIM NOVOG UNOSA (POST ZAHTEV) ---
      axios.post('http://localhost:8080/categories', { categoryName }, getAdminHeaders())
        .then(() => {
          setCategoryName('');
          setError(null);
          fetchCategories(); 
        })
        .catch(err => {
          setError(err.response?.data?.categoryName || err.response?.data || "Greška pri čuvanju.");
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovu kategoriju?")) {
      axios.delete(`http://localhost:8080/categories/${id}`, getAdminHeaders())
        .then(() => {
          if (editingId === id) cancelEdit(); // Ako obrišemo onu koju trenutno menjamo, resetuj formu
          setError(null);
          fetchCategories();
        })
        .catch(err => {
          setError(err.response?.data || "Nije moguće obrisati kategoriju. Možda je povezana sa proizvodom.");
        });
    }
  };

  return (
    <div className="container mt-4">
      {/* Naslov stranice */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Upravljanje Kategorijama</h2>
        <hr />
      </div>

      <div className="row">
        {/* Kolona za Formu - VIDI SE SAMO AKO JE KORISNIK ADMIN */}
        {isAdmin && (
          <div className="col-md-4">
            <div className="custom-card mb-4">
              {/* Dinamički menjamo naslov forme u zavisnosti od režima */}
              <h4 className="mb-3 fw-bold text-dark">
                {editingId ? "Izmeni Kategoriju" : "Nova Kategorija"}
              </h4>
              
              {error && <div className="alert alert-danger p-2">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Naziv kategorije</label>
                  <input
                    type="text"
                    className="form-control custom-input"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="npr. Electronics"
                    required
                  />
                </div>
                
                {/* Dinamičko menjanje dugmića na dnu forme */}
                <div className="d-flex flex-column gap-2">
                  <button type="submit" className="btn btn-primary w-100 custom-btn">
                    {editingId ? "Sačuvaj Izmene" : "Sačuvaj"}
                  </button>
                  
                  {editingId && (
                    <button type="button" className="btn btn-secondary w-100 custom-btn" onClick={cancelEdit}>
                      Otkaži
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Kolona za Tabelu */}
        <div className={isAdmin ? "col-md-8" : "col-md-12"}>
          <div className="custom-card">
            <h4 className="mb-3 fw-bold text-dark">Lista Kategorija</h4>
            {error && !isAdmin && <div className="alert alert-danger p-2">{error}</div>}
            
            <table className="table table-striped table-bordered custom-table mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Naziv Kategorije</th>
                  {isAdmin && <th>Akcije</th>}
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.categoryId}>
                    <td>{cat.categoryId}</td>
                    <td><strong>{cat.categoryName}</strong></td>
                    {isAdmin && (
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-warning btn-sm fw-bold px-3" 
                            onClick={() => startEdit(cat)}
                          >
                            Izmeni
                          </button>
                          <button 
                            className="btn btn-danger btn-sm custom-btn-danger px-3" 
                            onClick={() => handleDelete(cat.categoryId)}
                          >
                            Obriši
                          </button>
                        </div>
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
