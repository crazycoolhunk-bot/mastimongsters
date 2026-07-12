/**
 * Masti Mongsters API Server
 * Express application serving community endpoints.
 * Integrates Firebase Firestore and Firebase Storage for production ready persistence.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || 'jaisheelmastiproject';
const bucketName = process.env.STORAGE_BUCKET_NAME || `${projectId}.appspot.com`;

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: bucketName
    });
    console.log(`Firebase Admin initialized successfully for project: ${projectId}, storage bucket: ${bucketName}`);
  } catch (error) {
    console.warn("Firebase Admin failed to initialize with Application Default Credentials, attempting fallback...", error);
    try {
      admin.initializeApp({
        storageBucket: bucketName
      });
      console.log("Firebase Admin initialized using default parameters.");
    } catch (err) {
      console.error("Firebase Admin initialization failed entirely. Ensure credentials are set.", err);
    }
  }
}

const db = admin.firestore();
let isFirestoreOffline = false;
const bucket = admin.storage().bucket();

// Configure multer to store uploaded files in memory
const upload = multer({ storage: multer.memoryStorage() });

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

// Database Seeder
async function initDatabase() {
  try {
    const membersSnap = await db.collection('members').limit(1).get();
    if (!membersSnap.empty) {
      console.log("Database already seeded in Firestore.");
      return;
    }

    console.log("Seeding database in Firestore...");
    const batch = db.batch();

    // 1. Seed Members
    MEMBER_NAMES.forEach((name, i) => {
      const isJai = name === 'Jai';
      let role = 'active';
      if (isJai) {
        role = 'admin';
      } else {
        if (i % 7 === 0) role = 'classic';
        else if (i % 5 === 0) role = 'lurker';
      }

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

      const memberDoc = {
        id: i + 1,
        name,
        role,
        status,
        tagline,
        emoji,
        gradient,
        avatar
      };

      const docRef = db.collection('members').doc(String(i + 1));
      batch.set(docRef, memberDoc);
    });

    // 2. Seed Announcements
    const announcements = [
      { id: 1, title: 'Summer Meetup RSVP Open', content: 'Our annual Summer Mongsters Bash is scheduled for July 12th. Check the polling links and RSVP by Sunday!', isPinned: true, date: '2026-05-22' },
      { id: 2, title: 'No Chain Message Rule Reminder', content: 'Avoid forwarding external commercial links and good morning images to prevent notification fatigue. Banter stays in-house!', isPinned: false, date: '2026-05-18' }
    ];
    announcements.forEach(ann => {
      const docRef = db.collection('announcements').doc(String(ann.id));
      batch.set(docRef, ann);
    });

    // 3. Seed Gallery
    const gallery = [
      { id: 1, title: 'Pondicherry road Trip', tag: 'Meetup', date: 'Oct 2012', imageUrl: '/gallery/pondy.jpg' },
      { id: 2, title: 'Austin, Tx Meet up', tag: 'Admin', date: 'March 2015', imageUrl: '/gallery/austin.jpg' },
      { id: 3, title: 'The WhatsApp Admin Meet', tag: 'Screenshot', date: 'Apr 2025', bg: 'linear-gradient(135deg, #39ff14 0%, #00e5ff 100%)', symbol: 'bubble' },
      { id: 4, title: 'Late Night Chai Gathering', tag: 'Meetup', date: 'Jun 2025', bg: 'linear-gradient(135deg, #ffe600 0%, #ff007f 100%)', symbol: 'chai' }
    ];
    gallery.forEach(item => {
      const docRef = db.collection('gallery').doc(String(item.id));
      batch.set(docRef, item);
    });

    await batch.commit();
    console.log("Firestore database seeded successfully!");
  } catch (err) {
    console.error("Failed to seed Firestore database:", err);
    isFirestoreOffline = true;
  }
}

// Trigger Seeding
initDatabase();

// ==========================================================================
// REST API ROUTES
// ==========================================================================

// Local memory fallback data structures for local development when GCP credentials are not active
const localMembers = MEMBER_NAMES.map((name, i) => {
  const isJai = name === 'Jai';
  let role = 'active';
  if (isJai) role = 'admin';
  else {
    if (i % 7 === 0) role = 'classic';
    else if (i % 5 === 0) role = 'lurker';
  }
  let status = isJai ? 'legendary' : (i % 3 === 0 ? 'online' : 'offline');
  return {
    id: i + 1,
    name,
    role,
    status,
    tagline: taglines[i % taglines.length],
    emoji: emojis[i % emojis.length],
    gradient: gradients[i % gradients.length],
    avatar: isJai ? '/avatars/jai.jpg' : null
  };
});

const localAnnouncements = [
  { id: 1, title: 'Summer Meetup RSVP Open', content: 'Our annual Summer Mongsters Bash is scheduled for July 12th. Check the polling links and RSVP by Sunday!', isPinned: true, date: '2026-05-22' },
  { id: 2, title: 'No Chain Message Rule Reminder', content: 'Avoid forwarding external commercial links and good morning images to prevent notification fatigue. Banter stays in-house!', isPinned: false, date: '2026-05-18' }
];

const localGallery = [
  { id: 1, title: 'Pondicherry road Trip', tag: 'Meetup', date: 'Oct 2012', imageUrl: '/gallery/pondy.jpg' },
  { id: 2, title: 'Austin, Tx Meet up', tag: 'Admin', date: 'March 2015', imageUrl: '/gallery/austin.jpg' },
  { id: 3, title: 'The WhatsApp Admin Meet', tag: 'Screenshot', date: 'Apr 2025', bg: 'linear-gradient(135deg, #39ff14 0%, #00e5ff 100%)', symbol: 'bubble' },
  { id: 4, title: 'Late Night Chai Gathering', tag: 'Meetup', date: 'Jun 2025', bg: 'linear-gradient(135deg, #ffe600 0%, #ff007f 100%)', symbol: 'chai' }
];

let localRequests = [];

const filterResults = (results, query) => {
  let filtered = [...results];
  const { search, role } = query;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(m => m.name.toLowerCase().includes(q) || m.tagline.toLowerCase().includes(q));
  }
  if (role && role !== 'all') {
    filtered = filtered.filter(m => m.role === role);
  }
  return filtered;
};

// 1. Members Endpoints
app.get('/api/members', async (req, res) => {
  if (isFirestoreOffline) {
    return res.json(filterResults(localMembers, req.query));
  }
  try {
    const snapshot = await db.collection('members').get();
    let results = [];
    snapshot.forEach(doc => results.push(doc.data()));
    res.json(filterResults(results, req.query));
  } catch (err) {
    console.warn("Firestore unavailable, toggling offline status and serving local mock members:", err.message);
    isFirestoreOffline = true;
    res.json(filterResults(localMembers, req.query));
  }
});

// 2. Announcements Endpoints
app.get('/api/announcements', async (req, res) => {
  if (isFirestoreOffline) {
    return res.json([...localAnnouncements].sort((a, b) => b.id - a.id));
  }
  try {
    const snapshot = await db.collection('announcements').get();
    const results = [];
    snapshot.forEach(doc => results.push(doc.data()));
    results.sort((a, b) => b.id - a.id); // Newest first
    res.json(results);
  } catch (err) {
    console.warn("Firestore unavailable, toggling offline status and serving local mock announcements:", err.message);
    isFirestoreOffline = true;
    res.json([...localAnnouncements].sort((a, b) => b.id - a.id));
  }
});

app.post('/api/announcements', async (req, res) => {
  const { title, content, isPinned } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const snapshot = await db.collection('announcements').get();
    const nextId = snapshot.size + 1;

    const newAnnouncement = {
      id: nextId,
      title,
      content,
      isPinned: !!isPinned,
      date: new Date().toISOString().split('T')[0]
    };

    await db.collection('announcements').doc(String(nextId)).set(newAnnouncement);
    res.status(201).json(newAnnouncement);
  } catch (err) {
    console.error("Error creating announcement in Firestore, using mock state:", err);
    const nextId = localAnnouncements.length + 1;
    const newAnnouncement = {
      id: nextId,
      title,
      content,
      isPinned: !!isPinned,
      date: new Date().toISOString().split('T')[0]
    };
    localAnnouncements.push(newAnnouncement);
    res.status(201).json(newAnnouncement);
  }
});

// 3. Gallery Endpoints
app.get('/api/gallery', async (req, res) => {
  if (isFirestoreOffline) {
    return res.json([...localGallery].sort((a, b) => b.id - a.id));
  }
  try {
    const snapshot = await db.collection('gallery').get();
    const results = [];
    snapshot.forEach(doc => results.push(doc.data()));
    results.sort((a, b) => b.id - a.id); // Newest first
    res.json(results);
  } catch (err) {
    console.warn("Firestore unavailable, toggling offline status and serving local mock gallery:", err.message);
    isFirestoreOffline = true;
    res.json([...localGallery].sort((a, b) => b.id - a.id));
  }
});

// Upload media to gallery and save to Firebase Storage
app.post('/api/gallery/upload', upload.single('media'), async (req, res) => {
  const { title, tag } = req.body;
  if (!title || !req.file) {
    return res.status(400).json({ error: 'Title and image file are required' });
  }

  try {
    const blobName = `uploads/${Date.now()}-${req.file.originalname}`;
    const blob = bucket.file(blobName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      },
      resumable: false
    });

    blobStream.on('error', (err) => {
      console.error("Blob stream error:", err);
      res.status(500).json({ error: 'Error uploading image to storage' });
    });

    blobStream.on('finish', async () => {
      let publicUrl;
      try {
        await blob.makePublic();
        publicUrl = `https://storage.googleapis.com/${bucket.name}/${blobName}`;
      } catch (makePublicErr) {
        console.warn("Could not make blob public, using fallback media link:", makePublicErr);
        publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blobName)}?alt=media`;
      }

      const snapshot = await db.collection('gallery').get();
      const nextId = snapshot.size + 1;

      const newPhoto = {
        id: nextId,
        title,
        tag: tag || 'Upload',
        date: 'Just Now',
        imageUrl: publicUrl,
        isUploaded: true
      };

      await db.collection('gallery').doc(String(nextId)).set(newPhoto);
      res.status(201).json(newPhoto);
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    console.error("Error uploading photo:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. Onboarding Request Endpoint
app.post('/api/contact/request', async (req, res) => {
  const { name, phone, referer, reason, handle } = req.body;

  if (!name || !phone || !referer || !reason) {
    return res.status(400).json({ error: 'All fields except Instagram handle are required' });
  }

  const nextId = (isFirestoreOffline ? localRequests.length : 0) + 1;
  const newRequest = {
    id: nextId,
    name,
    phone,
    referer,
    reason,
    handle: handle || '',
    date: new Date().toISOString()
  };

  if (isFirestoreOffline) {
    localRequests.push(newRequest);
    return res.status(201).json({ message: 'Request submitted successfully' });
  }

  try {
    const snapshot = await db.collection('requests').get();
    const dbNextId = snapshot.size + 1;
    newRequest.id = dbNextId;
    await db.collection('requests').doc(String(dbNextId)).set(newRequest);
    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (err) {
    console.error("Error submitting request, saving locally:", err);
    isFirestoreOffline = true;
    newRequest.id = localRequests.length + 1;
    localRequests.push(newRequest);
    res.status(201).json({ message: 'Request submitted successfully' });
  }
});

// 5. Admin Endpoints
const ADMIN_PASSWORD = 'mongsters2026';

// Middleware to check admin password
const adminAuth = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized. Invalid admin password.' });
  }
  next();
};

app.get('/api/admin/requests', adminAuth, async (req, res) => {
  if (isFirestoreOffline) {
    const sorted = [...localRequests].sort((a, b) => new Date(b.date) - new Date(a.date));
    return res.json(sorted);
  }
  try {
    const snapshot = await db.collection('requests').get();
    const results = [];
    snapshot.forEach(doc => results.push(doc.data()));
    results.sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
    res.json(results);
  } catch (err) {
    console.error("Error fetching admin requests, serving local:", err);
    isFirestoreOffline = true;
    const sorted = [...localRequests].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sorted);
  }
});

app.delete('/api/admin/requests/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const reqId = parseInt(id);

  if (isFirestoreOffline) {
    localRequests = localRequests.filter(r => r.id !== reqId && String(r.id) !== id);
    return res.json({ message: `Request ${id} deleted successfully` });
  }
  try {
    await db.collection('requests').doc(String(id)).delete();
    res.json({ message: `Request ${id} deleted successfully` });
  } catch (err) {
    console.error(`Error deleting request ${id}, using local fallback:`, err);
    isFirestoreOffline = true;
    localRequests = localRequests.filter(r => r.id !== reqId && String(r.id) !== id);
    res.json({ message: `Request ${id} deleted successfully` });
  }
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
