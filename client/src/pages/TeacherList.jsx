import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReviewModal from '../components/ReviewModal';
import { API_BASE } from '../lib/api';

export default function TeacherList({ isAdmin }) {
  const [teachers,        setTeachers]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [searchParams,    setSearchParams]    = useSearchParams();
  const [searchInput,     setSearchInput]     = useState(searchParams.get('search') || '');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [startOnForm,     setStartOnForm]     = useState(false);

  const fetchTeachers = useCallback(async (query) => {
    setLoading(true);
    try {
      const url  = query ? `${API_BASE}/api/teachers?search=${encodeURIComponent(query)}` : `${API_BASE}/api/teachers`;
      const res  = await fetch(url);
      const data = await res.json();
      setTeachers(data);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch whenever the URL search param changes
  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchInput(q);
    fetchTeachers(q);
  }, [searchParams, fetchTeachers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchInput.trim() ? { search: searchInput.trim() } : {});
  };

  const openViewModal = (teacher) => { setSelectedTeacher(teacher); setStartOnForm(false); };
  const openRateModal = (teacher) => { setSelectedTeacher(teacher); setStartOnForm(true); };
  const closeModal    = () => setSelectedTeacher(null);

  const handleReviewAdded = () => {
    const q = searchParams.get('search') || '';
    fetchTeachers(q);
  };

  return (
    <section className="teacher-table-container">
      <h2>All Teachers at Abraham Lincoln High School</h2>

      <div className="table-search">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 540 }}>
          <input
            type="text"
            placeholder="Search by name, subject, or department…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <button type="submit" style={{ padding: '0 1.2rem', background: '#b30000', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
            Search
          </button>
        </form>
      </div>

      <div className="table-wrapper">
        <table className="teacher-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject / Dept</th>
              <th>Rating</th>
              <th className="col-email">Email</th>
              <th className="col-status">Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading…</td></tr>
            )}
            {!loading && teachers.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No teachers found.</td></tr>
            )}
            {!loading && teachers.map(t => (
              <tr key={t._id}>
                <td><strong>{t.name}</strong></td>
                <td>{t.subject !== t.department ? `${t.subject} · ${t.department}` : t.department}</td>
                <td>
                  {t.reviewCount > 0
                    ? <><i className="fa-solid fa-star text-gold" /> {t.avgRating} <span style={{ color: '#999', fontSize: '0.85rem' }}>({t.reviewCount})</span></>
                    : <span style={{ color: '#aaa' }}>No reviews</span>
                  }
                </td>
                <td className="col-email">{t.email ? <a href={`mailto:${t.email}`}>{t.email}</a> : '—'}</td>
                <td className="col-status">{t.status}</td>
                <td className="actions-cell">
                  <button onClick={() => openViewModal(t)}>
                    <i className="fa-solid fa-eye" /> Reviews
                  </button>
                  <button className="btn-rate-sm" onClick={() => openRateModal(t)}>
                    <i className="fa-solid fa-pen" /> Rate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTeacher && (
        <ReviewModal
          teacher={selectedTeacher}
          startOnForm={startOnForm}
          onClose={closeModal}
          onReviewAdded={handleReviewAdded}
          isAdmin={isAdmin}
        />
      )}
    </section>
  );
}

