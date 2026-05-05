import { useState, useEffect } from 'react';
import axios from 'axios';

function DiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pozivamo tvoj DiscountController
    axios.get('http://localhost:8080/discounts')
      .then(response => {
        setDiscounts(response.data);
      })
      .catch(err => {
        console.error("Greška:", err);
        setError("Nije moguće učitati popuste.");
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Lista Popusta</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Proizvod</th>
            <th>Originalna Cena</th>
            <th>Popust (%)</th>
            <th>Cena sa Popustom</th>
            <th>Ušteda</th>
            <th>Period Važenja</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map(d => {
            const originalPrice = d.product?.price || 0;
            const savings = originalPrice - d.discountedPrice;

            return (
              <tr key={d.discountId}>
                <td><strong>{d.product?.productName}</strong></td>
                <td>{originalPrice.toFixed(2)} RSD</td>
                <td style={{ color: 'red', fontWeight: 'bold' }}>-{d.percentage}%</td>
                <td style={{ color: 'green', fontWeight: 'bold' }}>{d.discountedPrice?.toFixed(2)} RSD</td>
                <td>{savings.toFixed(2)} RSD</td>
                <td>
                  <small>Od: {d.startDate}</small><br/>
                  <small>Do: {d.endDate}</small>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {discounts.length === 0 && !error && <p>Trenutno nema unetih popusta.</p>}
    </div>
  );
}

export default DiscountsPage;
