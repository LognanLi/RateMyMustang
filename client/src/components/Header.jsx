import { Link } from 'react-router-dom';

export default function Header({ isAdmin, onLogout }) {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <img
          src="https://www.sfusd.edu/sites/default/files/school-logos/ALHS%20Logo_0.png"
          alt="Lincoln High Logo"
        />
        <span className="logo-text">RateMyMustang</span>
      </Link>
      <nav>
        <Link to="/"><i className="fa-solid fa-house" /> Home</Link>
        <Link to="/teachers"><i className="fa-solid fa-chalkboard-user" /> Teacher List</Link>
        {isAdmin && (
          <button onClick={onLogout} style={{ background: '#8b0000', color: 'white', border: 'none', borderRadius: 10, padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 500, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <i className="fa-solid fa-shield-halved" /> Admin <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>· Logout</span>
          </button>
        )}
      </nav>
    </header>
  );
}

