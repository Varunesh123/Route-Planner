import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import html2canvas from 'html2canvas';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function Map({ waypoints, onMapClick }) {
  const mapRef = useRef();

  const exportMap = async () => {
    try {
      const mapElement = mapRef.current?.getContainer();
      if (mapElement) {
        const canvas = await html2canvas(mapElement);
        const link = document.createElement('a');
        link.download = 'route-map.png';
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Error exporting map:', error);
    }
  };

  const routeCoordinates = waypoints.map(wp => [wp.lat, wp.lng]);
  const center = waypoints.length > 0 
    ? [waypoints[0].lat, waypoints[0].lng] 
    : [40.7128, -74.0060]; // Default to NYC

  return (
    <div className="map-wrapper">
      <div className="map-controls">
        <button 
          onClick={exportMap}
          className="btn btn-small"
          disabled={waypoints.length === 0}
        >
          Export Map
        </button>
      </div>
      
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={onMapClick} />
        
        {waypoints.map((waypoint, index) => (
          <Marker 
            key={index} 
            position={[waypoint.lat, waypoint.lng]}
          >
            <Popup>
              <strong>Waypoint {index + 1}</strong>
              <br />
              {waypoint.name}
              <br />
              Lat: {waypoint.lat.toFixed(6)}
              <br />
              Lng: {waypoint.lng.toFixed(6)}
            </Popup>
          </Marker>
        ))}
        
        {routeCoordinates.length > 1 && (
          <Polyline 
            positions={routeCoordinates} 
            color="blue" 
            weight={3}
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default Map;