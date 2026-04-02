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

export default function TeacherCard({ teacher, onViewReviews, onRateTeacher }) {
  const hasReviews = teacher.reviewCount > 0;

  return (
    <div className="teacher-card">
      <h3>{teacher.name}</h3>
      <p className="subject">{teacher.subject} · {teacher.department}</p>

      {hasReviews ? (
        <>
          <p className="stat-row">
            <Stars rating={teacher.avgRating} />
            {' '}<strong>{teacher.avgRating}</strong>
            <span style={{ color: '#777', marginLeft: 6 }}>({teacher.reviewCount} review{teacher.reviewCount !== 1 ? 's' : ''})</span>
          </p>
          <p className="stat-row">
            <i className="fa-solid fa-thumbs-up" style={{ marginRight: 6 }} />
            <strong>{teacher.wouldTakeAgainPercent}%</strong> Would take again
          </p>
          <p className="stat-row">
            <i className="fa-solid fa-gauge-high" style={{ marginRight: 6 }} />
            Difficulty: <strong>{teacher.avgDifficulty}</strong>
          </p>
          {teacher.latestComment && (
            <blockquote>"{teacher.latestComment}"</blockquote>
          )}
        </>
      ) : (
        <p className="no-reviews" style={{ margin: '1rem 0' }}>No reviews yet — be the first!</p>
      )}

      <div className="card-buttons">
        <button className="btn-view" onClick={() => onViewReviews(teacher)}>
          <i className="fa-solid fa-eye" /> View Reviews
        </button>
        <button className="btn-rate" onClick={() => onRateTeacher(teacher)}>
          <i className="fa-solid fa-pen" /> Rate Teacher
        </button>
      </div>
    </div>
  );
}

