# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


### Routes
- `POST /api/routes` - Save route with waypoints
- `POST /api/routes/analyze` - Analyze route and return statistics
- `GET /api/routes/export/:id` - Export route data
- `POST /api/routes/import` - Import GeoJSON file

## Features

### Frontend
- Interactive Leaflet map with OpenStreetMap tiles
- Click to add waypoints
- Search locations (basic geocoding)
- Display route with distance and time
- Clear route functionality
- Save route to database
- Import GeoJSON files
- Export map as image
- Responsive design

### Backend
- RESTful API with Express.js
- MongoDB with Mongoose for data persistence
- Route calculation using Turf.js
- GeoJSON import/export
- Input validation and error handling
- CORS configuration

## Testing

1. Start both backend and frontend servers
2. Open http://localhost:3000
3. Click on map to add waypoints
4. Use search to find locations
5. Save routes and test import/export functionality
