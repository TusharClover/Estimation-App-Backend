const express = require('express');
const { createCosting, getCostingById, insertEstimationStatus, updateEstimationStatus } = require("../controllers/costingController");

const router = express.Router();

router.post('/createCosting', createCosting);
router.get('/getCostingById/:id', getCostingById);
router.post('/insertEstimationStatus', insertEstimationStatus);
router.post('/updateEstimationStatus', updateEstimationStatus);

module.exports = router;