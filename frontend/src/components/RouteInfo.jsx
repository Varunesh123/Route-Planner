import React from 'react';

function RouteInfo({ waypoints, routeStats }) {
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="route-info">
      <h3>Route Information</h3>
      
      <div className="stats-grid">
        <div className="stat-item">
          <label>Waypoints:</label>
          <span>{waypoints.length}</span>
        </div>
        
        {routeStats && (
          <>
            <div className="stat-item">
              <label>Total Distance:</label>
              <span>{routeStats.totalDistance} km</span>
            </div>
            
            <div className="stat-item">
              <label>Estimated Time:</label>
              <span>{formatTime(routeStats.estimatedTime)}</span>
            </div>
            
            {routeStats.avgDistanceBetweenWaypoints && (
              <div className="stat-item">
                <label>Avg Distance:</label>
                <span>{routeStats.avgDistanceBetweenWaypoints} km</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="waypoints-list">
        <h4>Waypoints</h4>
        {waypoints.length === 0 ? (
          <p className="no-waypoints">
            Click on the map to add waypoints or search for locations
          </p>
        ) : (
          <div className="waypoints">
            {waypoints.map((waypoint, index) => (
              <div key={index} className="waypoint-item">
                <div className="waypoint-number">{index + 1}</div>
                <div className="waypoint-info">
                  <div className="waypoint-name">
                    {waypoint.name || `Waypoint ${index + 1}`}
                  </div>
                  <div className="waypoint-coords">
                    {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {waypoints.length > 0 && (
        <div className="instructions">
          <h4>Instructions</h4>
          <ul>
            <li>Click on the map to add more waypoints</li>
            <li>Use the search bar to find specific locations</li>
            <li>Save your route when you're satisfied</li>
            <li>Export the map as an image if needed</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default RouteInfo;