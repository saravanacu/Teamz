const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const clubs = require('./clubs.json');

const app = express();
app.use(cors());
app.use(express.json());

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = v => v * Math.PI / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

app.get('/api/clubs', (req, res) => {
  let result = clubs.slice();

  const { q, city, lat, lng, radius } = req.query;

  if (q) {
    const ql = q.toLowerCase();
    result = result.filter(c => (c.name + ' ' + (c.description||'')).toLowerCase().includes(ql));
  }
  if (city) {
    const cl = city.toLowerCase();
    result = result.filter(c => (c.city || '').toLowerCase() === cl);
  }

  if (lat && lng) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    result = result.map(c => {
      const d = haversineDistance(latNum, lngNum, c.location.lat, c.location.lng);
      return { ...c, distance_km: Math.round(d * 10) / 10 };
    });
    if (radius) {
      const r = parseFloat(radius);
      result = result.filter(c => c.distance_km <= r);
    }
    // sort by distance
    result.sort((a,b) => (a.distance_km||9999) - (b.distance_km||9999));
  }
  res.json({ data: result });
});

app.get('/api/clubs/:id', (req, res) => {
  const c = clubs.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  res.json({ data: c });
});

// Create a new club
app.post('/api/clubs', (req, res) => {
  const { name, city, address, description, phone, website, thumbnail_url, lat, lng } = req.body;
  if (!name || !city) return res.status(400).json({ error: 'name and city required' });

  // generate next id (strings in existing data)
  const maxId = clubs.reduce((m, c) => Math.max(m, parseInt(c.id, 10) || 0), 0);
  const id = String(maxId + 1);

  const location = (lat !== undefined && lng !== undefined) ? { lat: parseFloat(lat), lng: parseFloat(lng) } : (req.body.location || undefined);

  const newClub = {
    id,
    name,
    description: description || '',
    address: address || '',
    city,
    phone: phone || '',
    website: website || '',
    thumbnail_url: thumbnail_url || '',
    location
  };

  clubs.push(newClub);

  // try to persist to file; failure isn't fatal
  try {
    fs.writeFileSync(path.join(__dirname, 'clubs.json'), JSON.stringify(clubs, null, 2));
  } catch (err) {
    console.error('Failed to write clubs.json', err);
  }

  res.status(201).json({ data: newClub });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Mock server running on http://localhost:${PORT}`));