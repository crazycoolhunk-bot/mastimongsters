/**
 * Masti Mongsters API Server
 * Express application serving community endpoints.
 * Integrates an auto-seeding local JSON datastore file to allow immediate runs.
 */
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(cors());
app.use(express.json());

// Set up image upload storage (for local fallbacks of gallery)
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Database File Path
const DB_PATH = path.join(__dirname, 'data', 'db.json');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initial Database Seeder
function initDatabase() {
  if (fs.existsSync(DB_PATH)) return;

  const MEMBER_NAMES = [
    "Ajay Kumar Reddy",
    "Anil kumar Kalva",
    "Anil Reddy",
    "Anudeep",
    "Arun Kotturu",
    "BBSR",
    "Bipin ChandraPal Reddy",
    "Chakri",
    "Chintu",
    "Cnu Nano",
    "Dabba Pavan",
    "Daddy",
    "Dr. Karthik Reddy",
    "Dr. KiMO",
    "Durga",
    "Dwarak Nath",
    "Easwar",
    "Jai",
    "Joy Raghu",
    "KCR",
    "Keerthi",
    "Kittu",
    "KK",
    "KN Reddy",
    "Koushik",
    "Kumaraswamy",
    "Mahesh Kumar",
    "Mahi",
    "Munna",
    "Naga Srinivas",
    "Nikhil",
    "Nikhil Reddy",
    "Nishanth",
    "OmPrakash Artham",
    "Pavan Bangalore",
    "Pavan BJP",
    "Pavan Dabba",
    "Pavan K",
    "Prashanth I'Patnam",
    "Prashanth Reddy",
    "Raj Reddy",
    "Rajesh Somberi",
    "Rajnikar Reddy",
    "Rajshekar Patnaik",
    "Rama Rao",
    "Ramcharan Advocate",
    "Ranjith Reddy",
    "Ravikanth",
    "RaviKrishna",
    "RaviTej Sharma",
    "Reddy Saab",
    "SaiKanth",
    "Sairam",
    "Sandy Bhai",
    "Santosh Kumar",
    "Sashi Wines",
    "Shailender Reddy",
    "Sharath",
    "ShyamSunder",
    "Srikanth Maruthi",
    "Srikumar Tyres",
    "SS Sandeep",
    "Subbu Darling",
    "Sudha Reddy",
    "Uday Chicken",
    "Ujjwal",
    "Umesh Goud",
    "Varun Kulkarni",
    "Varun Reddy",
    "Videep Reddy",
    "Vijay Steel Plant",
    "Vikram Bilaji",
    "Vinay TCS",
    "VinayKanth",
    "Vinod RCI",
    "VishnuPrasad"
  ];

  const taglines = [
    'Always typing... usually spelling something wrong.',
    'Send memes, not paragraph messages.',
    'Here for the weekend road trips and pizza.',
    'Only replies in voice notes. Listen at 2x speed.',
    'Reacted with 👍 to over 5,000 messages.',
    'Spams custom stickers at 2:00 AM.',
    'Who is making Sunday lunch plans? Count me in.',
    'Reads everything but too lazy to send a reply.',
    'Midnight snack advisor and professional sleeper.',
    'Will show up exactly 2 hours late to meetups.',
    'Ask me about my sticker collection.',
    'Legend has it they once left the group chat and returned.',
    'Silent reader. Undercover agent.',
    'The official DJ of the roadtrip playlist.',
    'Keyboard warrior but silent in person.',
    'Group chat is my full time job.',
    'Usually on silent mode. Call if emergency.',
    'Will suggest a meetup and then cancel last minute.',
    'Meme archiver since 2021.'
  ];

  const emojis = ['🐯', '🦁', '🦊', '🐱', '🐼', '🐨', '🐻', '🐹', '🐰', '🐸', '🐙', '🐒', '🦄', '🧙‍♂️', '🕶️', '🚀', '🎸', '🍕', '🍔', '🥤', '👽', '👾', '🤠'];
  const gradients = [
    'linear-gradient(135deg, #39ff14 0%, #00e5ff 100%)',
    'linear-gradient(135deg, #ff007f 0%, #ffe600 100%)',
    'linear-gradient(135deg, #00e5ff 0%, #ff007f 100%)',
    'linear-gradient(135deg, #ffe600 0%, #39ff14 100%)',
    'linear-gradient(135deg, #8a2be2 0%, #ff007f 100%)'
  ];

  const members = [];
  MEMBER_NAMES.forEach((name, i) => {
    const isJai = name === 'Jai';
    
    // Distribute roles: Jai is Admin, others are classic (15%), lurker (20%), or active (65%)
    let role = 'active';
    if (isJai) {
      role = 'admin';
    } else {
      if (i % 7 === 0) role = 'classic';
      else if (i % 5 === 0) role = 'lurker';
    }

    // Status: Jai is legendary, others offline (60%), online (30%), legendary (10%)
    let status = 'offline';
    if (isJai) {
      status = 'legendary';
    } else {
      if (i % 9 === 0) status = 'legendary';
      else if (i % 3 === 0) status = 'online';
    }

    const tagline = taglines[i % taglines.length];
    const emoji = emojis[i % emojis.length];
    const gradient = gradients[i % gradients.length];
    const avatar = isJai ? '/avatars/jai.jpg' : (name === 'Ajay Kumar Reddy' ? '/avatars/ajay.jpg' : null);

    members.push({
      id: i + 1,
      name,
      role,
      status,
      tagline,
      emoji,
      gradient,
      avatar
    });
  });

  // Announcements Seeding
  const announcements = [
    { id: 1, title: 'Summer Meetup RSVP Open', content: 'Our annual Summer Mongsters Bash is scheduled for July 12th. Check the polling links and RSVP by Sunday!', isPinned: true, date: '2026-05-22' },
    { id: 2, title: 'No Chain Message Rule Reminder', content: 'Avoid forwarding external commercial links and good morning images to prevent notification fatigue. Banter stays in-house!', isPinned: false, date: '2026-05-18' }
  ];

  // Gallery Seeding (Mock Initial Items)
  const gallery = [
    { id: 1, title: 'Pondicherry road Trip', tag: 'Meetup', date: 'Oct 2012', imageUrl: '/gallery/pondy.jpg' },
    { id: 2, title: 'Austin, Tx Meet up', tag: 'Admin', date: 'March 2015', imageUrl: '/gallery/austin.jpg' },
    { id: 3, title: 'The WhatsApp Admin Meet', tag: 'Screenshot', date: 'Apr 2025', bg: 'linear-gradient(135deg, #39ff14 0%, #00e5ff 100%)', symbol: 'bubble' },
    { id: 4, title: 'Late Night Chai Gathering', tag: 'Meetup', date: 'Jun 2025', bg: 'linear-gradient(135deg, #ffe600 0%, #ff007f 100%)', symbol: 'chai' }
  ];

  const db = {
    members,
    announcements,
    gallery,
    requests: []
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

initDatabase();

// Helper to read DB
function readDB() {
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data);
}

// Helper to write DB
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ==========================================================================
// REST API ROUTES
// ==========================================================================

// 1. Members Endpoints
app.get('/api/members', (req, res) => {
  const db = readDB();
  let results = db.members;

  const { search, role } = req.query;

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(m => m.name.toLowerCase().includes(q) || m.tagline.toLowerCase().includes(q));
  }

  if (role && role !== 'all') {
    results = results.filter(m => m.role === role);
  }

  res.json(results);
});

