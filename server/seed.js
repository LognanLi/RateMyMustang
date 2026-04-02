require('dotenv').config();
const mongoose = require('mongoose');
const Teacher  = require('./models/Teacher');
const Review   = require('./models/Review');

const teachersData = [
  // ── 3 featured teachers (with rich subject info) ──────────────────────────
  { name: 'Mr. Kenneth Jones',  subject: 'AP Biology',    department: 'Science',           email: 'jonesken@sfusd.edu',        status: 'Instructor' },
  { name: 'Mr. Charlie Paulson',subject: 'Calculus BC',   department: 'Mathematics',        email: 'paulsonc@sfusd.edu',         status: 'Instructor' },
  { name: 'Mrs. Sara Falls',    subject: 'AP Literature', department: 'English',            email: 'fallss@sfusd.edu',           status: 'Department Chair' },
  // ── English ───────────────────────────────────────────────────────────────
  { name: 'Chloe Bair',           subject: 'English', department: 'English', email: 'bairc1@sfusd.edu',        status: 'Instructor' },
  { name: 'Anthony Boles-King',   subject: 'English', department: 'English', email: 'boles-kinga@sfusd.edu',   status: 'Instructor' },
  { name: 'Julian Cowan-Byrns',   subject: 'English', department: 'English', email: 'byrnsj@sfusd.edu',        status: 'Instructor' },
  { name: 'William Cotter',       subject: 'English', department: 'English', email: 'cotterw@sfusd.edu',       status: 'Instructor' },
  { name: 'Deeana Datangel',      subject: 'English', department: 'English', email: 'datangeld@sfusd.edu',     status: 'Instructor' },
  { name: 'Jesse Davidson',       subject: 'English', department: 'English', email: 'davidsonj1@sfusd.edu',    status: 'Instructor' },
  { name: 'Christine Eng',        subject: 'English', department: 'English', email: 'engc@sfusd.edu',          status: 'Instructor' },
  { name: 'Dan Herve',            subject: 'English', department: 'English', email: 'herved@sfusd.edu',        status: 'Instructor' },
  { name: 'Shamira Gratch',       subject: 'English', department: 'English', email: 'gratchs@sfusd.edu',       status: 'Instructor' },
  { name: 'Eliza Russo',          subject: 'English', department: 'English', email: 'russoe@sfusd.edu',        status: 'Instructor' },
  { name: 'Mitzy Salinas',        subject: 'English', department: 'English', email: 'salinassaltom@sfusd.edu', status: 'Instructor' },
  { name: 'Max Van Engers',       subject: 'English', department: 'English', email: 'vanengersm1@sfusd.edu',   status: 'Instructor' },
  { name: 'Elaine Walenta',       subject: 'English', department: 'English', email: 'walentae@sfusd.edu',      status: 'Instructor' },
  { name: 'Grant Wong',           subject: 'English', department: 'English', email: 'wongg6@sfusd.edu',        status: 'Instructor' },
  // ── Health Education ──────────────────────────────────────────────────────
  { name: 'Jack Doyle',           subject: 'Health Education', department: 'Health Education', email: 'doylej@sfusd.edu',   status: 'Instructor' },
  // ── JROTC ─────────────────────────────────────────────────────────────────
  { name: 'Marieta Lagat',        subject: 'JROTC',       department: 'JROTC',       email: 'lagatm@sfusd.edu',       status: 'Instructor' },
  // ── Mathematics ───────────────────────────────────────────────────────────
  { name: 'Ramiro Raygosa',       subject: 'Mathematics', department: 'Mathematics', email: 'raygosar@sfusd.edu',      status: 'Department Chair' },
  { name: 'Shawn Anderson',       subject: 'Mathematics', department: 'Mathematics', email: 'sanderson2@sfusd.edu',    status: 'Instructor' },
  { name: 'Elizabeth Bishop',     subject: 'Mathematics', department: 'Mathematics', email: 'bishope@sfusd.edu',       status: 'Instructor' },
  { name: 'Benjamin Coleman-Levy',subject: 'Mathematics', department: 'Mathematics', email: 'coleman-levyb@sfusd.edu', status: 'Instructor' },
  { name: 'Brian Delapena',       subject: 'Mathematics', department: 'Mathematics', email: 'delapenab@sfusd.edu',     status: 'Instructor' },
  { name: 'Jasmin Espinoza',      subject: 'Mathematics', department: 'Mathematics', email: 'espinozaj2@sfusd.edu',    status: 'Instructor' },
  { name: 'Jiayu Fang',           subject: 'Mathematics', department: 'Mathematics', email: 'fangj2@sfusd.edu',        status: 'Instructor' },
  { name: 'Nathaniel Garcia',     subject: 'Mathematics', department: 'Mathematics', email: 'garcian5@sfusd.edu',      status: 'Instructor' },
  { name: 'Javier Haro',          subject: 'Mathematics', department: 'Mathematics', email: 'haroj@sfusd.edu',         status: 'Instructor' },
  { name: 'Carol Manuel',         subject: 'Mathematics', department: 'Mathematics', email: 'manuelc@sfusd.edu',       status: 'Instructor' },
  { name: 'Tommy Ng',             subject: 'Mathematics', department: 'Mathematics', email: 'ngt2@sfusd.edu',          status: 'Instructor' },
  { name: 'Alexander Wong',       subject: 'Mathematics', department: 'Mathematics', email: 'wonga4@sfusd.edu',        status: 'Instructor' },
  { name: 'Aaron Yang',           subject: 'Mathematics', department: 'Mathematics', email: 'yanga@sfusd.edu',         status: 'Instructor' },
  // ── Physical Education ────────────────────────────────────────────────────
  { name: 'Philip Ferrigno',      subject: 'Physical Education', department: 'Physical Education', email: 'ferrignop@sfusd.edu', status: 'Department Chair' },
  { name: 'Camille Bustos',       subject: 'Physical Education', department: 'Physical Education', email: 'bustosc1@sfusd.edu',  status: 'Instructor' },
  { name: 'Kristy Erickson',      subject: 'Physical Education', department: 'Physical Education', email: 'ericksonk@sfusd.edu', status: 'Instructor' },
  { name: 'Donald Harris',        subject: 'Physical Education', department: 'Physical Education', email: 'harrisd3@sfusd.edu',  status: 'Instructor' },
  { name: 'Stephanie Lu',         subject: 'Physical Education', department: 'Physical Education', email: 'lus@sfusd.edu',       status: 'Instructor' },
  { name: 'Brenda Palaby',        subject: 'Physical Education', department: 'Physical Education', email: 'palabyb@sfusd.edu',   status: 'Instructor' },
  { name: 'Vincent Tang',         subject: 'Physical Education', department: 'Physical Education', email: 'tangv@sfusd.edu',     status: 'Instructor' },
  { name: 'Jason Chen',           subject: 'Physical Education', department: 'Physical Education', email: 'chenj19@sfusd.edu',   status: 'Instructor' },
];

