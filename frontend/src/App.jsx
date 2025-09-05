import React, { useState } from 'react';
import Map from './components/Map';
import RouteInfo from './components/RouteInfo';
import FileUpload from './components/FileUpload';
import { saveRoute, analyzeRoute, importGeoJSON } from './services/api';
import './App.css';

function App() {
  const [waypoints, setWaypoints] = useState([]);
  const [routeStats, setRouteStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleMapClick = (lat, lng) => {
    const newWaypoint = { lat, lng, name: `Point ${waypoints.length + 1}` };
    const updatedWaypoints = [...waypoints, newWaypoint];
    setWaypoints(updatedWaypoints);
    analyzeRouteData(updatedWaypoints);
  };

  const analyzeRouteData = async (points) => {
    if (points.length < 2) {
      setRouteStats(null);
      return;
    }

    try {
      const stats = await analyzeRoute(points);
      setRouteStats(stats);
    } catch (err) {
      console.error('Error analyzing route:', err);
    }
  };

  const handleClearRoute = () => {
    setWaypoints([]);
    setRouteStats(null);
    setError('');
    setSuccess('');
  };

  const handleSaveRoute = async () => {
    if (waypoints.length < 2) {
      setError('Please add at least 2 waypoints to save a route');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await saveRoute({
        name: `Route ${new Date().toLocaleDateString()}`,
        waypoints
      });
      setSuccess('Route saved successfully!');
    } catch (err) {
      setError('Failed to save route: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileImport = async (geojson) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const route = await importGeoJSON(geojson, 'Imported Route');
      setWaypoints(route.waypoints);
      setRouteStats({
        totalDistance: route.totalDistance,
        estimatedTime: route.estimatedTime,
        waypointCount: route.waypoints.length
      });
      setSuccess('GeoJSON imported successfully!');
    } catch (err) {
      setError('Failed to import file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      // Simple geocoding using Nominatim (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const results = await response.json();
      
      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        const newWaypoint = { 
          lat: parseFloat(lat), 
          lng: parseFloat(lon), 
          name: display_name 
        };
        const updatedWaypoints = [...waypoints, newWaypoint];
        setWaypoints(updatedWaypoints);
        analyzeRouteData(updatedWaypoints);
      } else {
        setError('Location not found');
      }
    } catch (err) {
      setError('Search failed: ' + err.message);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Multi-Stop Route Planner</h1>
        <div className="controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for a location..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleSearch(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
          </div>
          <div className="button-group">
            <FileUpload onImport={handleFileImport} />
            <button 
              onClick={handleClearRoute}
              className="btn btn-secondary"
            >
              Clear Route
            </button>
            <button 
              onClick={handleSaveRoute}
              disabled={loading || waypoints.length < 2}
              className="btn btn-primary"
            >
              {loading ? 'Saving...' : 'Save Route'}
            </button>
          </div>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="main-content">
        <div className="map-container">
          <Map 
            waypoints={waypoints} 
            onMapClick={handleMapClick}
          />
        </div>
        <div className="sidebar">
          <RouteInfo 
            waypoints={waypoints} 
            routeStats={routeStats}
          />
        </div>
      </div>
    </div>
  );
}

export default App;