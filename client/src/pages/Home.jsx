import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherCard from '../components/TeacherCard';
import ReviewModal from '../components/ReviewModal';
import { API_BASE } from '../lib/api';

export default function Home({ isAdmin, onAdminLogin }) {
  const [topTeachers,     setTopTeachers]     = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [startOnForm,     setStartOnForm]     = useState(false);
  const [searchQuery,     setSearchQuery]     = useState('');
  const [showAdminLogin,  setShowAdminLogin]  = useState(false);
  const [adminPassword,   setAdminPassword]   = useState('');
  const [adminError,      setAdminError]      = useState('');
  const navigate = useNavigate();

  const fetchTopTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/teachers/top-rated`);
      const data = await res.json();
      setTopTeachers(data);
    } catch (err) {
      console.error('Failed to fetch top teachers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTopTeachers(); }, [fetchTopTeachers]);

  const openViewModal = (teacher) => { setSelectedTeacher(teacher); setStartOnForm(false); };
  const openRateModal = (teacher) => { setSelectedTeacher(teacher); setStartOnForm(true); };
  const closeModal    = () => setSelectedTeacher(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/teachers?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });
      if (res.ok) {
        sessionStorage.setItem('adminPassword', adminPassword);
        onAdminLogin();
        setShowAdminLogin(false);
        setAdminPassword('');
      } else {
        setAdminError('Wrong password.');
      }
    } catch {
      setAdminError('Could not connect to server.');
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <h1>
          Find Your Perfect Teacher at{' '}
          <span className="highlight">Abraham Lincoln High School</span>
        </h1>
        <p>Real reviews from real students. Help your fellow Mustangs make informed decisions.</p>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by teacher name, subject, or department…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <i className="fa-solid fa-magnifying-glass" /> Search
          </button>
        </form>

        <div className="stats">
          <div><i className="fa-solid fa-chalkboard-user" /><br /><strong>40+</strong><br />Teachers Listed</div>
          <div><i className="fa-solid fa-comments" /><br /><strong>Live</strong><br />Student Reviews</div>
          <div><i className="fa-solid fa-building-columns" /><br /><strong>5+</strong><br />Departments</div>
        </div>

        {/* Subtle admin login */}
        <div className="admin-login-area">
          {isAdmin ? (
            <span className="admin-badge"><i className="fa-solid fa-shield-halved" /> Admin Mode Active</span>
          ) : (
            <button className="admin-toggle-btn" onClick={() => { setShowAdminLogin(f => !f); setAdminError(''); }}>
              <i className="fa-solid fa-lock" /> Admin
            </button>
          )}
          {showAdminLogin && !isAdmin && (
            <form className="admin-login-form" onSubmit={handleAdminLogin}>
              <input
                type="password"
                placeholder="Enter admin password…"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                autoFocus
              />
              <button type="submit">Enter</button>
              {adminError && <span className="admin-error">{adminError}</span>}
            </form>
          )}
        </div>
      </section>

      {/* Top Rated */}
      <section className="top-rated">
        <h2>Top Rated Teachers</h2>
        <p>Discover the highest-rated teachers at Abraham Lincoln High School based on real student reviews.</p>

        {loading && <p>Loading…</p>}

        {!loading && topTeachers.length === 0 && (
          <p style={{ color: '#888' }}>No rated teachers yet. Be the first to leave a review!</p>
        )}

        <div className="teacher-grid">
          {!loading && topTeachers.map(t => (
            <TeacherCard
              key={t._id}
              teacher={t}
              onViewReviews={openViewModal}
              onRateTeacher={openRateModal}
            />
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedTeacher && (
        <ReviewModal
          teacher={selectedTeacher}
          startOnForm={startOnForm}
          onClose={closeModal}
          onReviewAdded={fetchTopTeachers}
          isAdmin={isAdmin}
        />
      )}
    </>
  );
}

