const express = require("express");
const router = express.Router();
const simulationController = require("../controllers/simulationController");

// POST /api/simulate
router.post("/simulate", simulationController.createSimulation);

module.exports = router;