// 2. Announcements Endpoints
app.get('/api/announcements', (req, res) => {
  const db = readDB();
  res.json(db.announcements);
});

app.post('/api/announcements', (req, res) => {
  const { title, content, isPinned } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const db = readDB();
  const newAnnouncement = {
    id: db.announcements.length + 1,
    title,
    content,
    isPinned: !!isPinned,
    date: new Date().toISOString().split('T')[0]
  };

  db.announcements.unshift(newAnnouncement); // Newest first
  writeDB(db);
  res.status(201).json(newAnnouncement);
});

// 3. Gallery Endpoints
app.get('/api/gallery', (req, res) => {
  const db = readDB();
  res.json(db.gallery);
});

// Upload media to gallery
app.post('/api/gallery/upload', upload.single('media'), (req, res) => {
  const { title, tag } = req.body;
  if (!title || !req.file) {
    return res.status(400).json({ error: 'Title and image file are required' });
  }

  const db = readDB();
  const newPhoto = {
    id: db.gallery.length + 1,
    title,
    tag: tag || 'Upload',
    date: 'Just Now',
    imageUrl: `/uploads/${req.file.filename}`,
    isUploaded: true
  };

  db.gallery.unshift(newPhoto);
  writeDB(db);
  res.status(201).json(newPhoto);
});

// 4. Onboarding Request Endpoint
app.post('/api/contact/request', (req, res) => {
  const { name, phone, referer, reason, handle } = req.body;

  if (!name || !phone || !referer || !reason) {
    return res.status(400).json({ error: 'All fields except Instagram handle are required' });
  }

  const db = readDB();
  const newRequest = {
    id: db.requests.length + 1,
    name,
    phone,
    referer,
    reason,
    handle: handle || '',
    date: new Date().toISOString()
  };

  db.requests.push(newRequest);
  writeDB(db);
  res.status(201).json({ message: 'Request submitted successfully' });
});

// Serve static client assets in production
const distPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Serve index.html for all non-API paths to support React Router/client-side navigation
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'API route not found' });
    }
  });
}

// Error handling route fallback
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Masti Mongsters API server running on http://localhost:${PORT}`);
});
