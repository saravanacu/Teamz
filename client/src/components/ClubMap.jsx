import React, { useState } from 'react';
// import Map, { Marker, Popup } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
import ClubProfileModal from './ClubProfileModal';

const MAP_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function ClubMap({ clubs, userLocation }) {
  const [popup, setPopup] = useState(null);
  const [selectedClubId, setSelectedClubId] = useState(null);

  const initialViewState = {
    longitude: userLocation?.lng ?? (clubs[0]?.location?.lng ?? 77.59),
    latitude: userLocation?.lat ?? (clubs[0]?.location?.lat ?? 12.97),
    zoom: 8
  };

  return (
    <div className="map-wrap">
      <Map
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAP_TOKEN}
      >
        {userLocation && (
          <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
            <div className="user-marker">📍</div>
          </Marker>
        )}

        {clubs.map(club => (
          <Marker key={club.id} longitude={club.location.lng} latitude={club.location.lat}>
            <button
              className="marker-btn"
              onClick={(e) => {
                e.preventDefault();
                setPopup(club);
              }}
            >
              🏀
            </button>
          </Marker>
        ))}

        {popup && (
          <Popup
            longitude={popup.location.lng}
            latitude={popup.location.lat}
            anchor="top"
            onClose={() => setPopup(null)}
          >
            <div style={{ width: 200 }}>
              <img src={popup.thumbnail_url} alt="" style={{ width: '100%', height: 100, objectFit: 'cover' }} />
              <h4>{popup.name}</h4>
              <p className="muted">{popup.city}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setSelectedClubId(popup.id)}>View</button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${popup.location.lat},${popup.location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Directions
                </a>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {selectedClubId && (
        <ClubProfileModal clubId={selectedClubId} onClose={() => setSelectedClubId(null)} />
      )}
    </div>
  );
}