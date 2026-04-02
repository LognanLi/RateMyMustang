const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    name:                 { type: String, required: true },
    subject:              { type: String, required: true },   // e.g. "AP Biology", "Calculus BC"
    department:           { type: String, required: true },   // e.g. "Science", "Mathematics"
    email:                { type: String, default: '' },
    status:               { type: String, default: 'Instructor' },
    // Computed stats – recalculated after every new review
    avgRating:            { type: Number, default: 0 },
    avgDifficulty:        { type: Number, default: 0 },
    wouldTakeAgainPercent:{ type: Number, default: 0 },
    reviewCount:          { type: Number, default: 0 },
    latestComment:        { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);

