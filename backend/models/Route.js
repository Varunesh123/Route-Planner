const mongoose = require('mongoose');

const waypointSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  name: { type: String, default: '' }
});

const routeSchema = new mongoose.Schema({
  name: { type: String, default: 'Untitled Route' },
  waypoints: [waypointSchema],
  totalDistance: { type: Number, default: 0 }, // in kilometers
  estimatedTime: { type: Number, default: 0 }, // in minutes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

routeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Route', routeSchema);