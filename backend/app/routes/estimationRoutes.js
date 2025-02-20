const express = require('express');
const { createEstimation, getEstimationsByUserId, getEstimationsById, updateEstimationById, getEstimationByUserId, deleteEstimationById } = require("../controllers/estimationController");

const router = express.Router();

router.post('/createEstimation', createEstimation);
router.get('/getEstimationsByUserId/:id', getEstimationsByUserId);
router.get('/getEstimationsById/:id', getEstimationsById);
router.put('/updateEstimationById', updateEstimationById);
router.get('/getEstimationsByUserId/:id', getEstimationByUserId);
router.delete('/deleteEstimationById/:id', deleteEstimationById);

module.exports = router;