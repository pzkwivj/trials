import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)

  // useEffect se pokreće čim se komponenta učita na ekran
  useEffect(() => {
    axios.get('http://localhost:8080/categories')
      .then(response => {
        setCategories(response.data) // Ubacujemo podatke iz Springa u stanje
      })
      .catch(err => {
        console.error("Greška pri povlačenju:", err)
        setError("Nije moguće učitati kategorije. Proveri da li je Spring pokrenut!")
      })
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Lista Kategorija</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
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
      
      {categories.length === 0 && !error && <p>Nema pronađenih kategorija u bazi.</p>}
    </div>
  )
}

export default App
