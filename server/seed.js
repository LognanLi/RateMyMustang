require('dotenv').config();
const mongoose = require('mongoose');
const Teacher  = require('./models/Teacher');
const Review   = require('./models/Review');

// ── Fallback hardcoded teachers (used if no TEACHERS_CSV_URL is set) ─────────
const fallbackTeachers = [
  { name: 'Mr. Kenneth Jones',   subject: 'AP Biology',    department: 'Science',      email: 'jonesken@sfusd.edu',   status: 'Instructor' },
  { name: 'Mr. Charlie Paulson', subject: 'Calculus BC',   department: 'Mathematics',  email: 'paulsonc@sfusd.edu',   status: 'Instructor' },
  { name: 'Mrs. Sara Falls',     subject: 'AP Literature', department: 'English',      email: 'fallss@sfusd.edu',     status: 'Department Chair' },
  { name: 'Chloe Bair',          subject: 'English',       department: 'English',      email: 'bairc1@sfusd.edu',     status: 'Instructor' },
  { name: 'Jack Doyle',          subject: 'Health Education', department: 'Health Education', email: 'doylej@sfusd.edu', status: 'Instructor' },
  { name: 'Marieta Lagat',       subject: 'JROTC',         department: 'JROTC',        email: 'lagatm@sfusd.edu',     status: 'Instructor' },
  { name: 'Ramiro Raygosa',      subject: 'Mathematics',   department: 'Mathematics',  email: 'raygosar@sfusd.edu',   status: 'Department Chair' },
  { name: 'Philip Ferrigno',     subject: 'Physical Education', department: 'Physical Education', email: 'ferrignop@sfusd.edu', status: 'Department Chair' },
];

// ── Fetch & parse CSV from a published Google Sheet ───────────────────────────
// Expected columns (row 1 = headers): name, subject, department, email, status
async function fetchTeachersFromSheet(url) {
  console.log('📥  Fetching teachers from Google Sheet…');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
  const text = await res.text();

  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  return lines.slice(1).map(line => {
    // Handle quoted fields with commas inside
    const cols = line.match(/(".*?"|[^,]+)(?=,|$)/g) || [];
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (cols[i] || '').replace(/^"|"$/g, '').trim();
    });
    // If the sheet has no department column, derive it from subject
    if (!obj.department) obj.department = obj.subject || '';
    return obj;
  }).filter(t => t.name); // skip blank rows
}

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

  // Load teachers from Google Sheet CSV or fall back to hardcoded list
  let teachersData = fallbackTeachers;
  if (process.env.TEACHERS_CSV_URL) {
    teachersData = await fetchTeachersFromSheet(process.env.TEACHERS_CSV_URL);
    console.log(`✅  Loaded ${teachersData.length} teachers from Google Sheet`);
  } else {
    console.log('ℹ️   No TEACHERS_CSV_URL set — using fallback data');
  }

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

