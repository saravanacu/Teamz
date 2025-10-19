import React, { useState } from 'react';
import ClubCard from './ClubCard';
import ClubProfileModal from './ClubProfileModal';

export default function ClubList({ clubs, loading }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="list-container">
      {loading && <div className="loading">Loading...</div>}
      {!loading && clubs.length === 0 && <div className="empty">No clubs found.</div>}
      <div className="cards">
        {clubs.map(c => (
          <ClubCard key={c.id} club={c} onView={() => setSelected(c)} />
        ))}
      </div>

      {selected && (
        <ClubProfileModal clubId={selected.id} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}