const express = require('express');
const { body, validationResult } = require('express-validator');
const Route = require('../models/Route');
const { calculateRouteDistance, estimateTime } = require('../utils/calculations');

const router = express.Router();

// POST /api/routes - Save route
router.post('/', [
  body('waypoints').isArray().withMessage('Waypoints must be an array'),
  body('waypoints.*.lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('waypoints.*.lng').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, waypoints } = req.body;
    
    const totalDistance = calculateRouteDistance(waypoints);
    const estimatedTime = estimateTime(totalDistance);

    const route = new Route({
      name: name || 'Untitled Route',
      waypoints,
      totalDistance,
      estimatedTime
    });

    await route.save();
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/routes/analyze - Analyze route
router.post('/analyze', [
  body('waypoints').isArray().withMessage('Waypoints must be an array'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { waypoints } = req.body;
    
    const totalDistance = calculateRouteDistance(waypoints);
    const estimatedTime = estimateTime(totalDistance);
    
    const analytics = {
      totalDistance,
      estimatedTime,
      waypointCount: waypoints.length,
      avgDistanceBetweenWaypoints: waypoints.length > 1 ? 
        Math.round((totalDistance / (waypoints.length - 1)) * 100) / 100 : 0
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/routes/export/:id - Export route
router.get('/export/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const geoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: route.waypoints.map(wp => [wp.lng, wp.lat])
          },
          properties: {
            name: route.name,
            totalDistance: route.totalDistance,
            estimatedTime: route.estimatedTime
          }
        },
        ...route.waypoints.map((wp, index) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [wp.lng, wp.lat]
          },
          properties: {
            name: wp.name || `Waypoint ${index + 1}`,
            order: index + 1
          }
        }))
      ]
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=route-${route._id}.geojson`);
    res.json(geoJson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/routes/import - Import GeoJSON
router.post('/import', async (req, res) => {
  try {
    const { geojson, name } = req.body;
    
    if (!geojson || !geojson.features) {
      return res.status(400).json({ error: 'Invalid GeoJSON format' });
    }

    const waypoints = [];
    
    geojson.features.forEach(feature => {
      if (feature.geometry.type === 'Point') {
        const [lng, lat] = feature.geometry.coordinates;
        waypoints.push({
          lat,
          lng,
          name: feature.properties?.name || ''
        });
      } else if (feature.geometry.type === 'LineString') {
        feature.geometry.coordinates.forEach(([lng, lat]) => {
          waypoints.push({ lat, lng, name: '' });
        });
      }
    });

    if (waypoints.length === 0) {
      return res.status(400).json({ error: 'No valid waypoints found in GeoJSON' });
    }

    const totalDistance = calculateRouteDistance(waypoints);
    const estimatedTime = estimateTime(totalDistance);

    const route = new Route({
      name: name || 'Imported Route',
      waypoints,
      totalDistance,
      estimatedTime
    });

    await route.save();
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/routes - Get all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;