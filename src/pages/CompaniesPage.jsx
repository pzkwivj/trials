import { useState, useEffect } from 'react';
import axios from 'axios';

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pozivamo tvoj CompanyController
    axios.get('http://localhost:8080/companies')
      .then(response => {
        setCompanies(response.data);
      })
      .catch(err => {
        console.error("Greška pri učitavanju kompanija:", err);
        setError("Nije moguće učitati podatke o kompanijama.");
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Lista Kompanija</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th>
            <th>Naziv Kompanije</th>
            <th>PIB</th>
            <th>Adresa</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company.companyId}>
              <td>{company.companyId}</td>
              <td><strong>{company.companyName}</strong></td>
              <td>{company.pib}</td>
              <td>{company.address || 'Nema adrese'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {companies.length === 0 && !error && <p>Nema kompanija u bazi.</p>}
    </div>
  );
}

export default CompaniesPage;
