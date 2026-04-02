import { useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../lib/api';

function Stars({ rating }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span>
      {[...Array(full)].map((_, i) => <i key={`f${i}`} className="fa-solid fa-star text-gold" />)}
      {half === 1 && <i className="fa-solid fa-star-half-stroke text-gold" />}
      {[...Array(empty)].map((_, i) => <i key={`e${i}`} className="fa-regular fa-star text-gold" />)}
    </span>
  );
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-picker">
      {[1,2,3,4,5].map(n => (
        <i
          key={n}
          className={`fa-solid fa-star ${n <= (hover || value) ? 'active' : ''}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
        />
      ))}
    </div>
  );
}

const emptyForm = { rating: 0, difficulty: '', wouldTakeAgain: null, comment: '' };

export default function ReviewModal({ teacher, startOnForm, onClose, onReviewAdded, isAdmin }) {
  const [reviews,    setReviews]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(startOnForm || false);
  const [form,       setForm]       = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/teachers/${teacher._id}/reviews`);
      const data = await res.json();
      setReviews(data);
    } catch { setReviews([]); }
    finally  { setLoading(false); }
  }, [teacher._id]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.rating)              return setError('Please select a star rating.');
    if (!form.difficulty)          return setError('Please select a difficulty level.');
    if (form.wouldTakeAgain === null) return setError('Please answer "Would Take Again".');
    if (!form.comment.trim())      return setError('Please write a comment.');

    setSubmitting(true);
    try {
      const res = await fetch(`/api/teachers/${teacher._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      setForm(emptyForm);
      setShowForm(false);
      await fetchReviews();
      onReviewAdded && onReviewAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE}/api/teachers/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${sessionStorage.getItem('adminPassword')}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchReviews();
      onReviewAdded && onReviewAdded();
    } catch {
      alert('Could not delete review.');
    }
  };

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>{teacher.name}</h2>
        <p style={{ color: '#777', marginTop: 0 }}>{teacher.subject} · {teacher.department}</p>

        {/* Summary */}
        {reviews.length > 0 && (
          <div className="review-summary" style={{ background: '#fafafa', padding: '1rem', borderRadius: 8, marginBottom: '1rem' }}>
            <p><strong>Average Rating:</strong> <Stars rating={parseFloat(avg)} /> ({avg})</p>
            <p><strong>Average Difficulty:</strong> {(reviews.reduce((s,r)=>s+r.difficulty,0)/reviews.length).toFixed(1)}</p>
            <p><strong>Would Take Again:</strong> {Math.round(reviews.filter(r=>r.wouldTakeAgain).length/reviews.length*100)}%</p>
          </div>
        )}

        {/* Toggle form */}
        <div className="form-toggle">
          <button onClick={() => setShowForm(f => !f)}>
            <i className={`fa-solid ${showForm ? 'fa-eye' : 'fa-pen'}`} />
            {' '}{showForm ? 'View Reviews' : 'Add a Review'}
          </button>
        </div>

        {showForm ? (
          <form className="review-form" onSubmit={handleSubmit}>
            <h3><i className="fa-solid fa-pen" /> Write a Review</h3>
            {error && <p style={{ color: '#b30000', marginBottom: '0.5rem' }}>{error}</p>}

            <div className="form-group">
              <label>Rating</label>
              <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
            </div>

            <div className="form-group">
              <label>Difficulty (1 = Easy, 5 = Very Hard)</label>
              <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: Number(e.target.value) }))}>
                <option value="">Select difficulty</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Would You Take This Teacher Again?</label>
              <div className="wta-btns">
                <button type="button"
                  className={form.wouldTakeAgain === true ? 'selected-yes' : ''}
                  onClick={() => setForm(f => ({ ...f, wouldTakeAgain: true }))}>
                  <i className="fa-solid fa-thumbs-up" /> Yes
                </button>
                <button type="button"
                  className={form.wouldTakeAgain === false ? 'selected-no' : ''}
                  onClick={() => setForm(f => ({ ...f, wouldTakeAgain: false }))}>
                  <i className="fa-solid fa-thumbs-down" /> No
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Your Review</label>
              <textarea
                placeholder="Share your experience with this teacher..."
                value={form.comment}
                onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <>
            {loading && <p>Loading reviews…</p>}
            {!loading && reviews.length === 0 && (
              <p className="no-reviews">No reviews yet — be the first to review this teacher!</p>
            )}
            {!loading && reviews.map((r, i) => (
              <div key={r._id || i} className="single-review">
                <p className="stat-row"><Stars rating={r.rating} /> <strong>({r.rating})</strong></p>
                <p className="stat-row"><strong>Difficulty:</strong> {r.difficulty}</p>
                <p className="stat-row"><strong>Would Take Again:</strong> {r.wouldTakeAgain ? '✅ Yes' : '❌ No'}</p>
                <blockquote>"{r.comment}"</blockquote>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                  <small style={{ color: '#aaa' }}>{new Date(r.createdAt).toLocaleDateString()}</small>
                  {isAdmin && (
                    <button className="delete-review-btn" onClick={() => handleDelete(r._id)}>
                      <i className="fa-solid fa-trash" /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

