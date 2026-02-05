const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');

// Substance Routes
router.get('/substances', simulationController.getSubstances);

// Simulation Routes
router.post('/simulate', simulationController.runSimulation);

module.exports = router;