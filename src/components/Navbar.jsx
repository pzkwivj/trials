import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'; // Pretpostavljamo da koristiš react-router-dom
import { AdminContext } from '../context/AdminContext';

function Navbar() {
    const { isAdmin, login, logout } = useContext(AdminContext);
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if (login(password)) {
            setShowModal(false);
            setPassword('');
        } else {
            alert('Pogrešna šifra!');
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
                <div className="container">
                    <nav style={{ padding: '20px', backgroundColor: '#333', color: '#fff' }}>
                        <Link className="navbar-brand fw-bold" to="/">Sistem Popusta</Link>
                    </nav>
                    <div>
                        {isAdmin ? (
                            <button className="btn btn-danger btn-sm" onClick={logout}>Odjavi se (Admin)</button>
                        ) : (
                            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>Prijava za Admina</button>
                        )}
                    </div>
                </div>
            </nav>

            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content p-3">
                            <h5>Unesite Admin Šifru</h5>
                            <form onSubmit={handleLogin}>
                                <input
                                    type="password"
                                    className="form-control mb-3"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Šifra..."
                                    required
                                />
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-success">Potvrdi</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Otkaži</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
