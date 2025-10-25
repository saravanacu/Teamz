import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const ClubMapView = ({ clubs }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize only once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json", // free style
      center: [78.9629, 20.5937], // India center
      zoom: 4
    });

    // Add zoom controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
  }, []);

  // Add markers
  useEffect(() => {
    if (!map.current) return;
    clubs.forEach((club) => {
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <strong>${club.name}</strong><br/>
        ${club.city}<br/>
        ${club.description}
      `);

      new maplibregl.Marker({ color: "red" })
        .setLngLat([club.location.lng, club.location.lat])
        .setPopup(popup)
        .addTo(map.current);
    });
  }, [clubs]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
};

export default ClubMapView;