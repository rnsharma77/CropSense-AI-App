require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env")
});
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5050;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not set. Copy server/.env.example to server/.env and configure.');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

let dbClient;
let analysesColl;
let dbReady = false;

async function initDb() {
  try {
    console.log('Attempting MongoDB connection...');
    dbClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    await dbClient.connect();
    const db = dbClient.db();
    analysesColl = db.collection('analyses');
    dbReady = true;
    console.log('✓ Connected to MongoDB successfully');
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
    console.error('Please ensure:');
    console.error('  1. MongoDB URI is correct in .env');
    console.error('  2. MongoDB Atlas cluster is active');
    console.error('  3. Your IP is whitelisted in MongoDB Atlas');
    throw err;
  }
}

app.post('/api/analysis', async (req, res) => {
  const payload = req.body || {};
  try {
    if (!dbReady || !analysesColl) {
      return res.status(503).json({ error: 'Database not ready. Please try again in a moment.' });
    }

    const doc = {
      timestamp: new Date(),
      summary: payload.summary || null,
      disease: payload.disease || null,
      confidence: payload.confidence || null,
      plantInfo: payload.plantInfo || null,
      isDemo: payload.isDemo === true,
      meta: payload.meta || null,
    };

    const result = await analysesColl.insertOne(doc);
    return res.json({ ok: true, id: result.insertedId });
  } catch (err) {
    console.error('Insert error:', err);
    return res.status(500).json({ error: 'Failed to save analysis' });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

// List analyses with optional limit and skip
app.get('/api/analyses', async (req, res) => {
  try {
    if (!dbReady || !analysesColl) {
      return res.status(503).json({ error: 'Database not ready. Please try again in a moment.' });
    }
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const skip = Math.max(parseInt(req.query.skip || '0', 10), 0);
    const cursor = analysesColl.find({}).sort({ timestamp: -1 }).skip(skip).limit(limit);
    const items = await cursor.toArray();
    return res.json({ ok: true, items });
  } catch (err) {
    console.error('Fetch analyses error:', err);
    return res.status(500).json({ error: 'Failed to fetch analyses' });
  }
});

// Delete a single analysis by ID
app.delete('/api/analysis/:id', async (req, res) => {
  try {
    if (!analysesColl) return res.status(500).json({ error: 'Database not initialized' });
    const { ObjectId } = require('mongodb');
    const id = new ObjectId(req.params.id);
    const result = await analysesColl.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    return res.json({ ok: true, deleted: true });
  } catch (err) {
    console.error('Delete analysis error:', err);
    return res.status(500).json({ error: 'Failed to delete analysis' });
  }
});

initDb().then(() => {
  app.listen(PORT, () => console.log(`Server listening ${PORT}`));
}).catch(err => {
  console.error('Init DB failed:', err);
  app.listen(PORT, () => console.log(`Server listening ${PORT} (no DB)`));
});
