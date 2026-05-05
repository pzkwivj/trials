import { useState, useEffect } from 'react';
import axios from 'axios';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

useEffect(() => {
  axios.get('http://localhost:8080/products')
    .then(response => {
      // Provera: ako response.data nije niz, pokušaj da nađeš gde je niz
      const data = Array.isArray(response.data) ? response.data : [];
      setProducts(data);
    })
    .catch(err => {
      console.error("Greška:", err);
      setError("Neuspešno učitavanje");
    });
}, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Lista Proizvoda</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th>
            <th>Naziv Proizvoda</th>
            <th>Cena (RSD)</th>
            <th>Kategorija</th>
            <th>Kompanija (PIB)</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>{product.productName}</td>
              <td>{product.price?.toFixed(2)}</td>
              {/* Pristupamo poljima iz povezanih POJO klasa */}
              <td>{product.category?.categoryName || 'Nema kategorije'}</td>
              <td>
                {product.company?.companyName} 
                <small style={{ display: 'block', color: '#666' }}>
                  PIB: {product.company?.pib}
                </small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {products.length === 0 && !error && <p>Nema proizvoda u bazi.</p>}
    </div>
  );
}

export default ProductsPage;
