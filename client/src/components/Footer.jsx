import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div><i className="fa-solid fa-school" /> Abraham Lincoln High School</div>
      <div style={{ marginTop: '0.3rem', opacity: 0.8 }}>RateMyMustang · Real reviews from real students</div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.75 }}>
        Questions? <Link to="/contact" style={{ color: '#ffcc00', textDecoration: 'underline' }}>Contact us</Link>
        {' · '}
        <a href="mailto:lilogan2008@gmail.com" style={{ color: '#ffcc00' }}>lilogan2008@gmail.com</a>
      </div>
    </footer>
  );
}

