const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'gfwc.json');
const SEED_FILE = path.join(__dirname, 'seed.json');

app.use(express.json({ limit: '4mb' }));
app.use(express.static(__dirname));

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// seed on first boot if no data file exists yet
if (!fs.existsSync(DATA_FILE)) {
  fs.copyFileSync(SEED_FILE, DATA_FILE);
  console.log('Seeded data from seed.json');
}

app.get('/api/data', (req, res) => {
  try {
    res.json(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/data', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`GFWC running on port ${PORT}`));
