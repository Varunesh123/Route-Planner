// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Calculate total route distance
function calculateRouteDistance(waypoints) {
  if (waypoints.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const distance = calculateDistance(
      waypoints[i].lat,
      waypoints[i].lng,
      waypoints[i + 1].lat,
      waypoints[i + 1].lng
    );
    totalDistance += distance;
  }
  
  return Math.round(totalDistance * 100) / 100; // Round to 2 decimal places
}

// Estimate travel time (assuming average speed of 50 km/h)
function estimateTime(distance) {
  const averageSpeed = 50; // km/h
  const timeInHours = distance / averageSpeed;
  return Math.round(timeInHours * 60); // Convert to minutes
}

module.exports = {
  calculateDistance,
  calculateRouteDistance,
  estimateTime
};