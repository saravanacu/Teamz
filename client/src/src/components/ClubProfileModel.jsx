import React, { useEffect, useState } from 'react';
import { fetchClubById } from '../api';

export default function ClubProfileModal({ clubId, onClose }) {
  const [club, setClub] = useState(null);

  useEffect(() => {
    fetchClubById(clubId).then(setClub).catch(console.error);
  }, [clubId]);

  if (!club) return (
    <div className="modal">
      <div className="modal-content">Loading...</div>
    </div>
  );

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✖</button>
        <img src={club.thumbnail_url} alt="" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
        <h2>{club.name}</h2>
        <p className="muted">{club.address} — {club.city}</p>
        <p>{club.description}</p>
        <p>Phone: {club.phone}</p>
        <p><a href={club.website} target="_blank" rel="noreferrer">Website</a></p>
      </div>
    </div>
  );
}