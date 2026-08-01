import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
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
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-2">
                <div className="container d-flex justify-content-between align-items-center">
                    
                    {/* Naziv aplikacije sa leve strane */}
                    <Link className="navbar-brand fw-bold fs-5" to="/">
                        Sistem Popusta
                    </Link>
                    
                    {/* Desna strana - POTPUNO DISKRETAN TEKST UMESTO DUGMETA */}
                    <div>
                        {isAdmin ? (
                            <span 
                                className="text-danger fw-semibold" 
                                style={{ cursor: 'pointer', fontSize: '12px', letterSpacing: '0.5px' }} 
                                onClick={logout}
                            >
                                ODJAVI SE (ADMIN)
                            </span>
                        ) : (
                            <span 
                                className="text-muted" 
                                style={{ 
                                    cursor: 'pointer', 
                                    fontSize: '12px', 
                                    opacity: 0.4, 
                                    transition: 'opacity 0.2s ease',
                                    letterSpacing: '0.5px'
                                }} 
                                onClick={() => setShowModal(true)}
                                onMouseEnter={(e) => e.target.style.opacity = 1}
                                onMouseLeave={(e) => e.target.style.opacity = 0.4}
                            >
                                ADMINISTRACIJA
                            </span>
                        )}
                    </div>

                </div>
            </nav>

            {/* Modal za šifru (Centriran) */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content p-4 shadow-lg border-0">
                            <h5 className="mb-3 fw-bold">Unesite Admin Šifru</h5>
                            <form onSubmit={handleLogin}>
                                <input
                                    type="password"
                                    className="form-control mb-3 py-2"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Šifra..."
                                    required
                                />
                                <div className="d-flex gap-2 justify-content-end">
                                    <button type="button" className="btn btn-secondary px-3" onClick={() => setShowModal(false)}>Otkaži</button>
                                    <button type="submit" className="btn btn-success px-4">Potvrdi</button>
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
