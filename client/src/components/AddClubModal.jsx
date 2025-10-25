import React, { useState } from 'react';
import { addClub } from '../api';

export default function AddClubModal({ onClose, onAdded }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    // Require all main fields
    if (!name.trim() || !city.trim() || !address.trim()) {
      setError('Name, city and address are required');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        city: city.trim(),
        address: address.trim(),
      };
      if (imageUrl && imageUrl.trim()) payload.thumbnail_url = imageUrl.trim();

      const newClub = await addClub(payload);
      if (onAdded) onAdded(newClub);
    } catch (err) {
      console.error(err);
      setError('Failed to add club');
    }
    setLoading(false);
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2>Add Club</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Club name (required)" value={name} onChange={e=>setName(e.target.value)} required />
          <input placeholder="City (required)" value={city} onChange={e=>setCity(e.target.value)} required />
          <input placeholder="Address (required)" value={address} onChange={e=>setAddress(e.target.value)} required />
          <input placeholder="Image URL (optional)" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} />
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Club'}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
