import React, { useEffect, useState } from 'react';
import ClubList from './components/ClubList';
import ClubMap from './components/ClubMap';
import ClubMapView from './components/ClubMapView';
import { fetchClubs } from './api';

export default function App() {
  const [view, setView] = useState('list'); // 'list' or 'map'
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    loadClubs();
    // try geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, () => {});
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadClubs();
    // eslint-disable-next-line
  }, [q, city, userLocation]);

  async function loadClubs() {
    setLoading(true);
    const params = {};
    if (q) params.q = q;
    if (city) params.city = city;
    if (userLocation) {
      params.lat = userLocation.lat;
      params.lng = userLocation.lng;
      params.radius = 200; // 200 km default search radius
    }
    try {
      const data = await fetchClubs(params);
      setClubs(data);
    } catch (err) {
      console.error(err);
      setClubs([]);
    }
    setLoading(false);
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>Basketball Clubs</h1>
        <div className="controls">
          <input placeholder="Search clubs or coaches..." value={q} onChange={e=>setQ(e.target.value)} />
          <input placeholder="City" value={city} onChange={e=>setCity(e.target.value)} />
          <button onClick={() => setView(view === 'list' ? 'map' : 'list')}>
            {view === 'list' ? 'Map View' : 'List View'}
          </button>
        </div>
      </header>

      <main className="main">
        {view === 'list' ? (
          <ClubList clubs={clubs} loading={loading} />
        ) : view === 'map' ? (
          <ClubMap clubs={clubs} userLocation={userLocation} />
        ) : (
          <>
            <h2 style={{ textAlign: "center" }}>🏀 Basketball Club Map</h2>
            <ClubMapView clubs={clubs} />
          </>
        )}
      </main>
    </div>
  );
}