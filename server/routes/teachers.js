const express = require('express');
const router  = express.Router();
const Teacher = require('../models/Teacher');
const Review  = require('../models/Review');

// Helper – recalculate + persist teacher stats after a review change
async function recalcStats(teacherId) {
  const reviews = await Review.find({ teacher: teacherId });
  const count   = reviews.length;
  if (count === 0) {
    await Teacher.findByIdAndUpdate(teacherId, {
      avgRating: 0, avgDifficulty: 0, wouldTakeAgainPercent: 0,
      reviewCount: 0, latestComment: '',
    });
    return;
  }

  const avgRating  = parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1));
  const avgDiff    = parseFloat((reviews.reduce((s, r) => s + r.difficulty, 0) / count).toFixed(1));
  const wtaPercent = Math.round((reviews.filter(r => r.wouldTakeAgain).length / count) * 100);
  const latest     = reviews[reviews.length - 1].comment;

  await Teacher.findByIdAndUpdate(teacherId, {
    avgRating, avgDifficulty: avgDiff, wouldTakeAgainPercent: wtaPercent,
    reviewCount: count, latestComment: latest,
  });
}

// GET /api/teachers  – all teachers, optional ?search= and ?department=
router.get('/', async (req, res) => {
  try {
    const { search, department } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name:       { $regex: search, $options: 'i' } },
        { subject:    { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) query.department = department;
    const teachers = await Teacher.find(query).sort({ subject: 1, name: 1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/teachers/top-rated  – top 3 by avgRating (must be before /:id)
router.get('/top-rated', async (req, res) => {
  try {
    const teachers = await Teacher.find({ reviewCount: { $gt: 0 } })
      .sort({ avgRating: -1 })
      .limit(3);
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/teachers/:id  – single teacher
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/teachers/:id/reviews  – all reviews for a teacher
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ teacher: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/teachers/:id/reviews  – add a new review
router.post('/:id/reviews', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const { rating, difficulty, wouldTakeAgain, comment, course } = req.body;
    if (!rating || !difficulty || wouldTakeAgain === undefined || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const review = new Review({ teacher: req.params.id, course: course || '', rating, difficulty, wouldTakeAgain, comment });
    await review.save();
    await recalcStats(req.params.id);

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/teachers/reviews/:reviewId – admin only
router.delete('/reviews/:reviewId', async (req, res) => {
  try {
    const password = (req.headers.authorization || '').replace('Bearer ', '');
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    const teacherId = review.teacher;
    await review.deleteOne();
    await recalcStats(teacherId);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

