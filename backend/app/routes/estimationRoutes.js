const express = require('express');
const { createEstimation, getEstimationsByUserId, getEstimationsById, updateEstimationById } = require("../controllers/estimationController");

const router = express.Router();

router.post('/createEstimation', createEstimation);
router.get('/getEstimationsByUserId/:id', getEstimationsByUserId);
router.get('/getEstimationsById/:id', getEstimationsById);
router.put('/updateEstimationById', updateEstimationById);

module.exports = router;