// Reviews for the 3 featured teachers (keyed by name)
const seedReviews = {
  'Mr. Kenneth Jones': [
    { rating: 5,   difficulty: 3.5, wouldTakeAgain: true,  comment: 'Amazing teacher! Makes complex concepts easy to understand.' },
    { rating: 4.5, difficulty: 4.0, wouldTakeAgain: true,  comment: 'Very patient and explains concepts clearly.' },
    { rating: 4.6, difficulty: 3.8, wouldTakeAgain: true,  comment: 'Great at breaking down difficult topics.' },
  ],
  'Mr. Charlie Paulson': [
    { rating: 4,   difficulty: 4.2, wouldTakeAgain: true,  comment: 'Challenging but fair. Really prepares you for the AP exam.' },
    { rating: 4.4, difficulty: 4.0, wouldTakeAgain: false, comment: 'Helpful during office hours.' },
  ],
  'Mrs. Sara Falls': [
    { rating: 4.5, difficulty: 3.5, wouldTakeAgain: true,  comment: 'Passionate about literature and it shows. Great discussions.' },
    { rating: 4.7, difficulty: 3.2, wouldTakeAgain: true,  comment: 'Encourages critical thinking.' },
  ],
};

async function recalcStats(teacherDoc, reviews) {
  const count      = reviews.length;
  const avgRating  = parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1));
  const avgDiff    = parseFloat((reviews.reduce((s, r) => s + r.difficulty, 0) / count).toFixed(1));
  const wtaPercent = Math.round((reviews.filter(r => r.wouldTakeAgain).length / count) * 100);
  const latest     = reviews[reviews.length - 1].comment;
  teacherDoc.avgRating             = avgRating;
  teacherDoc.avgDifficulty         = avgDiff;
  teacherDoc.wouldTakeAgainPercent = wtaPercent;
  teacherDoc.reviewCount           = count;
  teacherDoc.latestComment         = latest;
  await teacherDoc.save();
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Review.deleteMany({});
  await Teacher.deleteMany({});
  console.log('Cleared existing data');

  // Insert teachers
  const inserted = await Teacher.insertMany(teachersData);
  console.log(`Inserted ${inserted.length} teachers`);

  // Insert seed reviews for featured teachers
  for (const teacher of inserted) {
    const reviews = seedReviews[teacher.name];
    if (!reviews) continue;
    const docs = reviews.map(r => ({ teacher: teacher._id, ...r }));
    const saved = await Review.insertMany(docs);
    await recalcStats(teacher, saved);
    console.log(`  ✅ ${teacher.name} – ${saved.length} reviews seeded`);
  }

  console.log('✅ Seed complete!');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });

