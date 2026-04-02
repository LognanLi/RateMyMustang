const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    teacher:       { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    course:        { type: String, default: '' },
    rating:        { type: Number, required: true, min: 1, max: 5 },
    difficulty:    { type: Number, required: true, min: 1, max: 5 },
    wouldTakeAgain:{ type: Boolean, required: true },
    comment:       { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);

