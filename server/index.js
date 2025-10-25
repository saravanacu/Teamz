const express = require('express');
const cors = require('cors');
const path = require('path');
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Mock server running on http://localhost:${PORT}`));