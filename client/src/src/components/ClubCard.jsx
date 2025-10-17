import React from 'react';

export default function ClubCard({ club, onView }) {
  return (
    <div className="card">
      <img src={club.thumbnail_url} alt={club.name} className="thumb" />
      <div className="card-body">
        <h3>{club.name}</h3>
        <p className="muted">{club.city} — {club.address}</p>
        <p>{club.description}</p>
        {club.distance_km !== undefined && (
          <p className="muted">Distance: {club.distance_km} km</p>
        )}
        <div className="card-actions">
          <button onClick={onView}>View profile</button>
          <a href={club.website} target="_blank" rel="noreferrer">Website</a>
        </div>
      </div>
    </div>
  );
}