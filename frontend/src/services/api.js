import axios from 'axios';

const API_BASE_URL = /*process.env.REACT_APP_API_URL ||*/ 'https://route-planner-in4s.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    throw new Error(message);
  }
);

export const saveRoute = async (routeData) => {
  const response = await api.post('/routes', routeData);
  return response.data;
};

export const analyzeRoute = async (waypoints) => {
  const response = await api.post('/routes/analyze', { waypoints });
  return response.data;
};

export const exportRoute = async (routeId) => {
  const response = await api.get(`/routes/export/${routeId}`, {
    responseType: 'blob'
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `route-${routeId}.geojson`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const importGeoJSON = async (geojson, name = 'Imported Route') => {
  const response = await api.post('/routes/import', { geojson, name });
  return response.data;
};

export const getAllRoutes = async () => {
  const response = await api.get('/routes');
  return response.data;
};