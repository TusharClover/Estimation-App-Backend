const express = require('express');
const { getAllPhases, getPhasesByEstimationId, createPhasesForEstimation } = require("../controllers/phasesController");

const router = express.Router();

router.get('/getAllPhases', getAllPhases);
router.get('/getPhasesByEstimationId/:estimation_id', getPhasesByEstimationId);
router.post('/createPhasesForEstimation', createPhasesForEstimation);

module.exports = router;